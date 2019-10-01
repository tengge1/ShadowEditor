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
            var helper = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Empty;

            var config = helper.FindOne(Constant.ConfigCollectionName, filter);

            if (config == null)
            {
                config = new BsonDocument
                {
                    ["ID"] = ObjectId.GenerateNewId(),
                    ["EnableAuthority"] = false,
                };
                helper.InsertOne(Constant.ConfigCollectionName, config);
            }

            var model = new ConfigModel
            {
                ID = config["ID"].ToString(),
                EnableAuthority = config["EnableAuthority"].ToBoolean(),
            };

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                Data = model,
            });
        }
    }
}
