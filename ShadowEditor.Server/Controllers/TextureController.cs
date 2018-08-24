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
using ShadowEditor.Server.Texture;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 纹理控制器
    /// </summary>
    public class TextureController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();
            var scenes = mongo.FindAll(Constant.TextureCollectionName);

            var list = new List<TextureModel>();

            foreach (var i in scenes)
            {
                var info = new TextureModel
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
        /// 保存纹理
        /// </summary>
        /// <param name="model">保存模型</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Save(SaveTextureModel model)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(model.ID) && !ObjectId.TryParse(model.ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "场景ID不合法。"
                });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "纹理名称不允许为空。"
                });
            }

            // 查询纹理信息
            var mongo = new MongoHelper();
            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.TextureCollectionName, filter);

            var now = DateTime.Now;

            // 保存或更新场景综合信息
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
                mongo.InsertOne(Constant.TextureCollectionName, doc);
            }
            else
            {
                var update1 = Builders<BsonDocument>.Update.Set("Version", int.Parse(doc["Version"].ToString()) + 1);
                var update2 = Builders<BsonDocument>.Update.Set("UpdateTime", BsonDateTime.Create(now));
                var update = Builders<BsonDocument>.Update.Combine(update1, update2);
                mongo.UpdateOne(Constant.TextureCollectionName, filter, update);
            }

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！"
            });
        }

        /// <summary>
        /// 删除纹理
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Delete(string ID)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.TextureCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "该纹理不存在！"
                });
            }

            mongo.DeleteOne(Constant.TextureCollectionName, filter);

            return Json(new
            {
                Code = 200,
                Msg = "删除纹理成功！"
            });
        }
    }
}
