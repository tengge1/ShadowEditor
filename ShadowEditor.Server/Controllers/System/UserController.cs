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
    /// 用户控制器
    /// </summary>
    public class UserController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="pageSize"></param>
        /// <param name="pageNum"></param>
        /// <param name="keyword"></param>
        /// <returns></returns>
        [HttpGet]
        [Authority(OperatingAuthority.LIST_USER)]
        public JsonResult List(int pageSize = 20, int pageNum = 1, string keyword = "")
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Ne("Status", -1);

            if (!string.IsNullOrEmpty(keyword))
            {
                var filter1 = Builders<BsonDocument>.Filter.Regex("Name", keyword);
                filter = Builders<BsonDocument>.Filter.And(filter, filter1);
            }

            var sort = Builders<BsonDocument>.Sort.Descending("_id");

            var total = mongo.Count(Constant.UserCollectionName, filter);
            var docs = mongo.FindMany(Constant.UserCollectionName, filter)
                .Sort(sort)
                .Skip(pageSize * (pageNum - 1))
                .Limit(pageSize)
                .ToList();

            var rows = new List<UserModel>();

            foreach (var doc in docs)
            {
                rows.Add(new UserModel
                {
                    ID = doc["ID"].ToString(),
                    Username = doc["Username"].ToString(),
                    Password = "",
                    Name = doc["Name"].ToString(),
                    Gender = doc["Gender"].ToInt32(),
                    Phone = doc["Phone"].ToString(),
                    Email = doc["Email"].ToString(),
                    QQ = doc["QQ"].ToString(),
                    CreateTime = doc["CreateTime"].ToLocalTime(),
                    UpdateTime = doc["UpdateTime"].ToLocalTime(),
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
        [Authority(OperatingAuthority.ADD_USER)]
        public JsonResult Add(UserEditModel model)
        {
            if (string.IsNullOrEmpty(model.Username))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Username is not allowed to be empty.",
                });
            }

            if (string.IsNullOrEmpty(model.Password))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Password is not allowed to be empty.",
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

            var filter = Builders<BsonDocument>.Filter.Eq("Username", model.Username);

            var count = mongo.Count(Constant.UserCollectionName, filter);

            if (count > 0)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The username is already existed.",
                });
            }

            var now = DateTime.Now;

            var salt = DateTime.Now.ToString("yyyyMMddHHmmss");

            var doc = new BsonDocument
            {
                ["ID"] = ObjectId.GenerateNewId(),
                ["Username"] = model.Username,
                ["Password"] = MD5Helper.Encrypt(model.Password + salt),
                ["Name"] = model.Name,
                ["Gender"] = 0,
                ["Phone"] = "",
                ["Email"] = "",
                ["QQ"] = "",
                ["CreateTime"] = now,
                ["UpdateTime"] = now,
                ["Salt"] = salt,
                ["Status"] = 0,
            };

            mongo.InsertOne(Constant.UserCollectionName, doc);

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
        [Authority(OperatingAuthority.EDIT_USER)]
        public JsonResult Edit(UserEditModel model)
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

            if (string.IsNullOrEmpty(model.Username))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Username is not allowed to be empty.",
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

            // 判断用户名是否重复
            var filter1 = Builders<BsonDocument>.Filter.Ne("ID", objectId);
            var filter2 = Builders<BsonDocument>.Filter.Eq("Username", model.Username);
            var filter = Builders<BsonDocument>.Filter.And(filter1, filter2);

            var count = mongo.Count(Constant.UserCollectionName, filter);

            if (count > 0)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The username is already existed.",
                });
            }

            filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);

            var update1 = Builders<BsonDocument>.Update.Set("Username", model.Username);
            var update2 = Builders<BsonDocument>.Update.Set("Name", model.Name);
            var update3 = Builders<BsonDocument>.Update.Set("UpdateTime", DateTime.Now);

            var update = Builders<BsonDocument>.Update.Combine(update1, update2, update3);

            mongo.UpdateOne(Constant.UserCollectionName, filter, update);

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
        [Authority(OperatingAuthority.DELETE_USER)]
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
            var doc = mongo.FindOne(Constant.UserCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The asset is not existed!"
                });
            }

            var update = Builders<BsonDocument>.Update.Set("Status", -1);

            mongo.UpdateOne(Constant.UserCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }
    }
}
