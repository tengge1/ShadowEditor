using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.IO;
using System.Web;
using System.Reflection;
using WebSocketSharp.Server;
using ShadowEditor.Server.Helpers;
using FubarDev.FtpServer;
using FubarDev.FtpServer.AccountManagement;
using FubarDev.FtpServer.AccountManagement.Anonymous;
using FubarDev.FtpServer.FileSystem.DotNet;

namespace ShadowEditor.Server.Remote
{
    /// <summary>
    /// 远程编辑服务器
    /// </summary>
    public class RemoteServer
    {
        // ftp
        private string ftpPort = ConfigurationManager.AppSettings["FTPServerPort"];
        private FtpServer ftpServer = null;

        // websocket
        private string webSocketPort = ConfigurationManager.AppSettings["WebSocketServerPort"];
        private WebSocketServer webSocketServer = null;

        public void Start()
        {
            var log = LogHelper.GetLogger(this.GetType());

            // 启动FTP服务器
            try
            {
                var path = HttpContext.Current.Server.MapPath("~/Upload/TestFtpServer");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                var fsProvider = new DotNetFileSystemProvider(path, false);

                var membershipProvider = new AnonymousMembershipProvider(new NoValidation());

                // , int.Parse(ftpPort), new FtpCommandHandlerFactory()
                var ftpServer = new FtpServer(
                    fsProvider, 
                    membershipProvider, 
                    "127.0.0.1", 
                    int.Parse(ftpPort), 
                    new AssemblyFtpCommandHandlerFactory(typeof(FtpServer).GetTypeInfo().Assembly)
                );
                ftpServer.Start();
            }
            catch (Exception ex)
            {
                log.Error("Create FtpServer failed.", ex);
            }

            // 启动Websocket服务器
            try
            {
                // see: https://github.com/jjrdk/websocket-sharp
                webSocketServer = new WebSocketServer(null, int.Parse(webSocketPort));
                webSocketServer.AddWebSocketService<SocketServer>("/Socket");
                webSocketServer.Start();
            }
            catch (Exception ex)
            {
                log.Error("Create websocket server failed.", ex);
            }
        }

        public void Stop()
        {
            if (ftpServer != null)
            {
                ftpServer.Stop();
            }

            try
            {
                webSocketServer.Stop();
            }
            catch (Exception ex)
            {
                var log = LogHelper.GetLogger(this.GetType());
                log.Error("Stop websocket server failed.", ex);
            }
        }
    }
}
