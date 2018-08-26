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
                    Url = i["Url"].AsString,
                    Version = i["Version"].AsInt32,
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
        /// <param name="model">保存模型</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Save(SaveAudioModel model)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(model.ID) && !ObjectId.TryParse(model.ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "音频ID不合法。"
                });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "音频名称不允许为空。"
                });
            }

            // 查询音频信息
            var mongo = new MongoHelper();
            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.AudioCollectionName, filter);

            var now = DateTime.Now;

            if (doc == null)
            {
                var pinyin = PinYinHelper.GetTotalPinYin(model.Name);

                doc = new BsonDocument();
                doc["ID"] = objectId;
                doc["Name"] = model.Name;
                doc["TotalPinYin"] = string.Join("", pinyin.TotalPinYin);
                doc["FirstPinYin"] = string.Join("", pinyin.FirstPinYin);
                doc["Url"] = "";
                doc["Version"] = 0;
                doc["CreateTime"] = BsonDateTime.Create(now);
                doc["UpdateTime"] = BsonDateTime.Create(now);
                mongo.InsertOne(Constant.AudioCollectionName, doc);
            }
            else
            {
                var update1 = Builders<BsonDocument>.Update.Set("Version", int.Parse(doc["Version"].ToString()) + 1);
                var update2 = Builders<BsonDocument>.Update.Set("UpdateTime", BsonDateTime.Create(now));
                var update = Builders<BsonDocument>.Update.Combine(update1, update2);
                mongo.UpdateOne(Constant.AudioCollectionName, filter, update);
            }

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！"
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
