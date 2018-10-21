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

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 发布控制器
    /// </summary>
    public class PublishController : ApiBase
    {
        /// <summary>
        /// 发布场景
        /// </summary>
        /// <param name="ID">场景ID</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Publish(string ID)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.SceneCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "该场景不存在！"
                });
            }

            var collectionName = doc["CollectionName"].AsString;

            var docs = mongo.FindAll(collectionName);

            this.RunPublish(docs);

            return Json(new
            {
                Code = 200,
                Msg = "发布成功！"
            });
        }

        /// <summary>
        /// 开始发布场景
        /// </summary>
        /// <param name="docs"></param>
        private void RunPublish(List<BsonDocument> docs)
        {
            this.CopyAssets();
        }

        /// <summary>
        /// 复制资源到示例文件夹
        /// </summary>
        private void CopyAssets()
        {
            var server = HttpContext.Current.Server;

            // 复制html文件
            var sourceName = server.MapPath("~/index.html");
            var destName = server.MapPath("~/examples/index.html");

            File.Copy(sourceName, destName, true);

            // 复制dist文件夹
            sourceName = server.MapPath("~/dist");
            destName = server.MapPath("~/examples/dist");

            DirectoryHelper.Copy(sourceName, destName);

            // 复制assets文件夹
            sourceName = server.MapPath("~/assets");
            destName = server.MapPath("~/examples/assets");

            DirectoryHelper.Copy(sourceName, destName);

            // 复制网站图标
            sourceName = server.MapPath("~/favicon.ico");
            destName = server.MapPath("~/examples/favicon.ico");

            File.Copy(sourceName, destName);
        }
    }
}
