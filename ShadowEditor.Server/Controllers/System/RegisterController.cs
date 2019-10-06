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

namespace ShadowEditor.Server.Controllers.System
{
    /// <summary>
    /// 注册控制器
    /// </summary>
    public class RegisterController : ApiBase
    {
        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Register(RegisterModel model)
        {
            if (model.Username == null || string.IsNullOrEmpty(model.Username))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Username is not allowed to be empty.",
                });
            }

            if (model.Password == null || string.IsNullOrEmpty(model.Password))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Password is not allowed to be empty.",
                });
            }

            if (model.ConfirmPassword == null || string.IsNullOrEmpty(model.ConfirmPassword))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Confirm password is not allowed to be empty.",
                });
            }

            if (model.Password != model.ConfirmPassword)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Password and confirm password is not the same.",
                });
            }

            if (model.Name == null || string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Name is not allowed to be empty.",
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
                Msg = "Register successfully!"
            });
        }
    }
}
