using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.IO;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using System.Text;

namespace ShadowEditor.Server.Controllers.Tools
{
    /// <summary>
    /// 整理模型控制器
    /// </summary>
    public class ArrangeMeshController : ApiBase
    {
        /// <summary>
        /// 开始执行
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Run()
        {
            var meshPath = HttpContext.Current.Server.MapPath($"~/Upload/Model");

            // 创建临时目录
            var now = DateTime.Now;
            var path = HttpContext.Current.Server.MapPath($"~/Upload/Model{now.ToString("yyyyMMddHHmmss")}");

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            // 备份贴图数据表，并清空原数据表
            var mongo = new MongoHelper();
            var docs = mongo.FindAll(Constant.MeshCollectionName).ToList();
            if (docs.Count > 0)
            {
                mongo.InsertMany($"{Constant.MeshCollectionName}{now.ToString("yyyyMMddHHmmss")}", docs);
            }
            mongo.DeleteAll(Constant.MeshCollectionName);

            // 读取模型数据表，将文件完美复制到临时目录
            for (var i = 0; i < docs.Count; i++)
            {
                var doc = docs[i];

                // 更新名称
                var name = doc["Name"].ToString();
                name = StringHelper.RemoveEndNumbersAnd_(name);
                var pinyin = PinYinHelper.GetTotalPinYin(name);

                doc["Name"] = name;
                doc["FirstPinYin"] = new BsonArray(pinyin.FirstPinYin);
                doc["TotalPinYin"] = new BsonArray(pinyin.TotalPinYin);

                // 处理Url，并复制文件
                var urls = new List<string>();

                foreach (var j in doc["Url"].ToString().Split(';'))
                {
                    urls.Add(j);
                }

                HandleUrl(urls.ToArray(), path, ref doc);

                // 更新路径和时间
                var addTime = doc["AddTime"].ToUniversalTime();
                var savePath = $"/Upload/Model/{addTime.ToString("yyyyMMddHHmmss")}";
                doc["SavePath"] = savePath.ToString();
                doc["UpdateTime"] = DateTime.Now;

                // 添加到Mongo数据表
                mongo.InsertOne(Constant.MeshCollectionName, doc);
            }

            // 交换正式目录和临时目录
            Directory.Move(meshPath, path + "_temp");
            Directory.Move(path, meshPath);
            Directory.Move(path + "_temp", path);

            // 移除模型目录空文件夹
            DirectoryHelper.RemoveEmptyDir(meshPath);

            return Json(new
            {
                Code = 200,
                Msg = "执行成功！"
            });
        }

        /// <summary>
        /// 根据Url处理文件相关问题
        /// </summary>
        /// <param name="urls"></param>
        /// <param name="path"></param>
        /// <param name="doc"></param>
        /// <returns></returns>
        private bool HandleUrl(string[] urls, string path, ref BsonDocument doc)
        {
            var addTime = doc["AddTime"].ToUniversalTime();
            var savePath = doc["SavePath"].ToString();
            var fileSize = 0L;

            var sb = new StringBuilder();

            foreach (var url in urls)
            {
                if (string.IsNullOrEmpty(url))
                {
                    continue;
                }

                if (!url.Contains("/"))
                {
                    continue;
                }

                var names = url.Split('/');
                var name = names[names.Length - 1];

                if (sb.Length > 0)
                {
                    sb.Append(";");
                }
                sb.Append($"/Upload/Model/{addTime.ToString("yyyyMMddHHmmss")}/{name}");

                // 复制模型，要复制文件夹中的所有文件
                var sourceFileName = HttpContext.Current.Server.MapPath($"~{url}");
                var sourceFileDir = Path.GetDirectoryName(sourceFileName);

                if (Directory.Exists(sourceFileDir))
                {
                    var files = Directory.GetFiles(sourceFileDir);

                    var destFileDir = $"{path}\\{addTime.ToString("yyyyMMddHHmmss")}";

                    if (!Directory.Exists(destFileDir))
                    {
                        Directory.CreateDirectory(destFileDir);
                    }

                    foreach (var i in files)
                    {
                        var file = new FileInfo(i);
                        fileSize += file.Length;

                        File.Copy(sourceFileName, $"{destFileDir}\\{Path.GetFileName(i)}", true);
                    }
                }
            }

            doc["FileSize"] = fileSize;

            if (sb.Length > 0) // 有url
            {
                doc["Url"] = sb.ToString();
            }
            else // 没用url
            {
                doc["Url"] = "";
            }

            return true;
        }
    }
}
