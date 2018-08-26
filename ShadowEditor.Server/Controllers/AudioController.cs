using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Server.Audio;
using System.Web;
using System.IO;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 音频控制器
    /// </summary>
    public class AudioController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();
            var scenes = mongo.FindAll(Constant.AudioCollectionName);

            var list = new List<AudioModel>();

            foreach (var i in scenes)
            {
                var info = new AudioModel
                {
                    ID = i["ID"].AsObjectId.ToString(),
                    Name = i["Name"].AsString,
                    TotalPinYin = i["TotalPinYin"].ToString(),
                    FirstPinYin = i["FirstPinYin"].ToString(),
                    Type = i["Type"].AsString,
                    Url = i["Url"].AsString,
                    CreateTime = i["CreateTime"].ToUniversalTime(),
                    UpdateTime = i["UpdateTime"].ToUniversalTime()
                };
                list.Add(info);
            }

            list = list.OrderByDescending(o => o.UpdateTime).ToList();

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = list
            });
        }

        /// <summary>
        /// 保存音频
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Add()
        {
            var file = HttpContext.Current.Request.Files[0];
            var fileName = file.FileName;
            var fileSize = file.ContentLength;
            var fileType = file.ContentType;
            var fileExt = Path.GetExtension(fileName);
            var fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

            if (fileExt == null || fileExt.ToLower() != ".mp3" && fileExt.ToLower() != ".wav" && fileExt.ToLower() != ".ogg")
            {
                return Json(new Result
                {
                    Code = 300,
                    Msg = "只允许上传mp3、wav或ogg格式文件！"
                });
            }

            // 保存文件
            var now = DateTime.Now;

            var savePath = $"/Upload/Audio/{now.ToString("yyyyMMddHHmmss")}";
            var physicalPath = HttpContext.Current.Server.MapPath(savePath);

            if (!Directory.Exists(physicalPath))
            {
                Directory.CreateDirectory(physicalPath);
            }

            file.SaveAs($"{physicalPath}\\{fileName}");

            var pinyin = PinYinHelper.GetTotalPinYin(fileNameWithoutExt);

            // 保存到Mongo
            var mongo = new MongoHelper();

            var doc = new BsonDocument();
            doc["ID"] = ObjectId.GenerateNewId();
            doc["AddTime"] = BsonDateTime.Create(now);
            doc["FileName"] = fileName;
            doc["FileSize"] = fileSize;
            doc["FileType"] = fileType;
            doc["FirstPinYin"] = string.Join("", pinyin.FirstPinYin);
            doc["Name"] = fileNameWithoutExt;
            doc["SaveName"] = fileName;
            doc["SavePath"] = savePath;
            doc["TotalPinYin"] = string.Join("", pinyin.TotalPinYin);
            doc["Type"] = AudioType.unknown.ToString();
            doc["Url"] = $"{savePath}/{fileName}";
            doc["CreateTime"] = now;
            doc["UpdateTime"] = now;

            mongo.InsertOne(Constant.AudioCollectionName, doc);

            return Json(new Result
            {
                Code = 200,
                Msg = "上传成功！"
            });
        }

        /// <summary>
        /// 删除音频
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Delete(string ID)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.AudioCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "该音频不存在！"
                });
            }

            mongo.DeleteOne(Constant.AudioCollectionName, filter);

            return Json(new
            {
                Code = 200,
                Msg = "删除音频成功！"
            });
        }
    }
}
