using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.CustomAttribute
{
    /// <summary>
    /// 排序属性
    /// </summary>
    public class SortAttribute : Attribute
    {
        private readonly int sort = -1;

        public SortAttribute(int sort)
        {
            this.sort = sort;
        }
    }
}
