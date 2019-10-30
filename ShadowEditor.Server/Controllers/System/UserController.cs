using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web;
using System.IO;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Model.System;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.System
{
    /// <summary>
    /// 用户控制器
    /// </summary>
    public class UserController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="pageSize"></param>
        /// <param name="pageNum"></param>
        /// <param name="keyword"></param>
        /// <returns></returns>
        [HttpGet]
        [Authority(OperatingAuthority.LIST_USER)]
        public JsonResult List(int pageSize = 20, int pageNum = 1, string keyword = "")
        {
            var mongo = new MongoHelper();

            // 获取所有角色
            var roleDocs = mongo.FindAll(Constant.RoleCollectionName).ToList();

            var roles = new List<RoleModel>();

            foreach (var doc in roleDocs)
            {
                roles.Add(new RoleModel
                {
                    ID = doc["ID"].ToString(),
                    Name = doc["Name"].ToString(),
                    CreateTime = doc["CreateTime"].ToLocalTime(),
                    UpdateTime = doc["UpdateTime"].ToLocalTime(),
                    Description = doc.Contains("Description") ? doc["Description"].ToString() : "",
                    Status = doc["Status"].ToInt32(),
                });
            }

            // 获取所有机构
            var deptDocs = mongo.FindAll(Constant.DepartmentCollectionName).ToList();

            var depts = new List<DepartmentModel>();

            foreach (var doc in deptDocs)
            {
                depts.Add(new DepartmentModel
                {
                    ID = doc["ID"].ToString(),
                    ParentID = doc["ParentID"].ToString(),
                    Name = doc["Name"].ToString(),
                    Status = doc["Status"].ToInt32()
                });
            }

            // 获取用户
            var filter = Builders<BsonDocument>.Filter.Ne("Status", -1);

            if (!string.IsNullOrEmpty(keyword))
            {
                var filter1 = Builders<BsonDocument>.Filter.Regex("Name", keyword);
                filter = Builders<BsonDocument>.Filter.And(filter, filter1);
            }

            var sort = Builders<BsonDocument>.Sort.Descending("_id");

            var total = mongo.Count(Constant.UserCollectionName, filter);
            var docs = mongo.FindMany(Constant.UserCollectionName, filter)
                .Sort(sort)
                .Skip(pageSize * (pageNum - 1))
                .Limit(pageSize)
                .ToList();

            var rows = new List<UserModel>();

            foreach (var doc in docs)
            {
                var roleID = doc.Contains("RoleID") ? doc["RoleID"].ToString() : "";
                var roleName = "";

                var role = roles.Where(n => n.ID == roleID).FirstOrDefault();
                if (role != null)
                {
                    roleName = role.Name;
                }

                var deptID = doc.Contains("DeptID") ? doc["DeptID"].ToString() : "";
                var deptName = "";

                var dept = depts.Where(n => n.ID == deptID).FirstOrDefault();
                if (dept != null)
                {
                    deptName = dept.Name;
                }

                rows.Add(new UserModel
                {
                    ID = doc["ID"].ToString(),
                    Username = doc["Username"].ToString(),
                    Password = "",
                    Name = doc["Name"].ToString(),
                    RoleID = roleID,
                    RoleName = roleName,
                    DeptID = deptID,
                    DeptName = deptName,
                    Gender = doc["Gender"].ToInt32(),
                    Phone = doc["Phone"].ToString(),
                    Email = doc["Email"].ToString(),
                    QQ = doc["QQ"].ToString(),
                    CreateTime = doc["CreateTime"].ToLocalTime(),
                    UpdateTime = doc["UpdateTime"].ToLocalTime(),
                    Status = doc["Status"].ToInt32(),
                });
            }

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                Data = new
                {
                    total,
                    rows,
                },
            });
        }

        /// <summary>
        /// 添加
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.ADD_USER)]
        public JsonResult Add(UserEditModel model)
        {
            if (string.IsNullOrEmpty(model.Username))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Username is not allowed to be empty.",
                });
            }

            if (string.IsNullOrEmpty(model.Password))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Password is not allowed to be empty.",
                });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Name is not allowed to be empty."
                });
            }

            if (string.IsNullOrEmpty(model.RoleID))
            {
                model.RoleID = "";
            }

            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("Username", model.Username);

            var count = mongo.Count(Constant.UserCollectionName, filter);

            if (count > 0)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The username is already existed.",
                });
            }

            var now = DateTime.Now;

            var salt = DateTime.Now.ToString("yyyyMMddHHmmss");

            var doc = new BsonDocument
            {
                ["ID"] = ObjectId.GenerateNewId(),
                ["Username"] = model.Username,
                ["Password"] = MD5Helper.Encrypt(model.Password + salt),
                ["Name"] = model.Name,
                ["RoleID"] = model.RoleID,
                ["DeptID"] = model.DeptID,
                ["Gender"] = 0,
                ["Phone"] = "",
                ["Email"] = "",
                ["QQ"] = "",
                ["CreateTime"] = now,
                ["UpdateTime"] = now,
                ["Salt"] = salt,
                ["Status"] = 0,
            };

            mongo.InsertOne(Constant.UserCollectionName, doc);

            return Json(new
            {
                Code = 200,
                Msg = "Saved successfully!"
            });
        }

        /// <summary>
        /// 编辑
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.EDIT_USER)]
        public JsonResult Edit(UserEditModel model)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(model.ID) && !ObjectId.TryParse(model.ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "ID is not allowed."
                });
            }

            if (string.IsNullOrEmpty(model.Username))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Username is not allowed to be empty.",
                });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Name is not allowed to be empty."
                });
            }

            if (string.IsNullOrEmpty(model.RoleID))
            {
                model.RoleID = "";
            }

            var mongo = new MongoHelper();

            // 判断是否是系统内置用户
            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.UserCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The user is not existed."
                });
            }

            var userName = doc["Username"].ToString();

            if (userName == "admin")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Modifying system built-in users is not allowed."
                });
            }

            // 判断用户名是否重复
            var filter1 = Builders<BsonDocument>.Filter.Ne("ID", objectId);
            var filter2 = Builders<BsonDocument>.Filter.Eq("Username", model.Username);
            filter = Builders<BsonDocument>.Filter.And(filter1, filter2);

            var count = mongo.Count(Constant.UserCollectionName, filter);

            if (count > 0)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The username is already existed.",
                });
            }

            filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);

            var update1 = Builders<BsonDocument>.Update.Set("Username", model.Username);
            var update2 = Builders<BsonDocument>.Update.Set("Name", model.Name);
            var update3 = Builders<BsonDocument>.Update.Set("RoleID", model.RoleID);
            var update4 = Builders<BsonDocument>.Update.Set("DeptID", model.DeptID);
            var update5 = Builders<BsonDocument>.Update.Set("UpdateTime", DateTime.Now);

            var update = Builders<BsonDocument>.Update.Combine(update1, update2, update3, update4, update5);

            mongo.UpdateOne(Constant.UserCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Saved successfully!"
            });
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority(OperatingAuthority.DELETE_USER)]
        public JsonResult Delete(string ID)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(ID) && !ObjectId.TryParse(ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "ID is not allowed."
                });
            }

            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", objectId);
            var doc = mongo.FindOne(Constant.UserCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The user is not existed."
                });
            }

            var userName = doc["Username"].ToString();

            if (userName == "admin")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "It is not allowed to delete system built-in users."
                });
            }

            var update = Builders<BsonDocument>.Update.Set("Status", -1);

            mongo.UpdateOne(Constant.UserCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }

        /// <summary>
        /// 修改密码
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult ChangePassword(ChangePasswordModel model)
        {
            var user = UserHelper.GetCurrentUser();

            if (user == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The user is not existed."
                });
            }

            // 验证密码是否为空
            if (model.OldPassword == null || model.OldPassword.Trim() == "")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Old password is not allowed to be empty."
                });
            }

            if (model.NewPassword == null || model.NewPassword.Trim() == "")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "New password is not allowed to be empty."
                });
            }

            if (model.ConfirmPassword == null || model.ConfirmPassword.Trim() == "")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Confirm password is not allowed to be empty."
                });
            }

            if (model.NewPassword != model.ConfirmPassword)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "New password and confirm password is not the same."
                });
            }

            // 验证旧密码
            var oldPassword = MD5Helper.Encrypt(model.OldPassword + user.Salt);

            if (oldPassword != user.Password)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Old password is not correct."
                });
            }

            // 修改密码
            var salt = DateTime.Now.ToString("yyyyMMddHHmmss");
            var password = MD5Helper.Encrypt(model.NewPassword + salt);

            var filter = Builders<BsonDocument>.Filter.Eq("ID", ObjectId.Parse(user.ID));
            var update1 = Builders<BsonDocument>.Update.Set("Password", password);
            var update2 = Builders<BsonDocument>.Update.Set("Salt", salt);
            var update = Builders<BsonDocument>.Update.Combine(update1, update2);

            var mongo = new MongoHelper();
            mongo.UpdateOne(Constant.UserCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Password changed successfully!"
            });
        }

        /// <summary>
        /// 重置密码
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult ResetPassword(ResetPasswordModel model)
        {
            ObjectId userID;

            if (!ObjectId.TryParse(model.UserID, out userID))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "ID is not allowed."
                });
            }

            if (model.NewPassword == null || model.NewPassword.Trim() == "")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "New password is not allowed to be empty."
                });
            }

            if (model.ConfirmPassword == null || model.ConfirmPassword.Trim() == "")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "Confirm password is not allowed to be empty."
                });
            }

            if (model.NewPassword != model.ConfirmPassword)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "New password and confirm password is not the same."
                });
            }

            // 判断用户是否存在
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("ID", userID);
            var doc = mongo.FindOne(Constant.UserCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "The user is not existed."
                });
            }

            // 修改密码
            var salt = DateTime.Now.ToString("yyyyMMddHHmmss");
            var password = MD5Helper.Encrypt(model.NewPassword + salt);

            var update1 = Builders<BsonDocument>.Update.Set("Password", password);
            var update2 = Builders<BsonDocument>.Update.Set("Salt", salt);
            var update = Builders<BsonDocument>.Update.Combine(update1, update2);

            mongo.UpdateOne(Constant.UserCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "Password reset successfully."
            });
        }
    }
}
