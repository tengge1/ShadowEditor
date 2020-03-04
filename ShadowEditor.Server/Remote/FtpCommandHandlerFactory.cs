using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FubarDev.FtpServer;
using FubarDev.FtpServer.CommandExtensions;
using FubarDev.FtpServer.CommandHandlers;

namespace ShadowEditor.Server.Remote
{
    /// <summary>
    /// FTP命令处理工厂
    /// </summary>
    public class FtpCommandHandlerFactory : IFtpCommandHandlerFactory
    {
        public IEnumerable<FtpCommandHandlerExtension> CreateCommandHandlerExtensions(FtpConnection connection)
        {
            return new List<FtpCommandHandlerExtension>();
        }

        public IEnumerable<FtpCommandHandler> CreateCommandHandlers(FtpConnection connection)
        {
            return new[]
            {
                new AborCommandHandler(connection),
            };
        }
    }
}
