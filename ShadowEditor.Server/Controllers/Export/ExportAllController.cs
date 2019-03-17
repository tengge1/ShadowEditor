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

namespace ShadowEditor.Server.Controllers.Export
{
    /// <summary>
    /// 导出所有资源控制器
    /// </summary>
    public class ExportAllController : ApiBase
    {
        /// <summary>
        /// 发布静态网站
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Run()
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

            var text = File.ReadAllText(destName).Replace("location.origin", "'.'"); // 使api路径变为当前目录
            File.WriteAllText(destName, text);

            // 复制dist文件夹
            var dirName = server.MapPath("~/examples/dist/");
            sourceName = server.MapPath("~/dist/ShadowEditor.js");
            destName = server.MapPath("~/examples/dist/ShadowEditor.js");

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            File.Copy(sourceName, destName, true);

            text = File.ReadAllText(destName).Replace("Load?ID=", "Scene_"); // 转换场景加载路径
            File.WriteAllText(destName, text);

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

            this.CreateAnimationDataFile();
            this.CreateAudioDataFile();
            this.CreateCategoryDataFile();
            this.CreateMapDataFile();
            this.CreateMaterialDataFile();
            this.CreateMeshDataFile();
            this.CreatePublishDataFile();
            this.CreateSceneDataFile();
            this.CreateUploadDataFile();
        }

        /// <summary>
        /// 复制动画数据文件
        /// </summary>
        private void CreateAnimationDataFile()
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Animation/List");

            var dirName = server.MapPath("~/examples/api/Animation");
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = server.MapPath("~/examples/api/Animation/List");
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { "/examples/api/Animation/Add", "/examples/api/Animation/Edit", "/examples/api/Animation/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "静态网站，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = server.MapPath($"~{i}");
                File.WriteAllText(fileName, data);
            }
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
        /// 创建类别数据文件
        /// </summary>
        private void CreateCategoryDataFile()
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Category/List");

            var dirName = server.MapPath("~/examples/api/Category");
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = server.MapPath("~/examples/api/Category/List");
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { "/examples/api/Category/Save", "/examples/api/Category/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "静态网站，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = server.MapPath($"~{i}");
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建贴图数据文件
        /// </summary>
        private void CreateMapDataFile()
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Map/List");

            var dirName = server.MapPath("~/examples/api/Map");
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = server.MapPath("~/examples/api/Map/List");
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { "/examples/api/Map/Add", "/examples/api/Map/Edit", "/examples/api/Map/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "静态网站，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = server.MapPath($"~{i}");
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建材质数据文件
        /// </summary>
        private void CreateMaterialDataFile()
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Material/List");

            var dirName = server.MapPath("~/examples/api/Material");
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = server.MapPath("~/examples/api/Material/List");
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { "/examples/api/Material/Add", "/examples/api/Material/Edit", "/examples/api/Material/Delete" };

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
        /// 创建发布数据文件
        /// </summary>
        private void CreatePublishDataFile()
        {
            var server = HttpContext.Current.Server;

            var dirName = server.MapPath("~/examples/api/Publish/");

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 其他接口
            var apiList = new string[] { "/examples/api/Publish/Publish" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "静态网站，操作失败！" });

            foreach (var i in apiList)
            {
                var fileName = server.MapPath($"~{i}");
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

            // 导出场景
            var obj = JsonConvert.DeserializeObject<JObject>(result);
            var array = obj["Data"] as JArray;

            foreach (var i in array)
            {
                var id = i["ID"].ToString();
                result = HttpHelper.Get($"http://{host}:{port}/api/Scene/Load?ID={id}");

                fileName = server.MapPath($"~/examples/api/Scene/Scene_{id}");

                File.WriteAllText(fileName, result);
            }

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
