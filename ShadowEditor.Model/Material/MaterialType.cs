using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.Material
{
    /// <summary>
    /// 材质类型
    /// </summary>
    public enum MaterialType
    {
        LineBasicMaterial, //线条材质
        LineDashedMaterial, //虚线材质
        MeshBasicMaterial, //基本材质
        MeshDepthMaterial, //深度材质
        MeshNormalMaterial, //法向量材质
        MeshLambertMaterial, //兰伯特材质
        MeshPhongMaterial, //冯氏材质
        PointCloudMaterial, //点云材质
        MeshStandardMaterial, //标准材质
        MeshPhysicalMaterial, //物理材质
        SpriteMaterial, //精灵材质
        ShaderMaterial, //着色器材质
        RawShaderMaterial, //原始着色器材质
    }
}
