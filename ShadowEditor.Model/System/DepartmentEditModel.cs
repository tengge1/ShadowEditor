using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.System
{
    /// <summary>
    /// 组织机构编辑模型
    /// </summary>
    public class DepartmentEditModel
    {
        /// <summary>
        /// 编号
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// 父组织机构名称
        /// </summary>
        public string ParentID { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 管理员用户ID
        /// </summary>
        public string AdministratorID { get; set; }
    }
}
