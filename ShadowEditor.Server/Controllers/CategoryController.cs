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
using ShadowEditor.Server.CustomAttribute;

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
        [Authority(OperatingAuthority.LIST_CATEGORY)]
        public JsonResult List(CategoryType? type = null)
        {
            var mongo = new MongoHelper();

            var docs = new List<BsonDocument>();

            if (ConfigHelper.EnableAuthority)
            {
                var user = UserHelper.GetCurrentUser();

                if (user != null)
                {
                    var filter1 = Builders<BsonDocument>.Filter.Eq("UserID", user.ID);

                    if (user.Name == "Administrator")
                    {
                        var filter2 = Builders<BsonDocument>.Filter.Exists("UserID");
                        var filter3 = Builders<BsonDocument>.Filter.Not(filter2);
                        filter1 = Builders<BsonDocument>.Filter.Or(filter1, filter3);
                    }

                    if (type != null)
                    {
                        var filter2 = Builders<BsonDocument>.Filter.Eq("Type", type.Value.ToString());
                        filter1 = Builders<BsonDocument>.Filter.And(filter1, filter2);
                    }
                    docs = mongo.FindMany(Constant.CategoryCollectionName, filter1).ToList();
                }
            }
            else
            {
                if (type != null)
                {
                    var filter1 = Builders<BsonDocument>.Filter.Eq("Type", type.Value.ToString());
                    docs = mongo.FindMany(Constant.CategoryCollectionName, filter1).ToList();
                }
                else
                {
                    docs = mongo.FindAll(Constant.CategoryCollectionName).ToList();
                }
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
        [Authority(OperatingAuthority.SAVE_CATEGORY)]
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

                if (ConfigHelper.EnableAuthority)
                {
                    var user = UserHelper.GetCurrentUser();

                    if (user != null)
                    {
                        doc["UserID"] = user.ID;
                    }
                }

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
        [Authority(OperatingAuthority.DELETE_CATEGORY)]
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
