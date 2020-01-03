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
using ShadowEditor.Model.Typeface;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.Tools
{
    /// <summary>
    /// 字体控制器
    /// </summary>
    public class TypefaceController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();

            var docs = mongo.FindAll(Constant.TypefaceCollectionName).SortBy(n => n["Name"]).ToList();

            var list = new List<TypefaceModel>();

            foreach (var i in docs)
            {
                var model = new TypefaceModel
                {
                    ID = i["ID"].AsObjectId.ToString(),
                    Name = i["Name"].AsString,
                    TotalPinYin = i["TotalPinYin"].ToString(),
                    FirstPinYin = i["FirstPinYin"].ToString(),
                    Url = i["Url"].ToString(),
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

        /// <summary>
        /// 添加
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authority("ADMINISTRATOR")]
        public JsonResult Add()
        {
            var files = HttpContext.Current.Request.Files;

            // 校验上传文件
            if (files.Count != 1 || !files[0].FileName.EndsWith(".ttf"))
            {
                return Json(new Result
                {
                    Code = 300,
                    Msg = "Only font file (.ttf) is allowed to upload."
                });
            }

            var file = files[0];
            var fileName = file.FileName;

            // 保存文件
            var now = DateTime.Now;

            var savePath = $"/Upload/Font/{now.ToString("yyyyMMddHHmmss")}";
            var physicalPath = HttpContext.Current.Server.MapPath(savePath);

            if (!Directory.Exists(physicalPath))
            {
                Directory.CreateDirectory(physicalPath);
            }

            // 判断文件是否存在
            if (File.Exists($"{physicalPath}\\{fileName}"))
            {
                return Json(new Result
                {
                    Code = 300,
                    Msg = "The file is already existed."
                });
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
                ["Name"] = fileNameWithoutExt,
                ["TotalPinYin"] = string.Join("", pinyin.TotalPinYin),
                ["FirstPinYin"] = string.Join("", pinyin.FirstPinYin),
                ["Url"] = $"{savePath}/{fileName}",
                ["CreateTime"] = BsonDateTime.Create(now),
            };

            mongo.InsertOne(Constant.TypefaceCollectionName, doc);

            return Json(new Result
            {
                Code = 200,
                Msg = "Upload successfully!"
            });
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority("ADMINISTRATOR")]
        public JsonResult Delete(string ID)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.TypefaceCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The asset is not existed!"
                });
            }

            // 删除文件所在目录
            var url = doc["Url"].ToString();
            var physicalPath = HttpContext.Current.Server.MapPath($"~{url}");
            var dir = Path.GetDirectoryName(physicalPath);

            try
            {
                Directory.Delete(dir, true);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = ex.Message
                });
            }

            mongo.DeleteOne(Constant.TypefaceCollectionName, filter);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }
    }
}
