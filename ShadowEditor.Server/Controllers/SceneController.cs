using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Model.Scene;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 场景控制器
    /// </summary>
    public class SceneController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();

            // 获取所有类别
            var categories = mongo.FindAll(Constant.CategoryCollectionName);

            var scenes = mongo.FindAll(Constant.SceneCollectionName);

            var list = new List<SceneModel>();

            foreach (var i in scenes)
            {
                var categoryID = "";
                var categoryName = "";

                if (i.Contains("Category") && !i["Category"].IsBsonNull && !string.IsNullOrEmpty(i["Category"].ToString()))
                {
                    var doc = categories.Where(n => n["_id"].ToString() == i["Category"].ToString()).FirstOrDefault();
                    if (doc != null)
                    {
                        categoryID = doc["_id"].ToString();
                        categoryName = doc["Name"].ToString();
                    }
                }

                var info = new SceneModel
                {
                    ID = i["ID"].AsObjectId.ToString(),
                    Name = i["Name"].AsString,
                    CategoryID = categoryID,
                    CategoryName = categoryName,
                    TotalPinYin = i["TotalPinYin"].ToString(),
                    FirstPinYin = i["FirstPinYin"].ToString(),
                    CollectionName = i["CollectionName"].AsString,
                    Version = i["Version"].AsInt32,
                    CreateTime = i["CreateTime"].ToUniversalTime(),
                    UpdateTime = i["UpdateTime"].ToUniversalTime(),
                    Thumbnail = i.Contains("Thumbnail") && !i["Thumbnail"].IsBsonNull ? i["Thumbnail"].ToString() : null
                };
                list.Add(info);
            }

            list = list.OrderByDescending(o => o.UpdateTime).ToList();

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = list
            });
        }

        /// <summary>
        /// 获取场景数据
        /// </summary>
        /// <param name="ID">场景ID</param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult Load(string ID)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.SceneCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "该场景不存在！"
                });
            }

            var collectionName = doc["CollectionName"].AsString;

            var docs = mongo.FindAll(collectionName);

            var data = new JArray();

            foreach (var i in docs)
            {
                i["_id"] = i["_id"].ToString(); // ObjectId
                data.Add(JsonHelper.ToObject<JObject>(i.ToJson()));
            }

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = data
            });
        }

        /// <summary>
        /// 编辑信息
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Edit(SceneEditModel model)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(model.ID) && !ObjectId.TryParse(model.ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "ID不合法。"
                });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "名称不允许为空。"
                });
            }

            if (model.Name.StartsWith("_"))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "名称不允许以下划线开头。"
                });
            }

            var mongo = new MongoHelper();

            var pinyin = PinYinHelper.GetTotalPinYin(model.Name);

            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var update1 = Builders<BsonDocument>.Update.Set("Name", model.Name);
            var update2 = Builders<BsonDocument>.Update.Set("TotalPinYin", pinyin.TotalPinYin);
            var update3 = Builders<BsonDocument>.Update.Set("FirstPinYin", pinyin.FirstPinYin);
            var update4 = Builders<BsonDocument>.Update.Set("Thumbnail", model.Image);

            UpdateDefinition<BsonDocument> update5;

            if (string.IsNullOrEmpty(model.Category))
            {
                update5 = Builders<BsonDocument>.Update.Unset("Category");
            }
            else
            {
                update5 = Builders<BsonDocument>.Update.Set("Category", model.Category);
            }

            var update = Builders<BsonDocument>.Update.Combine(update1, update2, update3, update4, update5);
            mongo.UpdateOne(Constant.SceneCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！"
            });
        }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="model">保存场景模型</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Save(SceneSaveModel model)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(model.ID) && !ObjectId.TryParse(model.ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "场景ID不合法。"
                });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "场景名称不允许为空。"
                });
            }

            if (model.Name.StartsWith("_"))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "场景名称不允许以下划线开头。"
                });
            }

            // 查询场景信息
            var mongo = new MongoHelper();
            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.SceneCollectionName, filter);

            var now = DateTime.Now;

            string collectionName;

            if (doc == null) // 新建场景
            {
                collectionName = "Scene" + now.ToString("yyyyMMddHHmmss");
            }
            else // 编辑场景
            {
                collectionName = doc["CollectionName"].ToString();
            }

            // 保存或更新场景综合信息
            if (doc == null)
            {
                var pinyin = PinYinHelper.GetTotalPinYin(model.Name);

                doc = new BsonDocument();
                doc["ID"] = objectId;
                doc["Name"] = model.Name;
                doc["TotalPinYin"] = string.Join("", pinyin.TotalPinYin);
                doc["FirstPinYin"] = string.Join("", pinyin.FirstPinYin);
                doc["CollectionName"] = collectionName;
                doc["Version"] = 0;
                doc["CreateTime"] = BsonDateTime.Create(now);
                doc["UpdateTime"] = BsonDateTime.Create(now);
                mongo.InsertOne(Constant.SceneCollectionName, doc);
            }
            else
            {
                var update1 = Builders<BsonDocument>.Update.Set("Version", int.Parse(doc["Version"].ToString()) + 1);
                var update2 = Builders<BsonDocument>.Update.Set("UpdateTime", BsonDateTime.Create(now));
                var update = Builders<BsonDocument>.Update.Combine(update1, update2);
                mongo.UpdateOne(Constant.SceneCollectionName, filter, update);
            }

            // 保存场景信息
            var list = JsonHelper.ToObject<JArray>(model.Data);

            var docs = new List<BsonDocument>();

            foreach (var i in list)
            {
                docs.Add(BsonDocument.Parse(i.ToString()));
            }

            mongo.DeleteAll(collectionName);
            mongo.InsertMany(collectionName, docs);

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！",
                ID = objectId
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
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.SceneCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "该场景不存在！"
                });
            }

            // 删除场景综合信息
            mongo.DeleteOne(Constant.SceneCollectionName, filter);

            var collectionName = doc["CollectionName"].AsString;

            // 删除场景数据集
            mongo.DropCollection(collectionName);

            return Json(new
            {
                Code = 200,
                Msg = "删除场景成功！"
            });
        }
    }
}
