using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Audio
{
    /// <summary>
    /// 音频模型
    /// </summary>
    public class AudioModel
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
        /// 全拼
        /// </summary>
        public string TotalPinYin { get; set; }

        /// <summary>
        /// 首字母拼音
        /// </summary>
        public string FirstPinYin { get; set; }

        /// <summary>
        /// 下载地址
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// 版本号
        /// </summary>
        public int Version { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 最后更新时间
        /// </summary>
        public DateTime UpdateTime { get; set; }
    }
}
