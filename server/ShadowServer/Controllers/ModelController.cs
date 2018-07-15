using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using ShadowServer.Base;
using ShadowServer.Helpers;

namespace ShadowServer.Controllers
{
    /// <summary>
    /// 模型控制器
    /// </summary>
    public class ModelController : ApiBase
    {
        /// <summary>
        /// 获取模型列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();
            var docs = mongo.FindAll("_Model");

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = docs
            });
        }

        //public JsonResult Save()
        //{
        //    var list = JsonHelper.ToObject<JArray>(model.Data);

        //    var docs = new List<BsonDocument>();

        //    foreach (var i in list)
        //    {
        //        docs.Add(BsonDocument.Parse(i.ToString()));
        //    }

        //    var mongo = new MongoHelper();

        //    // 删除原来所有数据
        //    mongo.DeleteAll(model.Name);

        //    // 重新添加修改过的数据
        //    mongo.InsertMany(model.Name, docs);

        //    return Json(new
        //    {
        //        Code = 200,
        //        Msg = "保存成功！"
        //    });
        //}
    }
}
