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
    /// 组织机构控制器
    /// </summary>
    public class DepartmentController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("Status", 0);

            var docs = mongo.FindMany(Constant.DepartmentCollectionName, filter).ToList();

            var list = new List<DepartmentModel>();

            foreach (var doc in docs)
            {
                list.Add(new DepartmentModel
                {
                    ID = doc["ID"].ToString(),
                    ParentID = doc["ParentID"].ToString(),
                    Name = doc["Name"].ToString(),
                    AdministratorID = doc["AdministratorID"].ToString()
                });
            }

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                Data = list
            });
        }

        /// <summary>
        /// 添加
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Add(DepartmentEditModel model)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Name is not allowed to be empty."
                });
            }

            var mongo = new MongoHelper();

            var doc = new BsonDocument
            {
                ["ID"] = ObjectId.GenerateNewId(),
                ["ParentID"] = model.ParentID,
                ["Name"] = model.Name,
                ["AdministratorID"] = model.AdministratorID,
                ["Status"] = 0
            };

            mongo.InsertOne(Constant.DepartmentCollectionName, doc);

            return Json(new
            {
                Code = 200,
                Msg = "Saved successfully!"
            });
        }

        /// <summary>
        /// 编辑
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Edit(DepartmentEditModel model)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(model.ID) && !ObjectId.TryParse(model.ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "ID is not allowed."
                });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Name is not allowed to be empty."
                });
            }

            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);

            var update1 = Builders<BsonDocument>.Update.Set("ParentID", model.ParentID);
            var update2 = Builders<BsonDocument>.Update.Set("Name", model.Name);
            var update3 = Builders<BsonDocument>.Update.Set("AdministratorID", model.AdministratorID);

            var update = Builders<BsonDocument>.Update.Combine(update1, update2, update3);

            mongo.UpdateOne(Constant.DepartmentCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Saved successfully!"
            });
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Delete(string ID)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(ID) && !ObjectId.TryParse(ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "ID is not allowed."
                });
            }

            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.DepartmentCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The department is not existed."
                });
            }

            var update = Builders<BsonDocument>.Update.Set("Status", -1);

            mongo.UpdateOne(Constant.DepartmentCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }
    }
}
