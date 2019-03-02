using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// 字符串工具类
    /// </summary>
    public class StringHelper
    {
        /// <summary>
        /// 移除文本最后的数字和下划线
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string RemoveEndNumbersAnd_(string text)
        {
            while (text.Length > 0)
            {
                var lastLetter = text.Last();
                if (lastLetter >= '0' && lastLetter <= '9' || lastLetter == '_')
                {
                    text = text.Substring(0, text.Length - 1);
                }
                else
                {
                    break;
                }
            }

            return text;
        }
    }
}
