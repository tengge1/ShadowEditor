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

namespace ShadowEditor.Server.Controllers.Export
{
    /// <summary>
    /// 导出场景控制器
    /// </summary>
    public class ExportSceneController : ApiBase
    {
        /// <summary>
        /// 执行
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Run(string ID, int version = -1)
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

            //var collectionName = doc["CollectionName"].AsString;

            //List<BsonDocument> docs;

            //if (version == -1) // 最新版本
            //{
            //    docs = mongo.FindAll(collectionName).ToList();
            //}
            //else // 特定版本
            //{
            //    filter = Builders<BsonDocument>.Filter.Eq(Constant.VersionField, BsonInt32.Create(version));
            //    docs = mongo.FindMany($"{collectionName}{Constant.HistorySuffix}", filter).ToList();
            //}

            //var data = new JArray();

            //foreach (var i in docs)
            //{
            //    i["_id"] = i["_id"].ToString(); // ObjectId
            //    data.Add(JsonHelper.ToObject<JObject>(i.ToJson()));
            //}

            return Json(new
            {
                Code = 200,
                Msg = "导出成功！"
            });
        }
    }
}