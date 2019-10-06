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
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.Tools
{
    /// <summary>
    /// 整理贴图控制器
    /// </summary>
    public class ArrangeMapController : ApiBase
    {
        /// <summary>
        /// 开始执行
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.ARRANGE_MAP)]
        public JsonResult Run()
        {
            var texturePath = HttpContext.Current.Server.MapPath($"~/Upload/Texture");

            // 创建临时目录
            var now = DateTime.Now;
            var path = HttpContext.Current.Server.MapPath($"~/Upload/Texture{now.ToString("yyyyMMddHHmmss")}");

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            // 备份贴图数据表，并清空原数据表
            var mongo = new MongoHelper();
            var docs = mongo.FindAll(Constant.MapCollectionName).ToList();
            if (docs.Count > 0)
            {
                mongo.InsertMany($"{Constant.MapCollectionName}{now.ToString("yyyyMMddHHmmss")}", docs);
            }
            mongo.DeleteAll(Constant.MapCollectionName);

            // 读取贴图数据表，将文件完美复制到临时目录
            for (var i = 0; i < docs.Count; i++)
            {
                var doc = docs[i];

                // 更新名称
                var name = doc["Name"].ToString();
                name = StringHelper.RemoveEndNumbersAnd_(name);
                var pinyin = PinYinHelper.GetTotalPinYin(name);

                doc["Name"] = name;
                doc["FirstPinYin"] = new BsonArray(pinyin.FirstPinYin);
                doc["TotalPinYin"] = new BsonArray(pinyin.TotalPinYin);

                // 处理Url，并复制文件
                var urls = new List<string>();

                if (doc["Url"].IsString)
                {
                    urls.Add(doc["Url"].ToString());
                }
                else
                {
                    urls.Add(doc["Url"]["PosX"].ToString());
                    urls.Add(doc["Url"]["NegX"].ToString());
                    urls.Add(doc["Url"]["PosY"].ToString());
                    urls.Add(doc["Url"]["NegY"].ToString());
                    urls.Add(doc["Url"]["PosZ"].ToString());
                    urls.Add(doc["Url"]["NegZ"].ToString());
                }

                HandleUrl(urls.ToArray(), path, ref doc);

                // 更新路径和时间
                var createTime = doc["CreateTime"].ToUniversalTime();
                var savePath = $"/Upload/Texture/{createTime.ToString("yyyyMMddHHmmss")}";
                doc["SavePath"] = savePath.ToString();
                doc["UpdateTime"] = DateTime.Now;

                // 添加到Mongo数据表
                mongo.InsertOne(Constant.MapCollectionName, doc);
            }

            // 交换正式目录和临时目录
            Directory.Move(texturePath, path + "_temp");
            Directory.Move(path, texturePath);
            Directory.Move(path + "_temp", path);

            // 移除贴图目录空文件夹
            DirectoryHelper.RemoveEmptyDir(texturePath);

            return Json(new
            {
                Code = 200,
                Msg = "Execute sucessfully!"
            });
        }

        /// <summary>
        /// 根据Url处理文件相关问题
        /// </summary>
        /// <param name="urls"></param>
        /// <param name="path"></param>
        /// <param name="doc"></param>
        /// <returns></returns>
        private bool HandleUrl(string[] urls, string path, ref BsonDocument doc)
        {
            var createTime = doc["CreateTime"].ToUniversalTime();
            var savePath = doc["SavePath"].ToString();
            var fileSize = 0L;

            var array = new BsonArray();

            foreach (var url in urls)
            {
                if (string.IsNullOrEmpty(url))
                {
                    continue;
                }

                if (!url.Contains("/"))
                {
                    continue;
                }

                var names = url.Split('/');
                var name = names[names.Length - 1];

                array.Add($"/Upload/Texture/{createTime.ToString("yyyyMMddHHmmss")}/{name}");

                var sourceFileName = HttpContext.Current.Server.MapPath($"~{url}");
                if (File.Exists(sourceFileName))
                {
                    var file = new FileInfo(sourceFileName);
                    fileSize += file.Length;

                    var destFileDir = $"{path}\\{createTime.ToString("yyyyMMddHHmmss")}";

                    if (!Directory.Exists(destFileDir))
                    {
                        Directory.CreateDirectory(destFileDir);
                    }

                    File.Copy(sourceFileName, $"{destFileDir}\\{name}", true);
                }
                //else
                //{
                //    // TODO: 不小心把后缀写错了，待删除
                //    var sourceFileNameJpg = sourceFileName.Replace(".png", ".jpg");
                //    if (File.Exists(sourceFileNameJpg))
                //    {
                //        var file = new FileInfo(sourceFileNameJpg);
                //        fileSize += file.Length;

                //        var destFileDir = $"{path}\\{createTime.ToString("yyyyMMddHHmmss")}";

                //        if (!Directory.Exists(destFileDir))
                //        {
                //            Directory.CreateDirectory(destFileDir);
                //        }

                //        File.Copy(sourceFileNameJpg, $"{destFileDir}\\{name}");
                //    }
                //}
            }

            doc["FileSize"] = fileSize;

            if (array.Count > 1)
            {
                var obj = new BsonDocument
                {
                    ["PosX"] = array[0].ToString(),
                    ["NegX"] = array[1].ToString(),
                    ["PosY"] = array[2].ToString(),
                    ["NegY"] = array[3].ToString(),
                    ["PosZ"] = array[4].ToString(),
                    ["NegZ"] = array[5].ToString(),
                };
                doc["Url"] = obj;
                doc["Thumbnail"] = array[0].ToString();
            }
            else if (array.Count == 1)
            {
                doc["Url"] = array[0].ToString();
                if (array[0].ToString().EndsWith("mp4"))
                {
                    doc["Thumbnail"] = ""; // 视频贴图不要填写缩略图
                }
                else
                {
                    doc["Thumbnail"] = array[0].ToString();
                }
            }
            else // = 0
            {
                doc["Url"] = "";
                doc["Thumbnail"] = "";
            }

            return true;
        }
    }
}
