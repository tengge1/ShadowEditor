using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.CustomAttribute
{
    /// <summary>
    /// 权限属性
    /// </summary>
    public class AuthorityAttribute : Attribute
    {
        private readonly string authority = null;

        public AuthorityAttribute(string authority)
        {
            this.authority = authority;
        }

        public string Authority
        {
            get
            {
                return authority;
            }
        }
    }
}
