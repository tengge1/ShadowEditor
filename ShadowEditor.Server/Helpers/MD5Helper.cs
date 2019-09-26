using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// MD5帮助器
    /// </summary>
    public class MD5Helper
    {
        /// <summary>
        /// 加密
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string Encrypt(string text)
        {
            var provider = new MD5CryptoServiceProvider();
            var bytes = provider.ComputeHash(Encoding.UTF8.GetBytes(text));
            var builder = new StringBuilder();

            foreach (byte i in bytes)
            {
                builder.Append(i.ToString("x2"));
            }

            return builder.ToString();
        }
    }
}
