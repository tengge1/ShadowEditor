using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// FTP服务端
    /// </summary>
    public class FTPServer
    {
        private int port = 2121;

        public FTPServer()
        {
            var sport = ConfigurationManager.AppSettings["FTPServerPort"];
            if (int.TryParse(sport, out int iport))
            {
                this.port = iport;
            }
        }

        public void Start()
        {

        }

        public void Stop()
        {

        }
    }
}
