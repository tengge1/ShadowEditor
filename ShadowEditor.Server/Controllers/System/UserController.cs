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

namespace ShadowEditor.Server.Controllers.System
{
    /// <summary>
    /// 用户控制器
    /// </summary>
    public class UserController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Ne("Status", -1);

            var docs = mongo.FindMany(Constant.UserCollectionName, filter).ToList();

            var list = new List<UserModel>();

            foreach (var doc in docs)
            {
                list.Add(new UserModel
                {
                    ID = doc["_id"].ToString(),
                    Name = doc["Name"].ToString(),
                    CreateTime = doc["CreateTime"].ToLocalTime(),
                    UpdateTime = doc["UpdateTime"].ToLocalTime(),
                    Status = doc["Status"].ToInt32(),
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
        /// 编辑
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Edit(UserEditModel model)
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

            if (model.Name.StartsWith("_"))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Name is not allowed to start with _."
                });
            }

            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var update1 = Builders<BsonDocument>.Update.Set("Name", model.Name);
            var update2 = Builders<BsonDocument>.Update.Set("UpdateTime", DateTime.Now);

            var update = Builders<BsonDocument>.Update.Combine(update1, update2);

            mongo.UpdateOne(Constant.UserCollectionName, filter, update);

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
            var doc = mongo.FindOne(Constant.UserCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The asset is not existed!"
                });
            }

            var update = Builders<BsonDocument>.Update.Set("Status", -1);

            mongo.UpdateOne(Constant.UserCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }
    }
}
