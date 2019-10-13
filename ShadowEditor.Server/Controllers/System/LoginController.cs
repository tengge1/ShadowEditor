using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web;
using System.IO;
using System.Web.Security;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Model.System;

namespace ShadowEditor.Server.Controllers.System
{
    /// <summary>
    /// 登录控制器
    /// </summary>
    public class LoginController : ApiBase
    {
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Login(LoginModel model)
        {
            if (model.Username == null || string.IsNullOrEmpty(model.Username))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Username is not allowed to be empty.",
                });
            }

            if (model.Password == null || string.IsNullOrEmpty(model.Password))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Password is not allowed to be empty.",
                });
            }

            // 获取Salt
            var helper = new MongoHelper();
            var filter = Builders<BsonDocument>.Filter.Eq("Username", model.Username);

            var user = helper.FindOne(Constant.UserCollectionName, filter);
            if (user == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The username or password is wrong.",
                });
            }

            var salt = user["Salt"].ToString();

            // 验证账号密码
            var password = MD5Helper.Encrypt(model.Password + salt);

            var filter1 = Builders<BsonDocument>.Filter.Eq("Password", password);
            filter = Builders<BsonDocument>.Filter.And(filter, filter1);

            user = helper.FindOne(Constant.UserCollectionName, filter);
            if (user == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The username or password is wrong.",
                });
            }

            var id = user["ID"].ToString();

            // 票据数据
            var ticketData = new LoginTicketDataModel
            {
                UserID = id,
            };

            // 将用户信息写入cookie
            var cookie = FormsAuthentication.GetAuthCookie(model.Username, false);
            var ticket = FormsAuthentication.Decrypt(cookie.Value);

            var newTicket = new FormsAuthenticationTicket(ticket.Version, ticket.Name, ticket.IssueDate, ticket.Expiration, ticket.IsPersistent, JsonConvert.SerializeObject(ticketData)); // 将用户ID写入ticket
            cookie.Value = FormsAuthentication.Encrypt(newTicket);

            HttpContext.Current.Response.Cookies.Add(cookie);

            return Json(new
            {
                Code = 200,
                Msg = "Login successfully!"
            });
        }

        /// <summary>
        /// 注销
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Logout()
        {
            HttpContext.Current.Response.Cookies.Clear();

            return Json(new
            {
                Code = 200,
                Msg = "Logout Successfully!"
            });
        }
    }
}
