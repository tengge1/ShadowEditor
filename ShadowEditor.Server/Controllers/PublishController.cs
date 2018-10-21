using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web;
using System.IO;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using Newtonsoft.Json;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 发布控制器
    /// </summary>
    public class PublishController : ApiBase
    {
        /// <summary>
        /// 发布静态网站
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Publish()
        {
            this.CopyAssets();
            this.CreateDataFile();

            return Json(new
            {
                Code = 200,
                Msg = "发布成功！"
            });
        }

        /// <summary>
        /// 复制资源到示例文件夹
        /// </summary>
        private void CopyAssets()
        {
            var server = HttpContext.Current.Server;

            // 复制html文件
            var sourceName = server.MapPath("~/index.html");
            var destName = server.MapPath("~/examples/index.html");

            File.Copy(sourceName, destName, true);

            // 复制dist文件夹
            sourceName = server.MapPath("~/dist");
            destName = server.MapPath("~/examples/dist");

            DirectoryHelper.Copy(sourceName, destName);

            // 复制assets文件夹
            sourceName = server.MapPath("~/assets");
            destName = server.MapPath("~/examples/assets");

            DirectoryHelper.Copy(sourceName, destName);

            // 复制Upload文件夹
            sourceName = server.MapPath("~/Upload");
            destName = server.MapPath("~/examples/Upload");

            DirectoryHelper.Copy(sourceName, destName);

            // 复制网站图标
            sourceName = server.MapPath("~/favicon.ico");
            destName = server.MapPath("~/examples/favicon.ico");

            File.Copy(sourceName, destName, true);
        }

        /// <summary>
        /// 通过调用API接口，创建数据文件
        /// </summary>
        private void CreateDataFile()
        {
            var server = HttpContext.Current.Server;

            var dirName = server.MapPath("~/api/");

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            this.CreateAudioDataFile();
            this.CreateMeshDataFile();
            this.CreateMMDDataFile();
            this.CreateSceneDataFile();
            this.CreateTextureDataFile();
            this.CreateUploadDataFile();
        }

        /// <summary>
        /// 创建音频数据文件
        /// </summary>
        private void CreateAudioDataFile()
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Audio/List");

            var dirName = server.MapPath("~/examples/api/Audio");
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = server.MapPath("~/examples/api/Audio/List");
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { "/examples/api/Audio/Add", "/examples/api/Audio/Edit", "/examples/api/Audio/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "静态网站，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = server.MapPath($"~{i}");
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建模型数据文件
        /// </summary>
        private void CreateMeshDataFile()
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Mesh/List");

            var dirName = server.MapPath("~/examples/api/Mesh");
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = server.MapPath("~/examples/api/Mesh/List");
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { "/examples/api/Mesh/Add", "/examples/api/Mesh/Edit", "/examples/api/Mesh/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "静态网站，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = server.MapPath($"~{i}");
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建MMD数据文件
        /// </summary>
        private void CreateMMDDataFile()
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/MMD/List");

            var dirName = server.MapPath("~/examples/api/MMD");
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = server.MapPath("~/examples/api/MMD/List");
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { "/examples/api/MMD/Add", "/examples/api/MMD/Edit", "/examples/api/MMD/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "静态网站，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = server.MapPath($"~{i}");
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建场景数据文件
        /// </summary>
        private void CreateSceneDataFile()
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Scene/List");

            var dirName = server.MapPath("~/examples/api/Scene");
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = server.MapPath("~/examples/api/Scene/List");
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { "/examples/api/Scene/Edit", "/examples/api/Scene/Save", "/examples/api/Scene/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "静态网站，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = server.MapPath($"~{i}");
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建纹理数据文件
        /// </summary>
        private void CreateTextureDataFile()
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Texture/List");

            var dirName = server.MapPath("~/examples/api/Texture");
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = server.MapPath("~/examples/api/Texture/List");
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { "/examples/api/Texture/Add", "/examples/api/Texture/Edit", "/examples/api/Texture/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "静态网站，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = server.MapPath($"~{i}");
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建上传数据文件
        /// </summary>
        private void CreateUploadDataFile()
        {
            var server = HttpContext.Current.Server;

            var dirName = server.MapPath("~/examples/api/Upload");

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 其他接口
            var apiList = new string[] { "/examples/api/Upload/Upload" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "静态网站，操作失败！" });

            foreach (var i in apiList)
            {
                var fileName = server.MapPath($"~{i}");
                File.WriteAllText(fileName, data);
            }
        }
    }
}
