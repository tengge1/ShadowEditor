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
using ShadowEditor.Model.SceneCategory;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 场景类别控制器
    /// </summary>
    public class SceneCategoryController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();
            var docs = mongo.FindAll(Constant.SceneCategoryCollectionName);

            var list = new JArray();

            foreach (var i in docs)
            {
                var obj = new JObject();
                obj["ID"] = i["_id"].ToString();
                obj["Name"] = i["Name"].ToString();
                list.Add(obj);
            }

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = list
            });
        }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Save(SceneCategorySaveModel model)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "场景类别名称不允许为空！"
                });
            }

            var mongo = new MongoHelper();

            if (string.IsNullOrEmpty(model.ID))
            {
                var doc = new BsonDocument();
                doc["Name"] = model.Name;
                mongo.InsertOne(Constant.SceneCategoryCollectionName, doc);
            }
            else
            {
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(model.ID));
                var update = Builders<BsonDocument>.Update.Set("Name", BsonString.Create(model.Name));
                mongo.UpdateOne(Constant.SceneCategoryCollectionName, filter, update);
            }

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！"
            });
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Delete(string ID)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(ID));
            mongo.DeleteOne(Constant.SceneCategoryCollectionName, filter);

            return Json(new
            {
                Code = 200,
                Msg = "删除场景成功！"
            });
        }
    }
}
