using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// JSON帮助类
    /// </summary>
    public class JsonHelper
    {
        /// <summary>
        /// JSON序列化和反序列化设置
        /// </summary>
        private static JsonSerializerSettings setting = new JsonSerializerSettings
        {
            DateFormatString = "yyyy-MM-dd HH:mm:ss",
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        };

        /// <summary>
        /// 转换为JSON字符串
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <param name="obj">对象</param>
        /// <returns>JSON字符串</returns>
        public static string ToJson<T>(T obj)
        {
            return JsonConvert.SerializeObject(obj, setting);
        }

        /// <summary>
        /// 转换为JSON字符串
        /// </summary>
        /// <param name="obj">对象</param>
        /// <returns>JSON字符串</returns>
        public static string ToJson(object obj)
        {
            return JsonConvert.SerializeObject(obj, setting);
        }

        /// <summary>
        /// 转换为对象
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <param name="json">JSON字符串</param>
        /// <returns>对象</returns>
        public static T ToObject<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json, setting);
        }

        /// <summary>
        /// 转换为对象
        /// </summary>
        /// <param name="json">JSON字符串</param>
        /// <returns>对象</returns>
        public static object ToObject(string json)
        {
            return JsonConvert.DeserializeObject(json, setting);
        }

        /// <summary>
        /// 转换为对象
        /// </summary>
        /// <param name="json"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static object ToObject(string json, Type type)
        {
            return JsonConvert.DeserializeObject(json, type, setting);
        }
    }
}
