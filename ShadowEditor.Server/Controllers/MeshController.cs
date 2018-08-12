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
using ShadowEditor.Server.Mesh;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 模型控制器
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
            var docs = mongo.FindAll(Constant.MeshCollectionName);

            var data = docs.Select(o => new
            {
                Name = o["Name"].ToString(),
                TotalPinYin = o["TotalPinYin"].ToString(),
                FirstPinYin = o["FirstPinYin"].ToString(),
                Type = o["Type"].ToString(),
                Url = o["Url"].ToString(),
                Thumbnail = o["Thumbnail"].ToString()
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

            MeshInfo meshInfo = null;

            var ext = Path.GetExtension(fileName);

            switch (ext.ToLower())
            {
                case ".amf": // amf格式
                    meshInfo = new DefaultMeshSaver().Save(MeshType.amf);
                    break;
                case ".zip": // Binary格式
                    meshInfo = new BinaryMeshSaver().Save(MeshType.binary);
                    break;
                default: // 其他格式
                    meshInfo = new DefaultMeshSaver().Save(MeshType.unknown);
                    break;
            }

            // 保存到Mongo
            var mongo = new MongoHelper();

            var doc = new BsonDocument();
            doc["AddTime"] = BsonDateTime.Create(meshInfo.AddTime);
            doc["FileName"] = meshInfo.FileName;
            doc["FileSize"] = meshInfo.FileSize;
            doc["FileType"] = meshInfo.FileType;
            doc["FirstPinYin"] = meshInfo.FirstPinYin;
            doc["Name"] = meshInfo.Name;
            doc["SaveName"] = meshInfo.SaveName;
            doc["SavePath"] = meshInfo.SavePath;
            doc["Thumbnail"] = meshInfo.Thumbnail;
            doc["Type"] = meshInfo.Type.ToString();
            doc["TotalPinYin"] = meshInfo.TotalPinYin;
            doc["Url"] = meshInfo.Url;

            mongo.InsertOne(Constant.MeshCollectionName, doc);

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！"
            });
        }
    }
}
