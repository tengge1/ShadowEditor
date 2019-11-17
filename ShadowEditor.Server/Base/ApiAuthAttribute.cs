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
using System.Collections.Generic;

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

            var collection = actionContext.ActionDescriptor.GetCustomAttributes<AuthorityAttribute>();

            if (collection.Count == 0)
            {
                base.OnActionExecuting(actionContext);
                return;
            }

            var attributes = new List<AuthorityAttribute>();
            for (var i = 0; i < collection.Count; i++)
            {
                attributes.Add(collection[i]);
            }

            // 验证权限
            var user = UserHelper.GetCurrentUser();

            if (user == null)
            {
                DenyAction(actionContext, 301, "Not allowed.");
                return;
            }

            if (user.RoleName == "Administrator") // 管理员组默认有全部权限
            {
                base.OnActionExecuting(actionContext);
                return;
            }

            var loginAttribute = attributes.Find(n => n.Authority == "Login"); // 具有Login权限的接口，所有登录用户都能使用

            if (loginAttribute != null)
            {
                base.OnActionExecuting(actionContext);
                return;
            }

            // 必须拥有所有接口权限才允许，否则拒绝。
            foreach (var i in attributes)
            {
                if (!user.OperatingAuthorities.Contains(i.Authority))
                {
                    DenyAction(actionContext, 301, "Not allowed.");
                    return;
                }
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
            var content = JsonHelper.ToJson(new Result
            {
                Code = code,
                Msg = msg
            });

            // 不要通过StatusCode判断是否执行成功，通过Content。
            context.Response = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(content, Encoding.UTF8, "application/json")
            };
        }
    }
}
