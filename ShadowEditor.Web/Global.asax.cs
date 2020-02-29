using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using System.Configuration;
using System.Net;
using log4net.Config;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Remote;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Client
{
    public class Global : System.Web.HttpApplication
    {
        /// <summary>
        /// 远程编辑服务
        /// </summary>
        private RemoteServer server = null;

        protected void Application_Start(object sender, EventArgs e)
        {
            // 开启Web Api
            GlobalConfiguration.Configure(WebApiConfig.Register);

            // 初始化log4net配置
            XmlConfigurator.Configure();

            // 记录系统启动日志
            var log = LogHelper.GetLogger(this.GetType());
            log.Info("Application start successfully!");

            var enableRemoteEdit = ConfigurationManager.AppSettings["EnableRemoteEdit"] == "true";
            if (enableRemoteEdit)
            {
                server = new RemoteServer();
                server.Start();
            }
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            // 为api controller开启session
            HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            var exception = Server.GetLastError().GetBaseException();

            var builder = new StringBuilder();

            builder.Append($"Time: {DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}\n");
            builder.Append($"Url: {Request.Url.ToString()}\n");
            builder.Append($"Message: {exception.Message}\n");
            builder.Append($"StackTrace: {exception.StackTrace}\n");
            builder.Append($"Source: {exception.Source}\n");

            // Server.ClearError();
            var log = LogHelper.GetLogger(this.GetType());
            log.Error(builder.ToString());
        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {
            if (server != null)
            {
                server.Stop();
            }
        }
    }
}