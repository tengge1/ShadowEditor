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
using ShadowEditor.Server.CustomAttribute;

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
        [Authority(OperatingAuthority.UPLOAD_THUMBNAIL)]
        public JsonResult Upload()
        {
            var Request = HttpContext.Current.Request;
            var Server = HttpContext.Current.Server;

            // 文件信息
            var file = Request.Files[0];
            var fileName = file.FileName;
            var fileSize = file.ContentLength;
            var fileType = file.ContentType;
            var fileExt = Path.GetExtension(fileName).ToLower();
            var fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

            if (fileExt != ".jpg" && fileExt != ".jpeg" && fileExt != ".png" && fileExt != ".gif")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Only jpg, png, gif format is allowed to upload!"
                });
            }

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
                ["Url"] = $"{savePath}/{fileName}"
            };

            if (ConfigHelper.EnableAuthority)
            {
                var user = UserHelper.GetCurrentUser();

                if (user != null)
                {
                    doc["UserID"] = user.ID;
                }
            }

            mongo.InsertOne(Constant.FileCollectionName, doc);

            return Json(new
            {
                Code = 200,
                Msg = "Upload successfully!",
                Data = new
                {
                    fileName,
                    fileSize,
                    fileType,
                    url = $"{savePath}/{fileName}"
                }
            });
        }
    }
}
