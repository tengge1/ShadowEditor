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
using ShadowEditor.Model.Category;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 类别控制器
    /// </summary>
    public class CategoryController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="type">类型</param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List(CategoryType? type = null)
        {
            var mongo = new MongoHelper();

            List<BsonDocument> docs = null;

            if (type == null)
            {
                docs = mongo.FindAll(Constant.CategoryCollectionName).ToList();
            }
            else
            {
                var filter = Builders<BsonDocument>.Filter.Eq("Type", type.Value.ToString());
                docs = mongo.FindMany(Constant.CategoryCollectionName, filter).ToList();
            }

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
                Msg = "Get Successfully!",
                Data = list
            });
        }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Save(CategorySaveModel model)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Name is not allowed to be empty."
                });
            }

            if (model.Type == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Type is not allowed to be empty!"
                });
            }

            var mongo = new MongoHelper();

            if (string.IsNullOrEmpty(model.ID))
            {
                var doc = new BsonDocument();
                doc["Name"] = model.Name;
                doc["Type"] = model.Type.Value.ToString();
                mongo.InsertOne(Constant.CategoryCollectionName, doc);
            }
            else
            {
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(model.ID));
                var update1 = Builders<BsonDocument>.Update.Set("Name", BsonString.Create(model.Name));
                var update2 = Builders<BsonDocument>.Update.Set("Type", BsonString.Create(model.Type.Value.ToString()));
                var update = Builders<BsonDocument>.Update.Combine(update1, update2);
                mongo.UpdateOne(Constant.CategoryCollectionName, filter, update);
            }

            return Json(new
            {
                Code = 200,
                Msg = "Saved successfully!"
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
            mongo.DeleteOne(Constant.CategoryCollectionName, filter);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }
    }
}
