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
using ShadowEditor.Server.Scene;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 发布控制器
    /// </summary>
    public class PublishController : ApiBase
    {
        /// <summary>
        /// 发布场景
        /// </summary>
        /// <param name="ID">场景ID</param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult Load(string ID)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.SceneCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "该场景不存在！"
                });
            }

            var collectionName = doc["CollectionName"].AsString;

            var docs = mongo.FindAll(collectionName);

            var data = new JArray();

            foreach (var i in docs)
            {
                i["_id"] = i["_id"].ToString(); // ObjectId
                data.Add(JsonHelper.ToObject<JObject>(i.ToJson()));
            }

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = data
            });
        }
    }
}
