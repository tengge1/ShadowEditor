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
using System.Web.Security;
using System.Configuration;

namespace ShadowEditor.Server.Controllers.System
{
    /// <summary>
    /// 初始化控制器
    /// </summary>
    public class InitializeController : ApiBase
    {
        /// <summary>
        /// 初始化
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Initialize()
        {
            // 判断权限是否开启
            var enableAuthority = ConfigurationManager.AppSettings["EnableAuthority"];

            if (enableAuthority != "true")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Authority is not enabled.",
                });
            }

            // 判断是否已经初始化
            var mongo = new MongoHelper();

            var doc = mongo.FindAll(Constant.ConfigCollectionName).FirstOrDefault();

            if (doc != null && doc.Contains("Initialized") && doc["Initialized"].ToBoolean() == true)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "System has already initialized."
                });
            }

            var defaultRegisterRoleID = ObjectId.GenerateNewId();

            if (doc == null)
            {
                doc = new BsonDocument
                {
                    ["ID"] = ObjectId.GenerateNewId(),
                    ["Initialized"] = true,
                    ["DefaultRegisterRole"] = defaultRegisterRoleID
                };
                mongo.InsertOne(Constant.ConfigCollectionName, doc);
            }
            else
            {
                var filter11 = Builders<BsonDocument>.Filter.Eq("_id", doc["_id"].AsObjectId);
                var update11 = Builders<BsonDocument>.Update.Set("Initialized", true);
                var update12 = Builders<BsonDocument>.Update.Set("DefaultRegisterRole", defaultRegisterRoleID);
                var update13 = Builders<BsonDocument>.Update.Combine(update11, update12);
                mongo.UpdateOne(Constant.ConfigCollectionName, filter11, update13);
            }

            // 初始化角色
            var now = DateTime.Now;

            var filter1 = Builders<BsonDocument>.Filter.Eq("Name", "Administrator");
            var filter2 = Builders<BsonDocument>.Filter.Eq("Name", "User");
            var filter3 = Builders<BsonDocument>.Filter.Eq("Name", "Guest");
            var filter = Builders<BsonDocument>.Filter.Or(filter1, filter2, filter3);
            mongo.DeleteMany(Constant.RoleCollectionName, filter);

            var adminRoleID = ObjectId.GenerateNewId(); // 管理员RoleID

            var role1 = new BsonDocument
            {
                ["ID"] = adminRoleID,
                ["Name"] = "Administrator",
                ["CreateTime"] = now,
                ["UpdateTime"] = now,
                ["Description"] = "Administrator",
                ["Status"] = 0,
            };

            var role2 = new BsonDocument
            {
                ["ID"] = defaultRegisterRoleID,
                ["Name"] = "User",
                ["CreateTime"] = now,
                ["UpdateTime"] = now,
                ["Description"] = "Login User",
                ["Status"] = 0,
            };

            var role3 = new BsonDocument
            {
                ["ID"] = ObjectId.GenerateNewId(),
                ["Name"] = "Guest",
                ["CreateTime"] = now,
                ["UpdateTime"] = now,
                ["Description"] = "No Login User",
                ["Status"] = 0,
            };

            mongo.InsertMany(Constant.RoleCollectionName, new[] { role1, role2, role3 });

            // 初始化用户
            var password = "123456";
            var salt = DateTime.Now.ToString("yyyyMMddHHmmss");

            var user = new BsonDocument
            {
                ["ID"] = ObjectId.GenerateNewId(),
                ["Username"] = "admin",
                ["Password"] = MD5Helper.Encrypt(password + salt),
                ["Name"] = "Administrator",
                ["RoleID"] = adminRoleID.ToString(),
                ["Gender"] = 0,
                ["Phone"] = "",
                ["Email"] = "",
                ["QQ"] = "",
                ["CreateTime"] = now,
                ["UpdateTime"] = now,
                ["Salt"] = salt,
                ["Status"] = 0,
            };

            mongo.InsertOne(Constant.UserCollectionName, user);

            return Json(new
            {
                Code = 200,
                Msg = "Initialize successfully!"
            });
        }

        /// <summary>
        /// 重置系统
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Reset()
        {
            var mongo = new MongoHelper();
            var now = DateTime.Now.ToString("yyyyMMddHHmmss");

            // 备份数据表
            var docs = mongo.FindAll(Constant.ConfigCollectionName).ToList();
            if (docs.Count > 0)
            {
                mongo.InsertMany($"{Constant.ConfigCollectionName}_{now}", docs);
            }

            docs = mongo.FindAll(Constant.RoleCollectionName).ToList();
            if (docs.Count > 0)
            {
                mongo.InsertMany($"{Constant.RoleCollectionName}_{now}", docs);
            }

            docs = mongo.FindAll(Constant.UserCollectionName).ToList();
            if (docs.Count > 0)
            {
                mongo.InsertMany($"{Constant.UserCollectionName}_{now}", docs);
            }

            docs = mongo.FindAll(Constant.DepartmentCollectionName).ToList();
            if (docs.Count > 0)
            {
                mongo.InsertMany($"{Constant.DepartmentCollectionName}_{now}", docs);
            }

            docs = mongo.FindAll(Constant.OperatingAuthorityCollectionName).ToList();
            if (docs.Count > 0)
            {
                mongo.InsertMany($"{Constant.OperatingAuthorityCollectionName}_{now}", docs);
            }

            // 清除数据表
            mongo.DropCollection(Constant.ConfigCollectionName);
            mongo.DropCollection(Constant.RoleCollectionName);
            mongo.DropCollection(Constant.UserCollectionName);
            mongo.DropCollection(Constant.DepartmentCollectionName);
            mongo.DropCollection(Constant.OperatingAuthorityCollectionName);

            // 注销登录
            var cookie = HttpContext.Current.Request.Cookies.Get(FormsAuthentication.FormsCookieName);

            if (cookie != null)
            {
                cookie.Expires = DateTime.Now.AddDays(-1);
                HttpContext.Current.Response.Cookies.Add(cookie);
            }

            return Json(new
            {
                Code = 200,
                Msg = "Reset successfully!"
            });
        }
    }
}