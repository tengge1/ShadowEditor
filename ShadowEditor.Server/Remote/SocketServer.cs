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
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ShadowEditor.Server.Remote
{
    /// <summary>
    /// Socket服务端
    /// </summary>
    /// <see cref="https://github.com/jjrdk/websocket-sharp"/>
    public class SocketServer : WebSocketBehavior
    {
        protected override Task OnMessage(MessageEventArgs e)
        {
            var path = AppDomain.CurrentDomain.BaseDirectory;
            if (path.EndsWith("\\"))
            {
                path = path.Substring(0, path.Length - 1);
            }

            var paths = path.Split('\\').ToList();
            paths.RemoveAt(paths.Count - 1);
            paths.Add("SceneScript");

            path = string.Join("\\", paths);

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            var list = GetScripts(e.Data);

            DeleteScripts(path, true);

            CreateScripts("", path, list);

            Send("Hello, world!");
            return base.OnMessage(e);
        }

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
    }
}
