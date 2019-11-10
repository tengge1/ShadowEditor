using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.Tools
{
    /// <summary>
    /// 插件编辑模型
    /// </summary>
    public class PluginEditModel
    {
        /// <summary>
        /// 编号
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 源码
        /// </summary>
        public string Source { get; set; }

        /// <summary>
        /// 简介
        /// </summary>
        public string Description { get; set; }
    }
}
