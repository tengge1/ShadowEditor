using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.System
{
    /// <summary>
    /// 配置模型
    /// </summary>
    public class ConfigModel
    {
        /// <summary>
        /// ID
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// 是否开启权限
        /// </summary>
        public bool EnableAuthority { get; set; }
    }
}
