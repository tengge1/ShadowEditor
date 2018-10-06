using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Scene
{
    /// <summary>
    /// 场景编辑数据模型
    /// </summary>
    public class EditSceneModel
    {
        /// <summary>
        /// 场景ID
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// 场景名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 缩略图
        /// </summary>
        public string Image { get; set; }
    }
}
