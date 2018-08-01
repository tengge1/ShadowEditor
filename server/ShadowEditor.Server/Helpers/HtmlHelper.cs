using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// Html帮助类
    /// </summary>
    public class HtmlHelper
    {
        /// <summary>
        /// 允许跨域访问
        /// </summary>
        /// <param name="context"></param>
        public static void EnableCrossDomain(ref HttpContext context)
        {
            if (!context.Response.Headers.AllKeys.Contains("Access-Control-Allow-Origin"))
            {
                context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            }
        }
    }
}