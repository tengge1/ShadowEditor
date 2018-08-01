using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Base
{
    /// <summary>
    /// XML执行结果
    /// </summary>
    public class XmlResult : HttpResponseMessage
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="content"></param>
        public XmlResult(string content)
        {
            this.StatusCode = HttpStatusCode.OK;
            this.Content = new StringContent(content, Encoding.UTF8, "text/xml");
        }
    }
}
