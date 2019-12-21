using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.Scene
{
    /// <summary>
    /// 场景历史模型
    /// </summary>
    public class SceneHistoryModel
    {
        /// <summary>
        /// 场景历史ID
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// 场景ID
        /// </summary>
        public string SceneID { get; set; }

        /// <summary>
        /// 场景名称
        /// </summary>
        public string SceneName { get; set; }

        /// <summary>
        /// 版本
        /// </summary>
        public int Version { get; set; }

        /// <summary>
        /// 是否最新版本
        /// </summary>
        public bool IsNew { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? CreateTime { get; set; }

        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime? UpdateTime { get; set; }
    }
}
