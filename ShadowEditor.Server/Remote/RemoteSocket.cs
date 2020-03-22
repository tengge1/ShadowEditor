using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Web;
using WebSocketSharp;
using WebSocketSharp.Server;
using ShadowEditor.Model.Script;
using ShadowEditor.Server.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ShadowEditor.Server.Remote
{
    /// <summary>
    /// Remote Socket
    /// </summary>
    /// <see cref="https://github.com/jjrdk/websocket-sharp"/>
    public class RemoteSocket : WebSocketBehavior
    {
        private string rootPath = RemoteHelper.GetRemotePath();

        public RemoteSocket() : base()
        {
            var path = RemoteHelper.GetRemotePath();
            try
            {
                var watcher = new FileSystemWatcher(path);
                watcher.IncludeSubdirectories = true;
                watcher.Changed += OnFileChanged;
            }
            catch (Exception ex)
            {
                var log = LogHelper.GetLogger(this.GetType());
                log.Error("Create FileSystemWatcher failed.", ex);
            }
        }

        protected override Task OnOpen()
        {
            var log = LogHelper.GetLogger(this.GetType());
            log.Info("Socket open.");
            return base.OnOpen();
        }

        protected override Task OnMessage(MessageEventArgs e)
        {
            var list = GetScripts(e.Data);

            DeleteScripts(rootPath, true);

            CreateScripts("", rootPath, list);

            Send(JsonConvert.SerializeObject(new
            {
                Code = 200,
                Msg = "Send Successfully!",
                Type = "Response"
            }));

            return base.OnMessage(e);
        }

        protected override Task OnClose(CloseEventArgs e)
        {
            var log = LogHelper.GetLogger(this.GetType());
            log.Warn("Socket close.");
            return base.OnClose(e);
        }

        protected override Task OnError(WebSocketSharp.ErrorEventArgs e)
        {
            var log = LogHelper.GetLogger(this.GetType());
            log.Error(e.Message, e.Exception);
            return base.OnError(e);
        }

        /// <summary>
        /// 远程编辑文件发生改变
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void OnFileChanged(object sender, FileSystemEventArgs e)
        {
            var list = new List<ScriptModel>();

            TraverseFolder(rootPath, list);

            Send(JsonConvert.SerializeObject(new
            {
                Code = 200,
                Msg = "Send Successfully!",
                Type = "Response"
            }));
        }

        #region 场景脚本改变更新SceneScript文件夹
        private List<ScriptModel> GetScripts(Stream stream)
        {
            var reader = new StreamReader(stream, Encoding.UTF8);
            var data = reader.ReadToEnd();
            reader.Close();

            var obj = JsonConvert.DeserializeObject<JObject>(data);
            var type = obj["type"].ToString();

            var list = new List<ScriptModel>();

            if (type != "changeScript")
            {
                return list;
            }

            var scripts = obj["scripts"] as JArray;

            foreach (var i in scripts)
            {
                list.Add(new ScriptModel
                {
                    ID = i["id"]?.ToString(),
                    PID = i["pid"]?.ToString(),
                    Name = i["name"].ToString(),
                    Type = i["type"].ToString(),
                    Source = i["source"]?.ToString(),
                    UUID = i["uuid"].ToString(),
                    Sort = i["sort"] == null ? 0 : Convert.ToInt32(i["sort"].ToString())
                });
            }

            return list;
        }

        private void DeleteScripts(string path, bool isRoot)
        {
            var dirs = Directory.GetDirectories(path);
            var files = Directory.GetFiles(path);

            foreach (var i in dirs)
            {
                DeleteScripts(i, false);
            }

            foreach (var i in files)
            {
                File.Delete(i);
            }

            if (!isRoot)
            {
                Directory.Delete(path);
            }
        }

        private void CreateScripts(string pid, string path, IList<ScriptModel> list)
        {
            var scripts = list.Where(n => pid == "" ? string.IsNullOrEmpty(n.PID) : n.PID == pid).ToList();

            foreach (var i in scripts)
            {
                var childPath = $"{path}\\{i.Name}";

                if (i.Type == "folder")
                {
                    if (!Directory.Exists(childPath))
                    {
                        Directory.CreateDirectory(childPath);
                    }
                    CreateScripts(i.ID, childPath, list);
                }
                else
                {
                    var extension = GetExtension(i.Type);
                    childPath = $"{childPath}.{extension}";
                    if (!File.Exists(childPath))
                    {
                        var stream = File.Create(childPath);
                        var writer = new StreamWriter(stream);
                        writer.Write(i.Source);
                        writer.Close();
                        stream.Close();
                    }
                }
            }
        }

        private string GetExtension(string type)
        {
            var extension = "";

            switch (type)
            {
                case "javascript":
                    extension = "js";
                    break;
                case "vertexShader":
                case "fragmentShader":
                    extension = "glsl";
                    break;
                case "json":
                    extension = "json";
                    break;
            }

            return extension;
        }
        #endregion

        #region SceneScript文件夹改变更新场景脚本
        public void TraverseFolder(string path, List<ScriptModel> scripts)
        {
            var directories = Directory.GetDirectories(path);
            var files = Directory.GetFiles(path);

            foreach (var i in directories)
            {

            }
            foreach (var i in files)
            {

            }
        }
        #endregion
    }
}
