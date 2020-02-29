using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using WebSocketSharp.Server;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Remote
{
    /// <summary>
    /// 远程编辑服务器
    /// </summary>
    public class RemoteServer
    {
        // ftp
        private string ftpPort = ConfigurationManager.AppSettings["FTPServerPort"];
        private FTPServer ftpServer = new FTPServer();

        // websocket
        private string webSocketPort = ConfigurationManager.AppSettings["WebSocketServerPort"];
        private WebSocketServer webSocketServer = null;

        public void Start()
        {
            // 启动FTP服务器
            ftpServer.Start();

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
                var log = LogHelper.GetLogger(this.GetType());
                log.Error("Create websocket server failed.", ex);
            }
        }

        public void Stop()
        {
            ftpServer.Stop();

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
