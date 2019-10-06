using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.IO;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using System.Text;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.Tools
{
    /// <summary>
    /// 整理缩略图控制器
    /// </summary>
    public class ArrangeThumbnailController : ApiBase
    {
        /// <summary>
        /// 开始执行
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.ARRANGE_THUMBNAIL)]
        public JsonResult Run()
        {
            var filePath = HttpContext.Current.Server.MapPath($"~/Upload/File");

            // 创建临时目录
            var now = DateTime.Now;
            var path = HttpContext.Current.Server.MapPath($"~/Upload/File{now.ToString("yyyyMMddHHmmss")}");

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            // 备份每个存在的数据表，并重新生成缩略图Url
            var collectionNames = new string[] {
                Constant.SceneCollectionName, Constant.MeshCollectionName, Constant.MapCollectionName,
                Constant.MaterialCollectionName, Constant.AudioCollectionName, Constant.AnimationCollectionName,
                Constant.ParticleCollectionName, Constant.PrefabCollectionName, Constant.CharacterCollectionName
            };

            var mongo = new MongoHelper();
            var mongoCollectionNames = mongo.ListCollections().ToList().Select(n => n["name"].ToString()).ToList();

            // 备份附件表
            var files = mongo.FindAll(Constant.FileCollectionName).ToList();
            if (files.Count > 0)
            {
                mongo.InsertMany($"{Constant.FileCollectionName}{now.ToString("yyyyMMddHHmmss")}", files);
            }
            mongo.DeleteAll(Constant.FileCollectionName);

            foreach (var i in collectionNames)
            {
                if (!mongoCollectionNames.Contains(i)) // Mongo中没有该数据表
                {
                    continue;
                }

                // 备份数据表
                var docs = mongo.FindAll(i).ToList();
                if (docs.Count > 0)
                {
                    mongo.InsertMany($"{i}{now.ToString("yyyyMMddHHmmss")}", docs);
                }

                // 重新生成缩略图路径，并复制文件
                // 生成规则：优先采用File表中的时间；如果没有从now开始，每秒创建一个文件夹，存放缩略图
                for (var j = 0; j < docs.Count; j++)
                {
                    var doc = docs[j];
                    if (!doc.Contains("Thumbnail") || doc["Thumbnail"].IsBsonNull || doc["Thumbnail"].ToString().Trim() == "")
                    {
                        // 未设置缩略图
                        continue;
                    }

                    var url = doc["Thumbnail"].ToString();
                    var time = now;
                    var file = files.Where(n => n.Contains("Url") && !n["Url"].IsBsonNull && n["Url"].ToString() == url).FirstOrDefault();
                    if (file != null && file.Contains("AddTime"))
                    {
                        time = file["AddTime"].ToUniversalTime();
                    }
                    else
                    {
                        now = now.AddSeconds(1);
                    }

                    // 拷贝文件并记录信息
                    var sourceFileName = HttpContext.Current.Server.MapPath($"~{url}");
                    var fileSize = 0L;
                    var fileNames = url.Split('/');
                    var fileName = fileNames.Length > 0 ? fileNames[fileNames.Length - 1] : "";

                    // 复制文件
                    if (File.Exists(sourceFileName))
                    {
                        fileSize = new FileInfo(sourceFileName).Length;

                        var destFileDir = $"{path}\\{time.ToString("yyyyMMddHHmmss")}";

                        if (!Directory.Exists(destFileDir))
                        {
                            Directory.CreateDirectory(destFileDir);
                        }

                        File.Copy(sourceFileName, $"{destFileDir}\\{fileName}", true);

                        url = $"/Upload/File/{time.ToString("yyyyMMddHHmmss")}/{fileName}";
                    }
                    else // 附件不存在
                    {
                        url = "";
                    }

                    // 更新数据表信息
                    var filter = Builders<BsonDocument>.Filter.Eq("_id", doc["_id"].AsObjectId);
                    var update = Builders<BsonDocument>.Update.Set("Thumbnail", url);
                    mongo.UpdateOne(i, filter, update);

                    // 更新附件表信息
                    var fileNameWithoutExt = fileName;
                    var index = fileNameWithoutExt.LastIndexOf(".");
                    if (index > -1)
                    {
                        fileNameWithoutExt = fileNameWithoutExt.Substring(0, index);
                    }

                    var pinyin = PinYinHelper.GetTotalPinYin(fileName);

                    // 添加附件信息（由于附件表已经清空，只能添加）
                    file = new BsonDocument
                    {
                        ["AddTime"] = DateTime.Now,
                        ["FileName"] = fileName,
                        ["FileSize"] = fileSize,
                        ["FileType"] = fileName.EndsWith("png") ? "image/png" : "image/jpeg",
                        ["FirstPinYin"] = new BsonArray(pinyin.FirstPinYin),
                        ["Name"] = fileNameWithoutExt,
                        ["SaveName"] = fileName,
                        ["SavePath"] = $"/Upload/File/{time.ToString("yyyyMMddHHmmss")}",
                        ["Thumbnail"] = url,
                        ["TotalPinYin"] = new BsonArray(pinyin.TotalPinYin),
                        ["Url"] = url
                    };

                    mongo.InsertOne(Constant.FileCollectionName, file);
                }
            }

            // 交换正式目录和临时目录
            Directory.Move(filePath, path + "_temp");
            Directory.Move(path, filePath);
            Directory.Move(path + "_temp", path);

            // 移除缩略图目录空文件夹
            DirectoryHelper.RemoveEmptyDir(filePath);

            return Json(new
            {
                Code = 200,
                Msg = "Execute sucessfully!"
            });
        }
    }
}
