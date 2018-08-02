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

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 场景
    /// </summary>
    public class SceneController : ApiBase
    {
        /// <summary>
        /// 加载场景
        /// </summary>
        /// <param name="name">场景名称</param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult Load(string name)
        {
            var mongo = new MongoHelper();
            var docs = mongo.FindAll(name);

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = docs
            });
        }

        /// <summary>
        /// 保存场景
        /// </summary>
        /// <param name="model">保存场景模型</param>
        /// <returns></returns>
        public JsonResult Save(SaveSceneModel model)
        {
            if (model.Name.StartsWith("_"))
            {
                return Json(new
                {
                    Code = 200,
                    Msg = "场景名称不允许以下划线开头"
                });
            }

            // 保存场景信息
            var list = JsonHelper.ToObject<JArray>(model.Data);

            var docs = new List<BsonDocument>();

            foreach (var i in list)
            {
                docs.Add(BsonDocument.Parse(i.ToString()));
            }

            var mongo = new MongoHelper();

            mongo.DeleteAll(model.Name);
            mongo.InsertMany(model.Name, docs);

            // 保存场景综合信息
            var filter = Builders<BsonDocument>.Filter.Eq("Name", model.Name);
            var doc = mongo.FindOne("_Scene", filter);

            var now = DateTime.Now;

            if (doc.IsBsonNull)
            {
                doc = new BsonDocument();
                doc["Name"] = model.Name;
                doc["Version"] = 0;
                doc["CreateTime"] = BsonDateTime.Create(now);
                doc["UpdateTime"] = BsonDateTime.Create(now);
                mongo.InsertOne("_Scene", doc);
            }
            else
            {
                var update1 = Builders<BsonDocument>.Update.Set("Version", int.Parse(doc["Version"].ToString()) + 1);
                var update2 = Builders<BsonDocument>.Update.Set("UpdateTime", BsonDateTime.Create(now));
                var update = Builders<BsonDocument>.Update.Combine(update1, update2);
                mongo.UpdateOne("_Scene", filter, update);
            }

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！"
            });
        }
    }

    /// <summary>
    /// 场景保存模型
    /// </summary>
    public class SaveSceneModel
    {
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 数据
        /// </summary>
        public string Data { get; set; }
    }
}
