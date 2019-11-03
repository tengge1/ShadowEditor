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
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(roleID) && !ObjectId.TryParse(roleID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "ID is not allowed."
                });
            }

            var mongo = new MongoHelper();

            // 判断是否是系统内置角色
            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.RoleCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The role is not existed."
                });
            }

            var roleName = doc["Name"].ToString();

            // 获取权限信息
            var authorities = OperatingAuthorityHelper.GetAll();
            filter = Builders<BsonDocument>.Filter.Eq("RoleID", roleID);
            var docs = mongo.FindMany(Constant.OperatingAuthorityCollectionName, filter).ToList();

            var rows = new JArray();

            foreach (var i in authorities)
            {
                // 管理员组默认具有所有权限
                rows.Add(new JObject
                {
                    ["ID"] = i.ID,
                    ["Name"] = i.Name,
                    ["Enabled"] = roleName == "Administrator" || docs.Exists(n => n["AuthorityID"].ToString() == i.ID),
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
