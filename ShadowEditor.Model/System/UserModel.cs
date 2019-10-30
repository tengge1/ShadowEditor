using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Model.System
{
    /// <summary>
    /// 用户模型
    /// </summary>
    public class UserModel
    {
        /// <summary>
        /// 编号
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// 密码（md5+盐）
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// 姓名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 角色ID
        /// </summary>
        public string RoleID { get; set; }

        /// <summary>
        /// 角色名称（不存数据库）
        /// </summary>
        public string RoleName { get; set; }

        /// <summary>
        /// 组织机构ID
        /// </summary>
        public string DeptID { get; set; }

        /// <summary>
        /// 组织机构名称（不存数据库）
        /// </summary>
        public string DeptName { get; set; }

        /// <summary>
        /// 性别：0-未设置，1-男，2-女
        /// </summary>
        public int Gender { get; set; }

        /// <summary>
        /// 手机号
        /// </summary>
        public string Phone { get; set; }

        /// <summary>
        /// 电子邮件
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// QQ号
        /// </summary>
        public string QQ { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 最后更新时间
        /// </summary>
        public DateTime UpdateTime { get; set; }

        /// <summary>
        /// 盐
        /// </summary>
        public string Salt { get; set; }

        /// <summary>
        /// 状态（0-正常，-1删除）
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// 所有操作权限（不存数据库）
        /// </summary>
        public List<string> OperatingAuthorities { get; set; }
    }
}
