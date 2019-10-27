using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web;
using System.IO;
using System.Configuration;
using System.Web.Security;
using Newtonsoft.Json;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Model.System;

namespace ShadowEditor.Server.Controllers.System
{
    /// <summary>
    /// 配置控制器
    /// </summary>
    public class ConfigController : ApiBase
    {
        /// <summary>
        /// 获取配置信息
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult Get()
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Empty;

            // 获取配置
            var config = mongo.FindOne(Constant.ConfigCollectionName, filter);

            if (config == null)
            {
                config = new BsonDocument
                {
                    ["ID"] = ObjectId.GenerateNewId(),
                    ["Initialized"] = false,
                    ["DefaultRegisterRole"] = ""
                };
                mongo.InsertOne(Constant.ConfigCollectionName, config);
            }

            var model = new JObject
            {
                ["ID"] = config["ID"].ToString(),
                ["EnableAuthority"] = ConfigurationManager.AppSettings["EnableAuthority"] == "true",
                ["Initialized"] = config.Contains("Initialized") ? config["Initialized"].ToBoolean() : false,
                ["DefaultRegisterRole"] = config.Contains("DefaultRegisterRole") ? config["DefaultRegisterRole"].ToString() : "",
                ["IsLogin"] = false,
                ["Username"] = "",
                ["Name"] = "",
            };

            // 获取用户登录信息
            var cookies = HttpContext.Current.Request.Cookies;

            var cookie = cookies.Get(FormsAuthentication.FormsCookieName);

            if (cookie != null)
            {
                var ticket = FormsAuthentication.Decrypt(cookie.Value);

                try
                {
                    var data = JsonConvert.DeserializeObject<LoginTicketDataModel>(ticket.UserData);

                    ObjectId objectId;

                    if (ObjectId.TryParse(data.UserID, out objectId))
                    {
                        var filter1 = Builders<BsonDocument>.Filter.Eq("ID", objectId);
                        var doc = mongo.FindOne(Constant.UserCollectionName, filter1);
                        if (doc != null)
                        {
                            model["IsLogin"] = true;
                            model["Username"] = doc["Username"].ToString();
                            model["Name"] = doc["Name"].ToString();
                        }
                    }
                }
                catch (Exception ex)
                {
                    // 用户登录信息解析失败
                    var log = LogHelper.GetLogger(this.GetType());
                    log.Error("User ticket deserialized failed.", ex);
                }
            }

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                Data = model,
            });
        }

        /// <summary>
        /// 保存系统设置
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Save(ConfigModel model)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Empty;

            // 获取配置
            var doc = mongo.FindOne(Constant.ConfigCollectionName, filter);

            if (doc == null)
            {
                doc = new BsonDocument
                {
                    ["ID"] = ObjectId.GenerateNewId(),
                    ["Initialized"] = false,
                    ["DefaultRegisterRole"] = model.DefaultRegisterRole
                };
                mongo.InsertOne(Constant.ConfigCollectionName, doc);
            }
            else
            {
                var update = Builders<BsonDocument>.Update.Set("DefaultRegisterRole", model.DefaultRegisterRole);
                mongo.UpdateOne(Constant.ConfigCollectionName, filter, update);
            }

            return Json(new
            {
                Code = 200,
                Msg = "Save Successfully.",
                Data = model,
            });
        }
    }
}
