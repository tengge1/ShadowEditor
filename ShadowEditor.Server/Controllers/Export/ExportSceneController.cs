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
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers.Export
{
    /// <summary>
    /// 导出场景控制器
    /// </summary>
    public class ExportSceneController : ApiBase
    {
        /// <summary>
        /// 执行
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Run(string ID, int version = -1)
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

            // 获取场景数据
            var collectionName = doc["CollectionName"].AsString;

            List<BsonDocument> docs;

            if (version == -1) // 最新版本
            {
                docs = mongo.FindAll(collectionName).ToList();
            }
            else // 特定版本
            {
                filter = Builders<BsonDocument>.Filter.Eq(Constant.VersionField, BsonInt32.Create(version));
                docs = mongo.FindMany($"{collectionName}{Constant.HistorySuffix}", filter).ToList();
            }

            // 创建临时目录
            var now = DateTime.Now;

            var path = HttpContext.Current.Server.MapPath($"~/temp/{now.ToString("yyyyMMddHHmmss")}");

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            // 拷贝静态资源
            var viewPath = HttpContext.Current.Server.MapPath("~/view.html");
            File.Copy(viewPath, $"{path}/scene{now.ToString("yyyyMMddHHmmss")}.html", true);

            var faviconPath = HttpContext.Current.Server.MapPath("~/favicon.ico");
            File.Copy(faviconPath, $"{path}/favicon.ico", true);

            var assetsPath = HttpContext.Current.Server.MapPath($"~/assets");
            DirectoryHelper.Copy(assetsPath, $"{path}/assets");

            var buildPath = HttpContext.Current.Server.MapPath($"~/build");
            DirectoryHelper.Copy(buildPath, $"{path}/build");

            // 分析场景，拷贝使用的模型和贴图资源
            var animations = new List<string>();
            var audios = new List<string>();
            var models = new List<string>();
            var textures = new List<string>();

            foreach (var i in docs)
            {

            }

            return Json(new
            {
                Code = 200,
                Msg = "导出成功！"
            });
        }
    }
}