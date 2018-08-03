using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Model
{
    /// <summary>
    /// 场景保存模型
    /// </summary>
    public class SaveSceneModel
    {
        /// <summary>
        /// 场景ID
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 数据
        /// </summary>
        public string Data { get; set; }
    }
}
