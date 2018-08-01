using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 场景
    /// </summary>
    public class SceneController : ApiBase
    {
        /// <summary>
        /// 加载场景
        /// </summary>
        /// <param name="name">场景名称</param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult Load(string name)
        {
            var mongo = new MongoHelper();
            var docs = mongo.FindAll(name);

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = docs
            });
        }

        /// <summary>
        /// 保存场景
        /// </summary>
        /// <param name="model">保存场景模型</param>
        /// <returns></returns>
        public JsonResult Save(SaveSceneModel model)
        {
            var list = JsonHelper.ToObject<JArray>(model.Data);

            var docs = new List<BsonDocument>();

            foreach (var i in list)
            {
                docs.Add(BsonDocument.Parse(i.ToString()));
            }

            var mongo = new MongoHelper();

            // 删除原来所有数据
            mongo.DeleteAll(model.Name);

            // 重新添加修改过的数据
            mongo.InsertMany(model.Name, docs);

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！"
            });
        }
    }

    /// <summary>
    /// 场景保存模型
    /// </summary>
    public class SaveSceneModel
    {
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 数据
        /// </summary>
        public string Data { get; set; }
    }
}
