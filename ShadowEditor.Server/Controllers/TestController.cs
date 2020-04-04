using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 测试控制器
    /// </summary>
    public class TestController : ApiBase
    {
        [HttpGet]
        public void Download()
        {
            var path = HttpContext.Current.Server.MapPath("~/Upload/Model/20191119214941/RobotExpressive.glb");

            DownloadHelper.Download(path, "机器人模型", "application/octet-stream");
        }
    }
}
