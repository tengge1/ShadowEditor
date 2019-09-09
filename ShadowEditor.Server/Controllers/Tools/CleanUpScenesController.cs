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
            var scenes = helper.FindAll(Constant.SceneCollectionName);

            var collections = helper.ListCollections().ToList();

            foreach (var collection in collections)
            {

            }

            return Json(new
            {
                Code = 200,
                Msg = "执行成功！"
            });
        }
    }
}
