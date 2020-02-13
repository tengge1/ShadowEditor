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
using ShadowEditor.Model.Scene;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.Export
{
    /// <summary>
    /// 导出场景列表控制器
    /// </summary>
    public class ExportSceneListController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();

            var docs = mongo.FindAll(Constant.ExportSceneListCollectionName).SortBy(n => n["Name"]).ToList();

            var list = new List<ExportSceneListModel>();

            foreach (var i in docs)
            {
                var model = new ExportSceneListModel
                {
                    ID = i["ID"].AsObjectId.ToString(),
                    Name = i["Name"].AsString,
                    TotalPinYin = i["TotalPinYin"].ToString(),
                    FirstPinYin = i["FirstPinYin"].ToString(),
                    CreateTime = i["CreateTime"].ToUniversalTime()
                };
                list.Add(model);
            }

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                Data = list
            });
        }
    }
}