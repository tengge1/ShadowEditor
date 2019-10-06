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
using System.Text;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.Export
{
    /// <summary>
    /// 导出编辑器控制器
    /// </summary>
    public class ExportEditorController : ApiBase
    {
        /// <summary>
        /// 发布静态网站
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.EXPORT_EDITOR)]
        public JsonResult Run()
        {
            var now = DateTime.Now;

            var path = HttpContext.Current.Server.MapPath($"~/temp/{now.ToString("yyyyMMddHHmmss")}");

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            this.CopyAssets(path);
            this.CreateDataFile(path);

            return Json(new
            {
                Code = 200,
                Msg = "Export successfully!",
                Url = $"/temp/{now.ToString("yyyyMMddHHmmss")}/editor.html"
            });
        }

        /// <summary>
        /// 复制资源到示例文件夹
        /// </summary>
        /// <param name="path"></param>
        private void CopyAssets(string path)
        {
            // 复制html文件
            var sourceName = HttpContext.Current.Server.MapPath("~/index.html");
            var destName = $"{path}/editor.html";

            File.Copy(sourceName, destName, true);

            var text = File.ReadAllText(destName, Encoding.UTF8).Replace("location.origin", "'.'"); // 使api路径变为当前目录
            File.WriteAllText(destName, text, Encoding.UTF8);

            // 复制build文件夹
            var dirName = $"{path}/build/";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            sourceName = HttpContext.Current.Server.MapPath("~/build/ShadowEditor.js");
            destName = $"{path}/build/ShadowEditor.js";

            File.Copy(sourceName, destName, true);

            // 复制assets文件夹
            sourceName = HttpContext.Current.Server.MapPath("~/assets");
            destName = $"{path}/assets";

            DirectoryHelper.Copy(sourceName, destName);

            // 复制语言包
            sourceName = HttpContext.Current.Server.MapPath("~/lang");
            destName = $"{path}/lang";
            DirectoryHelper.Copy(sourceName, destName);

            // 复制网站图标
            sourceName = HttpContext.Current.Server.MapPath("~/favicon.ico");
            destName = $"{path}/favicon.ico";

            File.Copy(sourceName, destName, true);
        }

        /// <summary>
        /// 通过调用API接口，创建数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateDataFile(string path)
        {
            var dirName = $"{path}/api/";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            this.CreateAssetsDataFile(path);
            this.CreateAnimationDataFile(path);
            this.CreateAudioDataFile(path);
            this.CreateCategoryDataFile(path);
            this.CreateMapDataFile(path);
            this.CreateMaterialDataFile(path);
            this.CreateMeshDataFile(path);
            this.CreateExportSceneDataFile(path);
            this.CreateSceneDataFile(path);
            this.CreateUploadDataFile(path);
            this.CreateToolsDataFile(path);
        }

        /// <summary>
        /// 复制资源数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateAssetsDataFile(string path)
        {
            var dirName = $"{path}/api/Assets";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Assets/List";
            var data = JsonConvert.SerializeObject(new
            {
                Code = 200,
                Msg = "获取成功！",
                sceneCount = 32,
                meshCount = 2469,
                mapCount = 674,
                materialCount = 12,
                audioCount = 19,
                animationCount = 8,
                particleCount = 0,
                prefabCount = 0,
                characterCount = 0
            });
            File.WriteAllText(fileName, data);
        }

        /// <summary>
        /// 复制动画数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateAnimationDataFile(string path)
        {
            var dirName = $"{path}/api/Animation";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Animation/List";
            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "获取成功！", Data = new JArray() });
            File.WriteAllText(fileName, data);

            // 其他接口
            var apiList = new string[] { "/api/Animation/Add", "/api/Animation/Edit", "/api/Animation/Delete" };

            data = JsonConvert.SerializeObject(new { Code = 300, Msg = "演示程序，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = $"{path}{i}";
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建音频数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateAudioDataFile(string path)
        {
            var dirName = $"{path}/api/Audio";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Audio/List";
            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "获取成功！", Data = new JArray() });
            File.WriteAllText(fileName, data);

            // 其他接口
            var apiList = new string[] { "/api/Audio/Add", "/api/Audio/Edit", "/api/Audio/Delete" };

            data = JsonConvert.SerializeObject(new { Code = 300, Msg = "演示程序，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = $"{path}{i}";
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建类别数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateCategoryDataFile(string path)
        {
            var dirName = $"{path}/api/Category";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var host = HttpContext.Current.Request.Url.Host;
            var port = HttpContext.Current.Request.Url.Port;
            var result = HttpHelper.Get($"http://{host}:{port}/api/Category/List");

            var fileName = $"{path}/api/Category/List";
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { "/api/Category/Save", "/api/Category/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "演示程序，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = $"{path}{i}";
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建贴图数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateMapDataFile(string path)
        {
            var dirName = $"{path}/api/Map";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Map/List";
            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "获取成功！", Data = new JArray() });
            File.WriteAllText(fileName, data);

            // 其他接口
            var apiList = new string[] { "/api/Map/Add", "/api/Map/Edit", "/api/Map/Delete" };

            data = JsonConvert.SerializeObject(new { Code = 300, Msg = "演示程序，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = $"{path}{i}";
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建材质数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateMaterialDataFile(string path)
        {
            var dirName = $"{path}/api/Material";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Material/List";
            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "获取成功！", Data = new JArray() });
            File.WriteAllText(fileName, data);

            // 其他接口
            var apiList = new string[] { "/api/Material/Add", "/api/Material/Edit", "/api/Material/Delete" };

            data = JsonConvert.SerializeObject(new { Code = 300, Msg = "演示程序，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = $"{path}{i}";
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建模型数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateMeshDataFile(string path)
        {
            var dirName = $"{path}/api/Mesh";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Mesh/List";
            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "获取成功！", Data = new JArray() });
            File.WriteAllText(fileName, data);

            // 其他接口
            var apiList = new string[] { "/api/Mesh/Add", "/api/Mesh/Edit", "/api/Mesh/Delete" };

            data = JsonConvert.SerializeObject(new { Code = 300, Msg = "演示程序，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = $"{path}{i}";
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建导出场景数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateExportSceneDataFile(string path)
        {
            var dirName = $"{path}/api/ExportScene";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 其他接口
            var apiList = new string[] { "/api/ExportScene/Run" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "演示程序，操作失败！" });

            foreach (var i in apiList)
            {
                var fileName = $"{path}{i}";
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建场景数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateSceneDataFile(string path)
        {
            var dirName = $"{path}/api/Scene";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Scene/List";
            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "获取成功！", Data = new JArray() });
            File.WriteAllText(fileName, data);

            // 其他接口
            var apiList = new string[] { "/api/Scene/Edit", "/api/Scene/Load", "/api/Scene/Save", "/api/Scene/Delete" };

            data = JsonConvert.SerializeObject(new { Code = 300, Msg = "演示程序，操作失败！" });

            foreach (var i in apiList)
            {
                fileName = $"{path}{i}";
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建上传数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateUploadDataFile(string path)
        {
            var dirName = $"{path}/api/Upload";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 其他接口
            var apiList = new string[] { "/api/Upload/Upload" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "演示程序，操作失败！" });

            foreach (var i in apiList)
            {
                var fileName = $"{path}{i}";
                File.WriteAllText(fileName, data);
            }
        }

        /// <summary>
        /// 创建工具数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateToolsDataFile(string path)
        {
            // 其他接口
            var apiList = new string[] { "/api/ArrangeMap", "/api/ArrangeMesh", "/api/ArrangeThumbnail" };

            var data = JsonConvert.SerializeObject(new { Code = 300, Msg = "演示程序，操作失败！" });

            foreach (var i in apiList)
            {
                var dirName = $"{path}{i}";

                if (!Directory.Exists(dirName))
                {
                    Directory.CreateDirectory(dirName);
                }

                File.WriteAllText($"{dirName}/Run", data);
            }
        }
    }
}
