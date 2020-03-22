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

namespace ShadowEditor.Server.Remote
{
    /// <summary>
    /// 远程编辑服务器
    /// </summary>
    public class RemoteServer
    {
        private WebSocketServer webSocketServer = null;

        public void Start()
        {
            var log = LogHelper.GetLogger(this.GetType());

            // 启动Websocket服务器
            try
            {
                // see: https://github.com/jjrdk/websocket-sharp
                webSocketServer = new WebSocketServer(null, ConfigHelper.WebSocketServerPort);

                webSocketServer.AddWebSocketService<RemoteSocket>("/RemoteEdit");

                webSocketServer.Start();
            }
            catch (Exception ex)
            {
                log.Error("Create websocket server failed.", ex);
            }
        }

        public void Stop()
        {
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
