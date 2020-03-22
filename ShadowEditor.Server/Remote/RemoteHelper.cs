using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace ShadowEditor.Server.Remote
{
    /// <summary>
    /// 远程编辑帮助函数
    /// </summary>
    public class RemoteHelper
    {
        /// <summary>
        /// 获取远程编辑临时路径
        /// </summary>
        /// <returns></returns>
        public static string GetRemotePath()
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

            return path;
        }
    }
}
