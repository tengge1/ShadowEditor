using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ShadowServer.Base
{
    /// <summary>
    /// json执行结果
    /// </summary>
    public class JsonResult : HttpResponseMessage
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="content"></param>
        public JsonResult(string content)
        {
            this.StatusCode = HttpStatusCode.OK;
            this.Content = new StringContent(content, Encoding.UTF8, "application/json");
        }
    }
}
