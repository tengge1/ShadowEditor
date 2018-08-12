using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShadowEditor.Server.Mesh
{
    /// <summary>
    /// 模型保存器接口
    /// </summary>
    public interface IMeshSaver
    {
        /// <summary>
        /// 保存模型
        /// </summary>
        /// <param name="meshType">模型类型</param>
        /// <returns></returns>
        MeshInfo Save(MeshType meshType);
    }
}
