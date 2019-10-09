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
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.System
{
    /// <summary>
    /// 操作权限管理
    /// </summary>
    public class OperatingAuthorityController : ApiBase
    {
        /// <summary>
        /// 根据角色ID获取权限
        /// </summary>
        /// <param name="roleID"></param>
        /// <returns></returns>
        [HttpGet]
        [Authority(OperatingAuthority.LIST_OPERATING_AUTHORITY)]
        public JsonResult Get(string roleID)
        {
            var fields = typeof(OperatingAuthority).GetFields();

            var helper = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("RoleID", roleID);
            var docs = helper.FindMany(Constant.OperatingAuthorityCollectionName, filter).ToList();

            var rows = new JArray();

            foreach (var i in fields)
            {
                rows.Add(new JObject
                {
                    ["ID"] = i.Name,
                    ["Name"] = i.GetValue(typeof(OperatingAuthority)).ToString(),
                    ["Enabled"] = docs.Exists(n => n["AuthorityID"].ToString() == i.Name),
                });
            }

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                Data = new
                {
                    total = rows.Count,
                    rows,
                },
            });
        }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.SAVE_OPERATING_AUTHORITY)]
        public JsonResult Save([FromBody]OperatingAuthoritySaveModel model)
        {
            if (string.IsNullOrEmpty(model.RoleID))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "RoleID is not defined."
                });
            }

            if (model.Authorities == null)
            {
                model.Authorities = new List<string>();
            }

            var mongo = new MongoHelper();

            // 移除旧权限
            var filter = Builders<BsonDocument>.Filter.Eq("RoleID", model.RoleID);
            mongo.DeleteMany(Constant.OperatingAuthorityCollectionName, filter);

            // 添加新权限
            if (model.Authorities.Count > 0)
            {
                var docs = new List<BsonDocument>();

                foreach (var i in model.Authorities)
                {
                    docs.Add(new BsonDocument
                    {
                        ["RoleID"] = model.RoleID,
                        ["AuthorityID"] = i
                    });
                }

                mongo.InsertMany(Constant.OperatingAuthorityCollectionName, docs);
            }

            return Json(new
            {
                Code = 200,
                Msg = "Saved successfully!"
            });
        }
    }
}
