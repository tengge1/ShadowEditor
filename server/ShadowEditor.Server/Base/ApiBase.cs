using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Base
{
    /// <summary>
    /// 所有API控制器的基类
    /// </summary>
    [ApiAuth]
    public class ApiBase : ApiController
    {
        /// <summary>
        /// 返回JSON执行结果
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public JsonResult Json(object obj)
        {
            var json = JsonHelper.ToJson(obj);
            return new JsonResult(json);
        }

        /// <summary>
        /// 返回XML执行结果
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public XmlResult Xml(string data)
        {
            return new XmlResult(data);
        }
    }
}
