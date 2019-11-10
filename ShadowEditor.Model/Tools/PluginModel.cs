using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.Tools
{
    /// <summary>
    /// 插件模型
    /// </summary>
    public class PluginModel
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
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 最后更新时间
        /// </summary>
        public DateTime UpdateTime { get; set; }

        /// <summary>
        /// 简介
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 状态（0-正常，1-禁用，-1删除）
        /// </summary>
        public int Status { get; set; }
    }
}
