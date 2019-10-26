using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Security;
using ShadowEditor.Model.System;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Server.CustomAttribute;
using Newtonsoft.Json;

namespace ShadowEditor.Server.Base
{
    /// <summary>
    /// ApiController权限验证属性
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class ApiAuth : ActionFilterAttribute
    {
        /// <summary>
        /// 权限验证
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (!ConfigHelper.EnableAuthority)
            {
                base.OnActionExecuting(actionContext);
                return;
            }

            var attributes = actionContext.ActionDescriptor.GetCustomAttributes<AuthorityAttribute>();

            if (attributes.Count == 0)
            {
                base.OnActionExecuting(actionContext);
                return;
            }

            // 验证权限
            var user = UserHelper.GetCurrentUser();

            if (user == null)
            {
                DenyAction(actionContext, 301, "Not allowed.");
                return;
            }

            if (user.Name == "Administrator")
            {
                base.OnActionExecuting(actionContext);
                return;
            }

            base.OnActionExecuting(actionContext);
        }

        /// <summary>
        /// 处理拒绝访问
        /// </summary>
        /// <param name="context">上下文环境</param>
        /// <param name="code">状态码（300-执行出错，301-登录超时）</param>
        /// <param name="msg">说明</param>
        private void DenyAction(HttpActionContext context, int code, string msg)
        {
            //context.Response.StatusCode = HttpStatusCode.OK;
            //var content = JsonHelper.ToJson(new Model.Result
            //{
            //    Code = code,
            //    Msg = msg
            //});
            //context.Response.Content = new StringContent(content, Encoding.UTF8, "application/json");
        }
    }
}
