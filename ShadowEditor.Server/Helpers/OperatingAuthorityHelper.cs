using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShadowEditor.Model.System;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// 操作权限帮助器
    /// </summary>
    public class OperatingAuthorityHelper
    {
        /// <summary>
        /// 获取所有权限
        /// </summary>
        /// <returns></returns>
        public static List<OperatingAuthorityModel> GetAll()
        {
            var fields = typeof(OperatingAuthority).GetFields();

            var list = new List<OperatingAuthorityModel>();

            foreach (var i in fields)
            {
                list.Add(new OperatingAuthorityModel
                {
                    ID = i.Name,
                    Name = i.GetValue(typeof(OperatingAuthority)).ToString()
                });
            }

            return list;
        }
    }
}
