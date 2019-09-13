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

namespace ShadowEditor.Server.Controllers.Tools
{
    /// <summary>
    /// 清理场景控制器
    /// </summary>
    public class CleanUpScenesController : ApiBase
    {
        /// <summary>
        /// 开始执行
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Run()
        {
            var helper = new MongoHelper();
            var scenes = helper.FindAll(Constant.SceneCollectionName).ToList();

            var collections = helper.ListCollections().ToList();

            foreach (var collection in collections)
            {
                var collectionName = collection["name"].ToString();

                if (!collectionName.StartsWith("Scene"))
                {
                    continue;
                }

                if (collectionName.EndsWith("_history"))
                {
                    helper.DropCollection(collectionName);
                    continue;
                }

                var doc = scenes.Where(n => n["CollectionName"].ToString() == collectionName).FirstOrDefault();

                if (doc == null)
                {
                    helper.DropCollection(collectionName);
                }
            }

            return Json(new
            {
                Code = 200,
                Msg = "Execute sucessfully!"
            });
        }
    }
}
