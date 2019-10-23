using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.System
{
    /// <summary>
    /// 组织机构模型
    /// </summary>
    public class DepartmentModel
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

        /// <summary>
        /// 状态（0-正常，-1-删除）
        /// </summary>
        public int Status { get; set; }
    }
}
