using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.Category
{
    /// <summary>
    /// 类别类型
    /// </summary>
    public enum CategoryType
    {
        /// <summary>
        /// 场景
        /// </summary>
        Scene,

        /// <summary>
        /// 网格模型
        /// </summary>
        Mesh,

        /// <summary>
        /// 贴图
        /// </summary>
        Map,

        /// <summary>
        /// 纹理
        /// </summary>
        Texture,

        /// <summary>
        /// 材质
        /// </summary>
        Material,

        /// <summary>
        /// 音频
        /// </summary>
        Audio,

        /// <summary>
        /// 动画
        /// </summary>
        Animation,

        /// <summary>
        /// 粒子
        /// </summary>
        Particle,

        /// <summary>
        /// 预设体
        /// </summary>
        Prefab,

        /// <summary>
        /// 角色
        /// </summary>
        Character,

        /// <summary>
        /// 截图
        /// </summary>
        Screenshot,

        /// <summary>
        /// 视频
        /// </summary>
        Video,
    }
}
