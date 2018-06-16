using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using MongoDB.Bson;
using MongoDB.Driver;
using ShadowServer.Helpers;
using Newtonsoft.Json.Linq;

namespace ShadowServer.Service
{
    /// <summary>
    /// 场景服务
    /// </summary>
    public class SceneService : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            var cmd = context.Request["cmd"];

            var html = "";

            switch (cmd)
            {
                case "Save": // 保存场景
                    html = Save(context);
                    break;
                default:
                    break;
            }

            context.Response.ContentType = "text/plain";
            context.Response.Write(html);
        }

        /// <summary>
        /// 保存场景
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private string Save(HttpContext context)
        {
            var name = context.Request["name"];
            var data = context.Request["data"];

            var list = JsonConvert.DeserializeObject<JArray>(data);

            var docs = new List<BsonDocument>();

            foreach (var i in list)
            {
                docs.Add(BsonDocument.Parse(i.ToString()));
            }

            var mongo = new MongoHelper();
            mongo.InsertMany(name, docs);

            return JsonConvert.SerializeObject(new
            {
                Code = 200,
                Msg = "保存成功！"
            });
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}