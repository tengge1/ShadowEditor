using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web;
using System.IO;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Model.System;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.System
{
    /// <summary>
    /// 角色控制器
    /// </summary>
    public class RoleController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="pageSize"></param>
        /// <param name="pageNum"></param>
        /// <param name="keyword"></param>
        /// <returns></returns>
        [HttpGet]
        [Authority(OperatingAuthority.LIST_ROLE)]
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

            var total = mongo.Count(Constant.RoleCollectionName, filter);
            var docs = mongo.FindMany(Constant.RoleCollectionName, filter)
                .Sort(sort)
                .Skip(pageSize * (pageNum - 1))
                .Limit(pageSize)
                .ToList();

            var rows = new List<RoleModel>();

            foreach (var doc in docs)
            {
                rows.Add(new RoleModel
                {
                    ID = doc["ID"].ToString(),
                    Name = doc["Name"].ToString(),
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
        [Authority(OperatingAuthority.ADD_ROLE)]
        public JsonResult Add(RoleEditModel model)
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

            var count = mongo.Count(Constant.RoleCollectionName, filter);

            if (count > 0)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The name is already existed.",
                });
            }

            var now = DateTime.Now;

            var doc = new BsonDocument
            {
                ["ID"] = ObjectId.GenerateNewId(),
                ["Name"] = model.Name,
                ["CreateTime"] = now,
                ["UpdateTime"] = now,
                ["Description"] = model.Description,
                ["Status"] = 0,
            };

            mongo.InsertOne(Constant.RoleCollectionName, doc);

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
        [Authority(OperatingAuthority.EDIT_ROLE)]
        public JsonResult Edit(RoleEditModel model)
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

            // 判断是否是系统内置用户
            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.RoleCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The role is not existed."
                });
            }

            var roleName = doc["Name"].ToString();

            if (roleName == "Administrator" || roleName == "User" || roleName == "Guest")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Modifying system built-in roles is not allowed."
                });
            }

            // 更新用户信息
            var update1 = Builders<BsonDocument>.Update.Set("Name", model.Name);
            var update2 = Builders<BsonDocument>.Update.Set("UpdateTime", DateTime.Now);
            var update3 = Builders<BsonDocument>.Update.Set("Description", model.Description);

            var update = Builders<BsonDocument>.Update.Combine(update1, update2, update3);

            mongo.UpdateOne(Constant.RoleCollectionName, filter, update);

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
        [Authority(OperatingAuthority.DELETE_ROLE)]
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
            var doc = mongo.FindOne(Constant.RoleCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The role is not existed."
                });
            }

            var roleName = doc["Name"].ToString();

            if (roleName == "Administrator" || roleName == "User" || roleName == "Guest")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "It is not allowed to delete system built-in roles."
                });
            }

            var update = Builders<BsonDocument>.Update.Set("Status", -1);

            mongo.UpdateOne(Constant.RoleCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }
    }
}
