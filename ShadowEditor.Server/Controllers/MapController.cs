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
using ShadowEditor.Model.Map;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 贴图控制器
    /// </summary>
    public class MapController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authority(OperatingAuthority.LIST_MAP)]
        public JsonResult List()
        {
            var mongo = new MongoHelper();

            // 获取所有类别
            var filter = Builders<BsonDocument>.Filter.Eq("Type", "Map");
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
                    docs = mongo.FindMany(Constant.MapCollectionName, filter1).SortBy(n => n["Name"]).ToList();
                }
            }
            else
            {
                docs = mongo.FindAll(Constant.MapCollectionName).SortBy(n => n["Name"]).ToList();
            }

            var list = new List<MapModel>();

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

                var builder = new StringBuilder();

                if (i["Url"].IsBsonDocument) // 立体贴图
                {
                    builder.Append($"{i["Url"]["PosX"].AsString};");
                    builder.Append($"{i["Url"]["NegX"].AsString};");
                    builder.Append($"{i["Url"]["PosY"].AsString};");
                    builder.Append($"{i["Url"]["NegY"].AsString};");
                    builder.Append($"{i["Url"]["PosZ"].AsString};");
                    builder.Append($"{i["Url"]["NegZ"].AsString};");
                }
                else // 其他贴图
                {
                    builder.Append(i["Url"].AsString);
                }

                var info = new MapModel
                {
                    ID = i["ID"].AsObjectId.ToString(),
                    Name = i["Name"].AsString,
                    CategoryID = categoryID,
                    CategoryName = categoryName,
                    TotalPinYin = i["TotalPinYin"].ToString(),
                    FirstPinYin = i["FirstPinYin"].ToString(),
                    Type = i["Type"].AsString,
                    Url = builder.ToString().TrimEnd(';'),
                    CreateTime = i["CreateTime"].ToUniversalTime(),
                    UpdateTime = i["UpdateTime"].ToUniversalTime(),
                    Thumbnail = i["Thumbnail"].ToString()
                };
                list.Add(info);
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
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.ADD_MAP)]
        public JsonResult Add()
        {
            var files = HttpContext.Current.Request.Files;

            // 校验上传文件
            if (files.Count != 1 && files.Count != 6)
            {
                return Json(new Result
                {
                    Code = 300,
                    Msg = "Only one or six files is allowed to upload!"
                });
            }

            for (var i = 0; i < files.Count; i++)
            {
                var file1 = files[i];
                var fileName1 = file1.FileName;
                var fileExt1 = Path.GetExtension(fileName1);
                if (fileExt1 == null || fileExt1.ToLower() != ".jpg" && fileExt1.ToLower() != ".jpeg" && fileExt1.ToLower() != ".png" && fileExt1.ToLower() != ".gif" && fileExt1.ToLower() != ".mp4")
                {
                    return Json(new Result
                    {
                        Code = 300,
                        Msg = "Only jpg, png, mp4 file is allowed to upload!"
                    });
                }
            }

            // 保存文件
            var now = DateTime.Now;

            var savePath = $"/Upload/Texture/{now.ToString("yyyyMMddHHmmss")}";
            var physicalPath = HttpContext.Current.Server.MapPath(savePath);

            if (!Directory.Exists(physicalPath))
            {
                Directory.CreateDirectory(physicalPath);
            }

            for (var i = 0; i < files.Count; i++)
            {
                var file1 = files[i];
                var fileName1 = file1.FileName;

                file1.SaveAs($"{physicalPath}\\{fileName1}");
            }

            // 保存到Mongo
            // 立体贴图的情况，除Url外，所有信息取posX的信息即可。
            var file = files[0];
            var fileName = file.FileName;
            var fileSize = file.ContentLength;
            var fileType = file.ContentType;
            var fileExt = Path.GetExtension(fileName);
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
                ["Name"] = fileNameWithoutExt,
                ["SaveName"] = fileName,
                ["SavePath"] = savePath
            };
            if (Path.GetExtension(files[0].FileName).ToLower() == ".mp4")
            {
                // TODO: 通过插件获取mp4缩略图
                doc["Thumbnail"] = $"";
            }
            else
            {
                doc["Thumbnail"] = $"{savePath}/{fileName}";
            }

            doc["TotalPinYin"] = string.Join("", pinyin.TotalPinYin);

            if (files.Count == 6) // 立体贴图
            {
                doc["Type"] = MapType.cube.ToString();

                var doc1 = new BsonDocument
                {
                    ["PosX"] = $"{savePath}/{files["posX"].FileName}",
                    ["NegX"] = $"{savePath}/{files["negX"].FileName}",
                    ["PosY"] = $"{savePath}/{files["posY"].FileName}",
                    ["NegY"] = $"{savePath}/{files["negY"].FileName}",
                    ["PosZ"] = $"{savePath}/{files["posZ"].FileName}",
                    ["NegZ"] = $"{savePath}/{files["negZ"].FileName}"
                };

                doc["Url"] = doc1;
            }
            else if (Path.GetExtension(files[0].FileName).ToLower() == ".mp4") // 视频贴图
            {
                doc["Type"] = MapType.video.ToString();
                doc["Url"] = $"{savePath}/{fileName}";
            }
            else
            {
                doc["Type"] = MapType.unknown.ToString();
                doc["Url"] = $"{savePath}/{fileName}";
            }

            doc["CreateTime"] = now;
            doc["UpdateTime"] = now;

            if (ConfigHelper.EnableAuthority)
            {
                var user = UserHelper.GetCurrentUser();

                if (user != null)
                {
                    doc["UserID"] = user.ID;
                }
            }

            mongo.InsertOne(Constant.MapCollectionName, doc);

            return Json(new Result
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
        [Authority(OperatingAuthority.EDIT_MAP)]
        public JsonResult Edit(MapEditModel model)
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
            mongo.UpdateOne(Constant.MapCollectionName, filter, update);

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
        [Authority(OperatingAuthority.DELETE_MAP)]
        public JsonResult Delete(string ID)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.MapCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The asset is not existed!"
                });
            }

            // 删除纹理所在目录
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

            mongo.DeleteOne(Constant.MapCollectionName, filter);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }
    }
}
