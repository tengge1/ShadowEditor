using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.IO;
using System.Net;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// Http帮助类
    /// </summary>
    public class HttpHelper
    {
        /// <summary>
        /// Get请求
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string Get(string url)
        {
            var request = WebRequest.Create(url) as HttpWebRequest;
            request.Method = "GET";
            request.ContentType = "text/html;charset=UTF-8";

            var response = request.GetResponse() as HttpWebResponse;
            var stream = response.GetResponseStream();
            var reader = new StreamReader(stream, Encoding.UTF8);
            string result = reader.ReadToEnd();
            reader.Close();
            stream.Close();
            return result;
        }

        /// <summary>
        /// Post请求
        /// </summary>
        /// <param name="url"></param>
        /// <param name="postData"></param>
        /// <returns></returns>
        public static string Post(string url, string postData)
        {
            var data = Encoding.UTF8.GetBytes(postData);

            var request = WebRequest.Create(url) as HttpWebRequest;
            request.CookieContainer = new CookieContainer();
            request.AllowAutoRedirect = true;
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;

            var stream = request.GetRequestStream();
            stream.Write(data, 0, data.Length);
            stream.Close();

            var response = request.GetResponse() as HttpWebResponse;
            stream = response.GetResponseStream();
            var reader = new StreamReader(stream, Encoding.UTF8);
            var result = reader.ReadToEnd();
            reader.Close();
            stream.Close();

            return result;
        }
    }
}