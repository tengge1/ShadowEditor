using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// 配置管理器
    /// </summary>
    public sealed class ConfigHelper
    {
        /// <summary>
        /// 是否开启权限
        /// </summary>
        public static bool EnableAuthority
        {
            get
            {
                return ConfigurationManager.AppSettings["EnableAuthority"] == "true";
            }
        }
    }
}
