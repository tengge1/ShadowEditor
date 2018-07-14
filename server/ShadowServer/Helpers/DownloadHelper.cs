using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShadowServer.Helpers
{
    /// <summary>
    /// 下载帮助类
    /// </summary>
    public class DownloadHelper
    {
        /// <summary>
        /// 下载文件
        /// </summary>
        /// <param name="path">文件路径</param>
        /// <param name="name">文件名称</param>
        /// <param name="type">文件类型</param>
        public static void Download(string path, string name, string type = "")
        {
            System.IO.FileInfo file = new System.IO.FileInfo(path);
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Charset = "GB2312";
            HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.UTF8;
            // 添加头信息，为"文件下载/另存为"对话框指定默认文件名 
            if (HttpContext.Current.Request.ServerVariables["HTTP_USER_AGENT"].ToLower().IndexOf("firefox") == -1) // 非火狐浏览器需要对url编码
            {
                name = HttpContext.Current.Server.UrlEncode(name);
            }
            HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename=\"" + name + "\""); // 火狐浏览器会把带有空格的文件名断开，必须加双引号
            // 添加头信息，指定文件大小，让浏览器能够显示下载进度 
            HttpContext.Current.Response.AddHeader("Content-Length", file.Length.ToString());
            // 指定返回的是一个不能被客户端读取的流，必须被下载 
            HttpContext.Current.Response.ContentType = type;
            // 把文件流发送到客户端 
            HttpContext.Current.Response.WriteFile(file.FullName);
            HttpContext.Current.Response.End();
        }
    }
}
