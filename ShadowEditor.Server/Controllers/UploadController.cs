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
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Server.Scene;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 上传控制器
    /// </summary>
    public class UploadController : ApiBase
    {
        /// <summary>
        /// 上传文件
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Upload()
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

            // 上传文件
            var now = DateTime.Now;

            var savePath = $"/Upload/File/{now.ToString("yyyyMMddHHmmss")}";
            var physicalPath = Server.MapPath(savePath);

            if (!Directory.Exists(physicalPath))
            {
                Directory.CreateDirectory(physicalPath);
            }

            file.SaveAs($"{physicalPath}\\{fileName}");

            // 保存Mongo
            var pinyin = PinYinHelper.GetTotalPinYin(fileNameWithoutExt);

            var mongo = new MongoHelper();

            var doc = new BsonDocument();
            doc["AddTime"] = BsonDateTime.Create(now);
            doc["FileName"] = fileName;
            doc["FileSize"] = fileSize;
            doc["FileType"] = fileType;
            doc["FirstPinYin"] = string.Join("", pinyin.FirstPinYin);
            doc["Name"] = fileNameWithoutExt;
            doc["SaveName"] = fileName;
            doc["SavePath"] = savePath;
            doc["Thumbnail"] = "";
            doc["TotalPinYin"] = string.Join("", pinyin.TotalPinYin);
            doc["Url"] = $"{savePath}/{fileName}";

            mongo.InsertOne(Constant.MeshCollectionName, doc);

            return Json(new
            {
                Code = 200,
                Msg = "上传成功！",
                Data = new
                {
                    fileName = fileName,
                    fileSize = fileSize,
                    fileType = fileType,
                    url = $"{savePath}/{fileName}"
                }
            });
        }
    }
}
