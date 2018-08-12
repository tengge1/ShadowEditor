using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Mesh
{
    /// <summary>
    /// 模型类型
    /// </summary>
    public enum MeshType
    {
        unknown, // 未知类型
        amf,
        awd,
        binary,
        babylon,
        babylonmeshdata,
        ctm,
        dae,
        fbx,
        glb,
        gltf,
        js,
        json,
        _3geo,
        _3mat,
        _3obj,
        _3scn,
        kmz,
        md2,
        obj,
        playcanvas,
        ply,
        stl,
        vtk,
        wrl
    }
}
