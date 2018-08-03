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
        /// 获取场景列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();
            var scenes = mongo.FindAll(Constant.SceneCollectionName);

            var list = new List<SceneInfo>();

            foreach (var i in scenes)
            {
                var info = new SceneInfo
                {
                    Name = i["Name"].AsString,
                    CollectionName = i["CollectionName"].AsString,
                    Version = i["Version"].AsInt32,
                    CreateTime = i["CreateTime"].ToUniversalTime(),
                    UpdateTime = i["UpdateTime"].ToUniversalTime()
                };
                list.Add(info);
            }

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = list
            });
        }

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
            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "场景名称不允许为空。"
                });
            }

            if (model.Name.StartsWith("_"))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "场景名称不允许以下划线开头。"
                });
            }

            // 查询场景信息
            var mongo = new MongoHelper();
            var filter = Builders<BsonDocument>.Filter.Eq("Name", model.Name);
            var doc = mongo.FindOne(Constant.SceneCollectionName, filter);

            var now = DateTime.Now;

            string collectionName;

            if (doc == null)
            {
                collectionName = "Scene" + now.ToString("yyyyMMddHHmmss");
            }
            else
            {
                collectionName = doc["CollectionName"].ToString();
            }

            // 保存或更新场景综合信息
            if (doc == null)
            {
                doc = new BsonDocument();
                doc["Name"] = model.Name;
                doc["CollectionName"] = collectionName;
                doc["Version"] = 0;
                doc["CreateTime"] = BsonDateTime.Create(now);
                doc["UpdateTime"] = BsonDateTime.Create(now);
                mongo.InsertOne(Constant.SceneCollectionName, doc);
            }
            else
            {
                var update1 = Builders<BsonDocument>.Update.Set("Version", int.Parse(doc["Version"].ToString()) + 1);
                var update2 = Builders<BsonDocument>.Update.Set("UpdateTime", BsonDateTime.Create(now));
                var update = Builders<BsonDocument>.Update.Combine(update1, update2);
                mongo.UpdateOne(Constant.SceneCollectionName, filter, update);
            }

            // 保存场景信息
            var list = JsonHelper.ToObject<JArray>(model.Data);

            var docs = new List<BsonDocument>();

            foreach (var i in list)
            {
                docs.Add(BsonDocument.Parse(i.ToString()));
            }

            mongo.DeleteAll(collectionName);
            mongo.InsertMany(collectionName, docs);

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

    /// <summary>
    /// 场景信息
    /// </summary>
    public class SceneInfo
    {
        /// <summary>
        /// 场景名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 场景表名
        /// </summary>
        public string CollectionName { get; set; }

        /// <summary>
        /// 场景版本号
        /// </summary>
        public int Version { get; set; }

        /// <summary>
        /// 场景创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 场景更新时间
        /// </summary>
        public DateTime UpdateTime { get; set; }
    }
}
