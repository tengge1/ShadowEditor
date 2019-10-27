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
        /// 默认注册用户ID
        /// </summary>
        public string DefaultRegisterRole { get; set; }
    }
}
