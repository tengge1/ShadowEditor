using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Model
{
    /// <summary>
    /// 场景模型
    /// </summary>
    public class SceneModel
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
        /// 全拼
        /// </summary>
        public string TotalPinYin { get; set; }

        /// <summary>
        /// 首字母拼音
        /// </summary>
        public string FirstPinYin { get; set; }

        /// <summary>
        /// 场景表名
        /// </summary>
        public string CollectionName { get; set; }

        /// <summary>
        /// 场景版本号
        /// </summary>
        public int Version { get; set; }

        /// <summary>
        /// 场景创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 场景更新时间
        /// </summary>
        public DateTime UpdateTime { get; set; }
    }
}
