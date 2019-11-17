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
using ShadowEditor.Model.Tools;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.Tools
{
    /// <summary>
    /// 插件控制器
    /// </summary>
    public class PluginController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="pageSize"></param>
        /// <param name="pageNum"></param>
        /// <param name="keyword"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List(int pageSize = 20, int pageNum = 1, string keyword = "")
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Ne("Status", -1);

            if (!string.IsNullOrEmpty(keyword))
            {
                var filter1 = Builders<BsonDocument>.Filter.Regex("Name", keyword);
                filter = Builders<BsonDocument>.Filter.And(filter, filter1);
            }

            var sort = Builders<BsonDocument>.Sort.Descending("ID");

            var total = mongo.Count(Constant.PluginCollectionName, filter);
            var docs = mongo.FindMany(Constant.PluginCollectionName, filter)
                .Sort(sort)
                .Skip(pageSize * (pageNum - 1))
                .Limit(pageSize)
                .ToList();

            var rows = new List<PluginModel>();

            foreach (var doc in docs)
            {
                rows.Add(new PluginModel
                {
                    ID = doc["ID"].ToString(),
                    Name = doc["Name"].ToString(),
                    Source = doc["Source"].ToString(),
                    CreateTime = doc["CreateTime"].ToLocalTime(),
                    UpdateTime = doc["UpdateTime"].ToLocalTime(),
                    Description = doc.Contains("Description") ? doc["Description"].ToString() : "",
                    Status = doc["Status"].ToInt32(),
                });
            }

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                Data = new
                {
                    total,
                    rows,
                },
            });
        }

        /// <summary>
        /// 添加
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority("ADMINISTRATOR")]
        public JsonResult Add(PluginEditModel model)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Name is not allowed to be empty."
                });
            }

            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("Name", model.Name);

            var count = mongo.Count(Constant.PluginCollectionName, filter);

            if (count > 0)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The name is already existed.",
                });
            }

            if (string.IsNullOrEmpty(model.Source))
            {
                model.Source = "";
            }

            if (string.IsNullOrEmpty(model.Description))
            {
                model.Description = "";
            }

            var now = DateTime.Now;

            var doc = new BsonDocument
            {
                ["ID"] = ObjectId.GenerateNewId(),
                ["Name"] = model.Name,
                ["Source"] = model.Source,
                ["CreateTime"] = now,
                ["UpdateTime"] = now,
                ["Description"] = model.Description,
                ["Status"] = 0,
            };

            mongo.InsertOne(Constant.PluginCollectionName, doc);

            return Json(new
            {
                Code = 200,
                Msg = "Saved successfully!"
            });
        }

        /// <summary>
        /// 编辑
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority("ADMINISTRATOR")]
        public JsonResult Edit(PluginEditModel model)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(model.ID) && !ObjectId.TryParse(model.ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "ID is not allowed."
                });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Name is not allowed to be empty."
                });
            }

            var mongo = new MongoHelper();
            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.PluginCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The plugin is not existed."
                });
            }

            var update1 = Builders<BsonDocument>.Update.Set("Name", model.Name);
            var update2 = Builders<BsonDocument>.Update.Set("Source", model.Source);
            var update3 = Builders<BsonDocument>.Update.Set("UpdateTime", DateTime.Now);
            var update4 = Builders<BsonDocument>.Update.Set("Description", model.Description);

            var update = Builders<BsonDocument>.Update.Combine(update1, update2, update3, update4);

            mongo.UpdateOne(Constant.PluginCollectionName, filter, update);

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
        [Authority("ADMINISTRATOR")]
        public JsonResult Delete(string ID)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(ID) && !ObjectId.TryParse(ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "ID is not allowed."
                });
            }

            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.PluginCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The plugin is not existed."
                });
            }

            var update = Builders<BsonDocument>.Update.Set("Status", -1);

            mongo.UpdateOne(Constant.PluginCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }
    }
}
