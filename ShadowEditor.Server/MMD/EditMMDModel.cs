using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.MMD
{
    /// <summary>
    /// MMD编辑数据模型
    /// </summary>
    public class EditMMDModel
    {
        /// <summary>
        /// ID
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 缩略图
        /// </summary>
        public string Image { get; set; }
    }
}
