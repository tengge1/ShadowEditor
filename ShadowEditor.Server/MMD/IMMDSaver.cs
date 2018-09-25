using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShadowEditor.Server.MMD
{
    /// <summary>
    /// MMD保存器接口
    /// </summary>
    public interface IMMDSaver
    {
        /// <summary>
        /// 保存模型
        /// </summary>
        /// <param name="context">Web上下文环境</param>
        /// <returns></returns>
        Result Save(HttpContext context);
    }
}
