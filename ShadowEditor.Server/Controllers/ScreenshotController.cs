using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Model.Screenshot;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 截图控制器
    /// </summary>
    public class ScreenshotController : ApiBase
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
            var filter = Builders<BsonDocument>.Filter.Eq("Type", "Screenshot");
            var categories = mongo.FindMany(Constant.CategoryCollectionName, filter).ToList();

            var docs = mongo.FindAll(Constant.ScreenshotCollectionName).SortBy(n => n["Name"]).ToList();

            var list = new List<ScreenshotModel>();

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

                var info = new ScreenshotModel
                {
                    ID = i["ID"].AsObjectId.ToString(),
                    Name = i["Name"].AsString,
                    CategoryID = categoryID,
                    CategoryName = categoryName,
                    TotalPinYin = i["TotalPinYin"].ToString(),
                    FirstPinYin = i["FirstPinYin"].ToString(),
                    Url = i["Url"].ToString(),
                    CreateTime = i["CreateTime"].ToUniversalTime(),
                    UpdateTime = i["UpdateTime"].ToUniversalTime(),
                    Thumbnail = i["Thumbnail"].ToString()
                };
                list.Add(info);
            }

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = list
            });
        }

        /// <summary>
        /// 添加
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Add()
        {
            var files = HttpContext.Current.Request.Files;

            // 校验上传文件
            if (files.Count != 1)
            {
                return Json(new Result
                {
                    Code = 300,
                    Msg = "只允许上传1个文件！"
                });
            }

            var file = files[0];
            var fileName = file.FileName;
            var fileExt = Path.GetExtension(fileName);
            if (fileExt == null || fileExt.ToLower() != ".jpg" && fileExt.ToLower() != ".jpeg" && fileExt.ToLower() != ".png" && fileExt.ToLower() != ".gif")
            {
                return Json(new Result
                {
                    Code = 300,
                    Msg = "只允许上传jpg、png或gif格式文件！"
                });
            }

            // 保存文件
            var now = DateTime.Now;

            var savePath = $"/Upload/Screenshot/{now.ToString("yyyyMMddHHmmss")}";
            var physicalPath = HttpContext.Current.Server.MapPath(savePath);

            if (!Directory.Exists(physicalPath))
            {
                Directory.CreateDirectory(physicalPath);
            }

            file.SaveAs($"{physicalPath}\\{fileName}");

            // 保存到Mongo
            var fileSize = file.ContentLength;
            var fileType = file.ContentType;
            var fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

            var pinyin = PinYinHelper.GetTotalPinYin(fileNameWithoutExt);

            var mongo = new MongoHelper();

            var doc = new BsonDocument
            {
                ["ID"] = ObjectId.GenerateNewId(),
                ["AddTime"] = BsonDateTime.Create(now),
                ["FileName"] = fileName,
                ["FileSize"] = fileSize,
                ["FileType"] = fileType,
                ["FirstPinYin"] = string.Join("", pinyin.FirstPinYin),
                ["TotalPinYin"] = string.Join("", pinyin.TotalPinYin),
                ["Name"] = fileNameWithoutExt,
                ["SaveName"] = fileName,
                ["SavePath"] = savePath,
                ["Url"] = $"{savePath}/{fileName}",
                ["Thumbnail"] = $"{savePath}/{fileName}",
                ["CreateTime"] = now,
                ["UpdateTime"] = now,
            };

            mongo.InsertOne(Constant.ScreenshotCollectionName, doc);

            return Json(new Result
            {
                Code = 200,
                Msg = "上传成功！"
            });
        }

        /// <summary>
        /// 编辑
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Edit(ScreenshotEditModel model)
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

            var mongo = new MongoHelper();

            var pinyin = PinYinHelper.GetTotalPinYin(model.Name);

            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var update1 = Builders<BsonDocument>.Update.Set("Name", model.Name);
            var update2 = Builders<BsonDocument>.Update.Set("TotalPinYin", pinyin.TotalPinYin);
            var update3 = Builders<BsonDocument>.Update.Set("FirstPinYin", pinyin.FirstPinYin);

            UpdateDefinition<BsonDocument> update5;

            if (string.IsNullOrEmpty(model.Category))
            {
                update5 = Builders<BsonDocument>.Update.Unset("Category");
            }
            else
            {
                update5 = Builders<BsonDocument>.Update.Set("Category", model.Category);
            }

            var update = Builders<BsonDocument>.Update.Combine(update1, update2, update3, update5);
            mongo.UpdateOne(Constant.ScreenshotCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！"
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
            var doc = mongo.FindOne(Constant.ScreenshotCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "该资源不存在！"
                });
            }

            // TODO: 为避免误删等严重后果，暂时不删除文件
            // 删除纹理所在目录
            //var path = doc["SavePath"].ToString();
            //var physicalPath = HttpContext.Current.Server.MapPath(path);

            //try
            //{
            //    Directory.Delete(physicalPath, true);
            //}
            //catch (Exception ex)
            //{
            //    return Json(new
            //    {
            //        Code = 300,
            //        Msg = ex.Message
            //    });
            //}

            mongo.DeleteOne(Constant.ScreenshotCollectionName, filter);

            return Json(new
            {
                Code = 200,
                Msg = "删除成功！"
            });
        }
    }
}
