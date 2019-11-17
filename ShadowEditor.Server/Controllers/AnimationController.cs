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
using MongoDB.Driver;
using ShadowEditor.Model.Animation;
using ShadowEditor.Server.CustomAttribute;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 动画控制器
    /// </summary>
    public class AnimationController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authority("LIST_ANIMATION")]
        public JsonResult List()
        {
            var mongo = new MongoHelper();

            // 获取所有类别
            var filter = Builders<BsonDocument>.Filter.Eq("Type", "Animation");
            var categories = mongo.FindMany(Constant.CategoryCollectionName, filter).ToList();

            var docs = new List<BsonDocument>();

            if (ConfigHelper.EnableAuthority)
            {
                var user = UserHelper.GetCurrentUser();

                if (user != null)
                {
                    var filter1 = Builders<BsonDocument>.Filter.Eq("UserID", user.ID);

                    if (user.Name == "Administrator")
                    {
                        var filter2 = Builders<BsonDocument>.Filter.Exists("UserID");
                        var filter3 = Builders<BsonDocument>.Filter.Not(filter2);
                        filter1 = Builders<BsonDocument>.Filter.Or(filter1, filter3);
                    }
                    docs = mongo.FindMany(Constant.AnimationCollectionName, filter1).ToList();
                }
            }
            else
            {
                docs = mongo.FindAll(Constant.AnimationCollectionName).ToList();
            }

            var list = new List<AnimationModel>();

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

                var info = new AnimationModel
                {
                    ID = i["_id"].ToString(),
                    Name = i["Name"].ToString(),
                    CategoryID = categoryID,
                    CategoryName = categoryName,
                    TotalPinYin = i["TotalPinYin"].ToString(),
                    FirstPinYin = i["FirstPinYin"].ToString(),
                    Type = i["Type"].ToString(),
                    Url = i["Url"].ToString(),
                    Thumbnail = i.Contains("Thumbnail") && !i["Thumbnail"].IsBsonNull ? i["Thumbnail"].ToString() : null
                };

                list.Add(info);
            }

            list.Reverse();

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
        /// <returns></returns>
        [HttpPost]
        [Authority("ADD_ANIMATION")]
        public JsonResult Add()
        {
            var Request = HttpContext.Current.Request;
            var Server = HttpContext.Current.Server;

            // 文件信息
            var file = Request.Files[0];
            var fileName = file.FileName;
            var fileSize = file.ContentLength;
            var fileType = file.ContentType;
            var fileExt = Path.GetExtension(fileName);
            var fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

            if (fileExt == null || fileExt.ToLower() != ".zip")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Only zip file is allowed!"
                });
            }

            // 保存文件
            var now = DateTime.Now;

            var savePath = $"/Upload/Animation/{now.ToString("yyyyMMddHHmmss")}";
            var physicalPath = Server.MapPath(savePath);

            var tempPath = physicalPath + "\\temp"; // zip压缩文件临时保存目录

            if (!Directory.Exists(tempPath))
            {
                Directory.CreateDirectory(tempPath);
            }

            file.SaveAs($"{tempPath}\\{fileName}");

            // 解压文件
            ZipHelper.Unzip($"{tempPath}\\{fileName}", physicalPath);

            // 删除临时目录
            Directory.Delete(tempPath, true);

            // 判断文件类型
            string entryFileName = null;
            var animationType = AnimationType.unknown;

            var files = Directory.GetFiles(physicalPath);

            if (files.Where(o => o.ToLower().EndsWith(".vmd")).Count() > 0) // mmd动画文件或mmd相机动画文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".vmd")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                animationType = AnimationType.mmd;
            }

            if (entryFileName == null || animationType == AnimationType.unknown)
            {
                Directory.Delete(physicalPath, true);

                return Json(new
                {
                    Code = 300,
                    Msg = "Unknown file type!"
                });
            }

            var pinyin = PinYinHelper.GetTotalPinYin(fileNameWithoutExt);

            // 保存到Mongo
            var mongo = new MongoHelper();

            var doc = new BsonDocument
            {
                ["AddTime"] = BsonDateTime.Create(now),
                ["FileName"] = fileName,
                ["FileSize"] = fileSize,
                ["FileType"] = fileType,
                ["FirstPinYin"] = string.Join("", pinyin.FirstPinYin),
                ["Name"] = fileNameWithoutExt,
                ["SaveName"] = fileName,
                ["SavePath"] = savePath,
                ["Thumbnail"] = "",
                ["TotalPinYin"] = string.Join("", pinyin.TotalPinYin),
                ["Type"] = animationType.ToString(),
                ["Url"] = entryFileName
            };

            if (ConfigHelper.EnableAuthority)
            {
                var user = UserHelper.GetCurrentUser();

                if (user != null)
                {
                    doc["UserID"] = user.ID;
                }
            }

            mongo.InsertOne(Constant.AnimationCollectionName, doc);

            return Json(new
            {
                Code = 200,
                Msg = "Upload successfully!"
            });
        }

        /// <summary>
        /// 编辑
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority("EDIT_ANIMATION")]
        public JsonResult Edit(AnimationEditModel model)
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

            var pinyin = PinYinHelper.GetTotalPinYin(model.Name);

            var filter = Builders<BsonDocument>.Filter.Eq("_id", objectId);
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
            mongo.UpdateOne(Constant.AnimationCollectionName, filter, update);

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
        [Authority("DELETE_ANIMATION")]
        public JsonResult Delete(string ID)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("_id", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.AnimationCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The asset is not existed!"
                });
            }

            // 删除模型所在目录
            var path = doc["SavePath"].ToString();
            var physicalPath = HttpContext.Current.Server.MapPath(path);

            try
            {
                Directory.Delete(physicalPath, true);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = ex.Message
                });
            }

            // 删除信息
            mongo.DeleteOne(Constant.AnimationCollectionName, filter);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }
    }
}
