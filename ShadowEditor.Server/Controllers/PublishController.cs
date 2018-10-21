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
    }
}
