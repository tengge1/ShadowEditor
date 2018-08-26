using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Texture
{
    /// <summary>
    /// 贴图类型
    /// </summary>
    public enum TextureType
    {
        // 未知类型
        unknown,

        // 透明度贴图
        alphaMap,

        // 环境遮挡贴图
        aoMap,

        // 凹凸贴图
        bumpMap,

        // 置换贴图
        displacementMap,

        // 发光贴图
        emissiveMap,

        // 环境贴图
        envMap,

        // 光照贴图
        lightMap,

        // 颜色贴图
        map,

        // 金属度贴图
        metalnessMap,

        // 法线贴图
        normalMap,

        // 粗糙度贴图
        roughnessMap
    }
}
