using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Security;

namespace ShadowServer.Base
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
            try
            {
                // 允许匿名访问
                if (actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Count > 0)
                {
                    base.OnActionExecuting(actionContext);
                    return;
                }

                // 获取cookie
                var cookie = actionContext.Request.Headers.GetCookies();
                if (cookie == null || cookie.Count < 1)
                {
                    DenyAction(actionContext, 301, "登录超时！");
                    return;
                }

                // 获取票据
                FormsAuthenticationTicket ticket = null;
                foreach (var perCookie in cookie[0].Cookies)
                {
                    if (perCookie.Name == FormsAuthentication.FormsCookieName)
                    {
                        ticket = FormsAuthentication.Decrypt(perCookie.Value);
                        break;
                    }
                }

                // 验证票据
                if (ticket == null)
                {
                    DenyAction(actionContext, 300, "无权限！");
                    return;
                }

                // 验证权限后将获得的用户信息写入Session
                HttpContext.Current.Items.Add("__userID", ticket.UserData); // 获取登陆时写入cookie的用户ID

                base.OnActionExecuting(actionContext);
            }
            catch
            {
                DenyAction(actionContext, 300, "权限验证出错！");
            }
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
