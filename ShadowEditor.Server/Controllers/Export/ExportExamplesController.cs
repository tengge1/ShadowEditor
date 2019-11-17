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
    /// 导出所有示例控制器
    /// </summary>
    public class ExportExamplesController : ApiBase
    {
        /// <summary>
        /// 发布静态网站
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authority("ADMINISTRATOR")]
        public JsonResult Run()
        {
            var now = DateTime.Now;

            var path = HttpContext.Current.Server.MapPath($"~/temp/{now.ToString("yyyyMMddHHmmss")}");

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            this.CopyStaticAssets(path);
            this.CreateDataFile(path);

            return Json(new
            {
                Code = 200,
                Msg = "Export successfully!",
                Url = $"/temp/{now.ToString("yyyyMMddHHmmss")}/index.html"
            });
        }

        #region 复制静态资源
        /// <summary>
        /// 复制静态资源到示例文件夹
        /// </summary>
        /// <param name="path"></param>
        private void CopyStaticAssets(string path)
        {
            var list = new string[]
            {
                "favicon.ico",
                "index.html",
                "view.html",
                "assets",
                "build",
                "locales"
            };

            foreach (var i in list)
            {
                var source = HttpContext.Current.Server.MapPath($"~/{i}");
                var dest = $"{path}/{i}";

                if (File.Exists(source)) // 文件
                {
                    File.Copy(source, dest, true);

                    if (i == "index.html" || i == "view.html") // 入口页需要把服务端替换成相对目录，以便静态化api接口。
                    {
                        var text1 = File.ReadAllText(dest, Encoding.UTF8).Replace("location.origin", "'.'"); // 使api路径变为当前目录
                        File.WriteAllText(dest, text1, Encoding.UTF8);
                    }
                }
                else if (Directory.Exists(source)) // 目录
                {
                    DirectoryHelper.Copy(source, dest);
                }
                else // 其他
                {
                    throw new Exception($"Unknown ${i}");
                }
            }
        }
        #endregion

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

            this.CreateAnimationDataFile(path);
            this.CreateAssetsDataFile(path);
            this.CreateAudioDataFile(path);
            this.CreateCategoryDataFile(path);
            this.CreateCharacterDataFile(path);
            this.CreateMapDataFile(path);
            this.CreateMaterialDataFile(path);
            this.CreateMeshDataFile(path);
            this.CreateParticleDataFile(path);
            this.CreatePrefabDataFile(path);
            this.CreateSceneDataFile(path);
            this.CreateScreenshotDataFile(path);
            this.CreateUploadDataFile(path);
            this.CreateVideoDataFile(path);
        }

        #region Animation
        /// <summary>
        /// 复制动画数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateAnimationDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Animation/List");

            var dirName = $"{path}/api/Animation";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Animation/List";
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { $"{path}/api/Animation/Add", $"{path}/api/Animation/Edit", $"{path}/api/Animation/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Assets
        /// <summary>
        /// 复制资源数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateAssetsDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Assets/List");

            var dirName = $"{path}/api/Assets";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Assets/List";
            File.WriteAllText(fileName, result);
        }
        #endregion

        #region Audio
        /// <summary>
        /// 创建音频数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateAudioDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Audio/List");

            var dirName = $"{path}/api/Audio";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Audio/List";
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { $"{path}/api/Audio/Add", $"{path}/api/Audio/Edit", $"{path}/api/Audio/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Category
        /// <summary>
        /// 创建类别数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateCategoryDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Category/List");

            var dirName = $"{path}/api/Category";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Category/List";
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { $"{path}/api/Category/Save", $"{path}/api/Category/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Character
        /// <summary>
        /// 创建角色数据文件
        /// </summary>
        private void CreateCharacterDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Character/List");

            var dirName = $"{path}/api/Character";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Character/List";
            File.WriteAllText(fileName, result);

            // 导出场景
            var obj = JsonConvert.DeserializeObject<JObject>(result);
            var array = obj["Data"] as JArray;

            foreach (var i in array)
            {
                var id = i["ID"].ToString();
                result = HttpHelper.Get($"http://{host}:{port}/api/Character/Get?ID={id}");

                fileName = $"{path}/api/Character/Character_{id}";

                File.WriteAllText(fileName, result);
            }

            // 其他接口
            var apiList = new string[] { $"{path}/api/Character/Edit", $"{path}/api/Character/Save", $"{path}/api/Character/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Map
        /// <summary>
        /// 创建贴图数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateMapDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Map/List");

            var dirName = $"{path}/api/Map";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Map/List";
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { $"{path}/api/Map/Add", $"{path}/api/Map/Edit", $"{path}/api/Map/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Material
        /// <summary>
        /// 创建材质数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateMaterialDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Material/List");

            var dirName = $"{path}/api/Material";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Material/List";
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { $"{path}/api/Material/Add", $"{path}/api/Material/Edit", $"{path}/api/Material/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Mesh
        /// <summary>
        /// 创建模型数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateMeshDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Mesh/List");

            var dirName = $"{path}/api/Mesh";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Mesh/List";
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { $"{path}/api/Mesh/Add", $"{path}/api/Mesh/Edit", $"{path}/api/Mesh/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Particle
        /// <summary>
        /// 创建粒子数据文件
        /// </summary>
        private void CreateParticleDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Particle/List");

            var dirName = $"{path}/api/Particle";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Particle/List";
            File.WriteAllText(fileName, result);

            // 导出场景
            var obj = JsonConvert.DeserializeObject<JObject>(result);
            var array = obj["Data"] as JArray;

            foreach (var i in array)
            {
                var id = i["ID"].ToString();
                result = HttpHelper.Get($"http://{host}:{port}/api/Particle/Get?ID={id}");

                fileName = $"{path}/api/Particle/Particle_{id}";

                File.WriteAllText(fileName, result);
            }

            // 其他接口
            var apiList = new string[] { $"{path}/api/Particle/Edit", $"{path}/api/Particle/Save", $"{path}/api/Particle/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Particle
        /// <summary>
        /// 创建预设体数据文件
        /// </summary>
        private void CreatePrefabDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Prefab/List");

            var dirName = $"{path}/api/Prefab";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Prefab/List";
            File.WriteAllText(fileName, result);

            // 导出场景
            var obj = JsonConvert.DeserializeObject<JObject>(result);
            var array = obj["Data"] as JArray;

            foreach (var i in array)
            {
                var id = i["ID"].ToString();
                result = HttpHelper.Get($"http://{host}:{port}/api/Prefab/Get?ID={id}");

                fileName = $"{path}/api/Prefab/Prefab_{id}";

                File.WriteAllText(fileName, result);
            }

            // 其他接口
            var apiList = new string[] { $"{path}/api/Prefab/Edit", $"{path}/api/Prefab/Save", $"{path}/api/Prefab/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Scene
        /// <summary>
        /// 创建场景数据文件
        /// </summary>
        private void CreateSceneDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Scene/List");

            var dirName = $"{path}/api/Scene";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Scene/List";
            File.WriteAllText(fileName, result);

            // 导出场景
            var obj = JsonConvert.DeserializeObject<JObject>(result);
            var array = obj["Data"] as JArray;

            foreach (var i in array)
            {
                var id = i["ID"].ToString();
                result = HttpHelper.Get($"http://{host}:{port}/api/Scene/Load?ID={id}");

                fileName = $"{path}/api/Scene/Scene_{id}";

                File.WriteAllText(fileName, result);
            }

            // 其他接口
            var apiList = new string[] { $"{path}/api/Scene/Edit", $"{path}/api/Scene/Save", $"{path}/api/Scene/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Screenshot
        /// <summary>
        /// 创建截图数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateScreenshotDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Screenshot/List");

            var dirName = $"{path}/api/Screenshot";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Screenshot/List";
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { $"{path}/api/Screenshot/Add", $"{path}/api/Screenshot/Edit", $"{path}/api/Screenshot/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Upload
        /// <summary>
        /// 创建上传数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateUploadDataFile(string path)
        {
            var server = HttpContext.Current.Server;

            var dirName = $"{path}/api/Upload";

            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 其他接口
            var apiList = new string[] { $"{path}/api/Upload/Upload" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion

        #region Video
        /// <summary>
        /// 创建截图数据文件
        /// </summary>
        /// <param name="path"></param>
        private void CreateVideoDataFile(string path)
        {
            var server = HttpContext.Current.Server;
            var request = HttpContext.Current.Request;
            var host = request.Url.Host;
            var port = request.Url.Port;

            var result = HttpHelper.Get($"http://{host}:{port}/api/Video/List");

            var dirName = $"{path}/api/Video";
            if (!Directory.Exists(dirName))
            {
                Directory.CreateDirectory(dirName);
            }

            // 获取列表
            var fileName = $"{path}/api/Video/List";
            File.WriteAllText(fileName, result);

            // 其他接口
            var apiList = new string[] { $"{path}/api/Video/Add", $"{path}/api/Video/Edit", $"{path}/api/Video/Delete" };

            var data = JsonConvert.SerializeObject(new { Code = 200, Msg = "Execute sucessfully!" });

            foreach (var i in apiList)
            {
                File.WriteAllText(i, data);
            }
        }
        #endregion
    }
}
