using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.CustomAttribute
{
    /// <summary>
    /// 表示隐藏类的某个属性，不要枚举
    /// </summary>
    public class HiddenAttribute : Attribute
    {
        public HiddenAttribute()
        {

        }
    }
}
