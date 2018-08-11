using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShadowEditor.Server.Mesh
{
    /// <summary>
    /// 模型保存接口
    /// </summary>
    public interface IMeshSaver
    {
        /// <summary>
        /// 保存模型
        /// </summary>
        /// <param name="Context"></param>
        /// <returns></returns>
        MeshInfo Save(HttpContext Context);
    }
}
