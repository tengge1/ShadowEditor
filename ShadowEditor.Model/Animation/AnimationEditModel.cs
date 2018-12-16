using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.Animation
{
    /// <summary>
    /// 动画编辑模型
    /// </summary>
    public class AnimationEditModel
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
        /// 类别
        /// </summary>
        public string Category { get; set; }

        /// <summary>
        /// 缩略图
        /// </summary>
        public string Image { get; set; }
    }
}
