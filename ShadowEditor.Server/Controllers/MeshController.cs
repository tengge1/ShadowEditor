using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Server.Mesh;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 模型控制器
    /// </summary>
    public class MeshController : ApiBase
    {
        /// <summary>
        /// 获取模型列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();
            var docs = mongo.FindAll(Constant.MeshCollectionName);

            var data = docs.Select(o => new
            {
                Name = o["Name"].ToString(),
                TotalPinYin = o["TotalPinYin"].ToString(),
                FirstPinYin = o["FirstPinYin"].ToString(),
                Type = o["Type"].ToString(),
                Url = o["Url"].ToString(),
                Thumbnail = o["Thumbnail"].ToString()
            });

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = data
            });
        }

        /// <summary>
        /// 保存模型
        /// </summary>
        /// <returns></returns>
        public JsonResult Add()
        {
            var saver = new MeshSaver();
            var result = saver.Save(HttpContext.Current);
            return Json(result);
        }
    }
}
