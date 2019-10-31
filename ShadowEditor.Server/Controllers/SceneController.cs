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
using ShadowEditor.Server.CustomAttribute;

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
            var categories = mongo.FindAll(Constant.CategoryCollectionName).ToList();

            var docs = new List<BsonDocument>();

            if (ConfigHelper.EnableAuthority)
            {
                var user = UserHelper.GetCurrentUser();

                if (user != null)
                {
                    var filter1 = Builders<BsonDocument>.Filter.Eq("UserID", user.ID);
                    var filter11 = Builders<BsonDocument>.Filter.Eq("IsPublic", true);
                    filter1 = Builders<BsonDocument>.Filter.Or(filter1, filter11);

                    if (user.Name == "Administrator")
                    {
                        var filter2 = Builders<BsonDocument>.Filter.Exists("UserID");
                        var filter3 = Builders<BsonDocument>.Filter.Not(filter2);
                        filter1 = Builders<BsonDocument>.Filter.Or(filter1, filter3);
                    }
                    docs = mongo.FindMany(Constant.SceneCollectionName, filter1).ToList();
                }
                else // 不登录可以查看所有公开场景
                {
                    var filter1 = Builders<BsonDocument>.Filter.Eq("IsPublic", true);
                    docs = mongo.FindMany(Constant.SceneCollectionName, filter1).ToList();
                }
            }
            else
            {
                docs = mongo.FindAll(Constant.SceneCollectionName).ToList();
            }

            var list = new List<SceneModel>();

            foreach (var i in docs)
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
                    Thumbnail = i.Contains("Thumbnail") && !i["Thumbnail"].IsBsonNull ? i["Thumbnail"].ToString() : null,
                    IsPublic = i.Contains("IsPublic") ? i["IsPublic"].ToBoolean() : false,
                };
                list.Add(info);
            }

            list = list.OrderByDescending(o => o.UpdateTime).ToList();

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                Data = list
            });
        }

        /// <summary>
        /// 获取数据
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult Load(string ID, int version = -1)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.SceneCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The scene is not existed!"
                });
            }

            var collectionName = doc["CollectionName"].AsString;

            List<BsonDocument> docs;

            if (version == -1) // 最新版本
            {
                docs = mongo.FindAll(collectionName).ToList();
            }
            else // 特定版本
            {
                filter = Builders<BsonDocument>.Filter.Eq(Constant.VersionField, BsonInt32.Create(version));
                docs = mongo.FindMany($"{collectionName}{Constant.HistorySuffix}", filter).ToList();
            }

            var data = new JArray();

            foreach (var i in docs)
            {
                i["_id"] = i["_id"].ToString(); // ObjectId
                data.Add(JsonHelper.ToObject<JObject>(i.ToJson()));
            }

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                Data = data
            });
        }

        /// <summary>
        /// 编辑
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.EDIT_SCENE)]
        public JsonResult Edit(SceneEditModel model)
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

            // 开启权限时，判断是否是自己的场景
            if (ConfigHelper.EnableAuthority)
            {
                var user = UserHelper.GetCurrentUser();

                var filter11 = Builders<BsonDocument>.Filter.Eq("ID", model.ID);
                var doc = mongo.FindOne(Constant.SceneCollectionName, filter11);

                if (doc == null)
                {
                    return Json(new
                    {
                        Code = 300,
                        Msg = "The scene is not existed."
                    });
                }

                // 保存其他人的场景
                if (doc.Contains("UserID") && doc["UserID"].ToString() != user.ID)
                {
                    return Json(new
                    {
                        Code = 300,
                        Msg = "Permission denied."
                    });
                }

                // 非管理员组保存不带UserID的场景
                if (!doc.Contains("UserID") && user.RoleName != "Administrator")
                {
                    return Json(new
                    {
                        Code = 300,
                        Msg = "Permission denied."
                    });
                }
            }

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

            var update6 = Builders<BsonDocument>.Update.Set("IsPublic", model.IsPublic);

            var update = Builders<BsonDocument>.Update.Combine(update1, update2, update3, update4, update5, update6);
            mongo.UpdateOne(Constant.SceneCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Saved successfully!"
            });
        }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="model">保存场景模型</param>
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.SAVE_SCENE)]
        public JsonResult Save(SceneSaveModel model)
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

            // 查询场景信息
            var mongo = new MongoHelper();
            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.SceneCollectionName, filter);

            var now = DateTime.Now;

            string collectionName;
            var version = -1;

            if (doc == null) // 新建场景
            {
                collectionName = "Scene" + now.ToString("yyyyMMddHHmmss");
                version = 0;
            }
            else // 编辑场景
            {
                collectionName = doc["CollectionName"].ToString();
                version = doc.Contains("Version") ? int.Parse(doc["Version"].ToString()) : 0;
                version++;
            }

            // 保存或更新场景综合信息
            if (doc == null)
            {
                var pinyin = PinYinHelper.GetTotalPinYin(model.Name);

                doc = new BsonDocument
                {
                    ["ID"] = objectId,
                    ["Name"] = model.Name,
                    ["TotalPinYin"] = string.Join("", pinyin.TotalPinYin),
                    ["FirstPinYin"] = string.Join("", pinyin.FirstPinYin),
                    ["CollectionName"] = collectionName,
                    ["Version"] = version,
                    ["CreateTime"] = BsonDateTime.Create(now),
                    ["UpdateTime"] = BsonDateTime.Create(now),
                    ["IsPublic"] = false,
                };

                if (ConfigHelper.EnableAuthority)
                {
                    var user = UserHelper.GetCurrentUser();

                    if (user != null)
                    {
                        doc["UserID"] = user.ID;
                    }
                }

                mongo.InsertOne(Constant.SceneCollectionName, doc);
            }
            else
            {
                var update1 = Builders<BsonDocument>.Update.Set("Version", version);
                var update2 = Builders<BsonDocument>.Update.Set("UpdateTime", BsonDateTime.Create(now));
                var update = Builders<BsonDocument>.Update.Combine(update1, update2);
                mongo.UpdateOne(Constant.SceneCollectionName, filter, update);

                // 将当前场景移入历史表
                var old = mongo.FindAll(collectionName).ToList();

                foreach (var i in old)
                {
                    i[Constant.VersionField] = version - 1;
                }

                if (old.Count > 0)
                {
                    // 移除_id，避免移入历史表时重复
                    for (var i = 0; i < old.Count; i++)
                    {
                        old[i].Remove("_id");
                    }

                    mongo.InsertMany($"{collectionName}{Constant.HistorySuffix}", old);
                }
            }

            // 保存新的场景信息
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
                Msg = "Saved successfully!",
                ID = objectId
            });
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.DELETE_SCENE)]
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
                    Msg = "The scene is not existed."
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
                Msg = "Delete successfully!"
            });
        }
    }
}
