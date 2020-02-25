using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace ShadowEditor.Server.Helpers
{
    public class SocketServer : WebSocketBehavior
    {
        protected override Task OnMessage(MessageEventArgs e)
        {
            Send("Hello, world!");
            return base.OnMessage(e);
        }
    }
}
