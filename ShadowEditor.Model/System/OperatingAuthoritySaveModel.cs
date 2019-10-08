using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.System
{
    /// <summary>
    /// 操作权限保存模型
    /// </summary>
    public class OperatingAuthoritySaveModel
    {
        /// <summary>
        /// 角色ID
        /// </summary>
        public string RoleID { get; set; }

        /// <summary>
        /// 权限
        /// </summary>
        public List<string> Authorities { get; set; }
    }
}
