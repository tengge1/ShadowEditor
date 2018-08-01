using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using log4net;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// 文件记录帮助类（记录在文本文件，可自动记录NHibernate和Spring.NET的日志）
    /// </summary>
    public class LogHelper
    {
        /// <summary>
        /// 获取一个命名日志记录工具
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static ILog GetLogger(string key)
        {
            return LogManager.GetLogger("myLogger");
        }

        /// <summary>
        /// 获取一个type类型日志记录工具
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static ILog GetLogger(Type type)
        {
            return LogManager.GetLogger(type);
        }
    }
}
