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
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 网格模型控制器
    /// </summary>
    public class MeshController : ApiBase
    {
        /// <summary>
        /// 获取模型列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();
            var docs = mongo.FindAll("_Model");

            var data = docs.Select(o => new
            {
                Name = o["Name"].ToString(),
                Model = o["Model"].ToString()
            });

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = data
            });
        }

        /// <summary>
        /// 保存模型
        /// </summary>
        /// <returns></returns>
        public JsonResult Add()
        {
            var Request = HttpContext.Current.Request;
            var Server = HttpContext.Current.Server;

            // 文件信息
            var file = Request.Files[0];
            var fileName = file.FileName;
            var fileSize = file.ContentLength;
            var fileType = file.ContentType;

            // 保存文件
            var now = DateTime.Now;
            var saveName = now.ToString("yyyyMMddHHmmss") + ".zip";
            var savePath = "/Upload/Model/" + saveName;
            file.SaveAs(Server.MapPath(savePath));

            // 解压文件
            var unzipDir = Server.MapPath($"/Upload/Model/{now.ToString("yyyyMMddHHmmss")}/");
            if (!Directory.Exists(unzipDir))
            {
                Directory.CreateDirectory(unzipDir);
            }

            ZipHelper.Unzip(Server.MapPath(savePath), unzipDir);

            // 查找模型目录中的json文件
            var jsonFileName = fileName.Replace(".zip", ".json");
            var files = Directory.GetFiles(Server.MapPath($"/Upload/Model/{now.ToString("yyyyMMddHHmmss")}/"), "*.json");
            foreach (var i in files)
            {
                if (i.EndsWith(".json"))
                {
                    jsonFileName = Path.GetFileName(i);
                    break;
                }
            }

            // 保存到Mongo
            var mongo = new MongoHelper();

            var doc = new BsonDocument();
            doc["Name"] = fileName;
            doc["FileName"] = fileName;
            doc["FileSize"] = fileSize;
            doc["FileType"] = fileType;
            doc["SaveName"] = saveName;
            doc["SavePath"] = savePath;
            doc["AddTime"] = BsonDateTime.Create(now);
            doc["Model"] = $"/Upload/Model/{now.ToString("yyyyMMddHHmmss")}/" + jsonFileName;
            doc["Thumbnail"] = ""; // 缩略图

            mongo.InsertOne("_Model", doc);

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！"
            });
        }
    }
}
