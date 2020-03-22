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
        /// Mongo数据库连接
        /// </summary>
        public static string MongoConnection
        {
            get
            {
                return ConfigurationManager.AppSettings["mongo_connection"];
            }
        }

        /// <summary>
        /// Mongo数据库名称
        /// </summary>
        public static string MongoDBName
        {
            get
            {
                return ConfigurationManager.AppSettings["mongo_dbName"];
            }
        }

        /// <summary>
        /// 是否开启权限管理，true: 开启, false: 关闭
        /// </summary>
        public static bool EnableAuthority
        {
            get
            {
                return ConfigurationManager.AppSettings["EnableAuthority"] == "true";
            }
        }

        /// <summary>
        /// 登录时长设置，分钟，只允许整数。
        /// </summary>
        public static int Expires
        {
            get
            {
                return Convert.ToInt32(ConfigurationManager.AppSettings["Expires"].ToString());
            }
        }

        /// <summary>
        /// 是否开启远程编辑，true: 开启，false: 关闭
        /// </summary>
        public static bool EnableRemoteEdit
        {
            get
            {
                return ConfigurationManager.AppSettings["EnableRemoteEdit"] == "true";
            }
        }

        /// <summary>
        /// WebSocket服务器端口（远程编辑用）
        /// </summary>
        public static int WebSocketServerPort
        {
            get
            {
                return Convert.ToInt32(ConfigurationManager.AppSettings["WebSocketServerPort"]);
            }
        }
    }
}
