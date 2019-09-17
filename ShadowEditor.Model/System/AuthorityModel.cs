using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.System
{
    /// <summary>
    /// 权限模型
    /// </summary>
    public class AuthorityModel
    {
        /// <summary>
        /// 编号
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// 角色ID
        /// </summary>
        public string RoleID { get; set; }

        /// <summary>
        /// 类型（1-UI权限,2-接口权限）
        /// </summary>
        public int Type { get; set; }

        /// <summary>
        /// 权限数据（对应页面控件或服务端接口）
        /// </summary>
        public string Date { get; set; }
    }
}
