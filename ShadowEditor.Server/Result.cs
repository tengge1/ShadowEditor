using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server
{
    /// <summary>
    /// 脚本运行结果
    /// </summary>
    public class Result
    {
        /// <summary>
        /// 状态码（200-执行成功，300-执行失败）
        /// </summary>
        public int Code { get; set; }

        /// <summary>
        /// 状态信息
        /// </summary>
        public string Msg { get; set; }
    }

    /// <summary>
    /// 脚本运行结果（泛型）
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Result<T>
    {
        public int Code { get; set; }

        public string Msg { get; set; }

        public T Data { get; set; }
    }
}
