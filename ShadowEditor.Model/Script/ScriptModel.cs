using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.Script
{
    /// <summary>
    /// 脚本模型
    /// </summary>
    public class ScriptModel
    {
        /// <summary>
        /// MongoDB _id
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// 父要素ID
        /// </summary>
        public string PID { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 类型
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// 源码
        /// </summary>
        public string Source { get; set; }

        /// <summary>
        /// THREE.js UUID
        /// </summary>
        public string UUID { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        public int Sort { get; set; }
    }
}
