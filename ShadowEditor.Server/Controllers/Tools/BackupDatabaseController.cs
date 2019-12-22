using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.IO;
using System.Diagnostics;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.Tools
{
    /// <summary>
    /// 备份数据库控制器
    /// </summary>
    /// <returns></returns>
    public class BackupDatabaseController : ApiBase
    {
        /// <summary>
        /// 开始执行
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authority("ADMINISTRATOR")]
        public JsonResult Run()
        {
            var mongo = new MongoHelper();

            // 获取mongodump.exe文件路径
            var path = mongo.RunCommand("{ serverStatus: 1, asserts: 0, repl: 0, metrics: 0, locks: 0 }")["process"].ToString();
            var dir = Path.GetDirectoryName(path);
            var dump = $"{dir}\\mongodump.exe";

            if (!File.Exists(dump))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "mongodump.exe is not existed."
                });
            }

            // 获取mongodb信息
            var uri = new Uri(mongo.connectionString);
            var host = uri.Host;
            var port = uri.Port;
            var dbName = mongo.dbName;
            var now = DateTime.Now;

            var backupDir = HttpContext.Current.Server.MapPath($"~/backup/database/dump{now.ToString("yyyyMMddHHmmss")}");

            if (!Directory.Exists(backupDir))
            {
                Directory.CreateDirectory(backupDir);
            }

            // 启动进程，备份数据库
            var process = Process.Start(dump, $"--host {host} --port {port} --db {dbName} --out {backupDir}");
            process.WaitForExit();

            return Json(new
            {
                Code = 200,
                Msg = "Backup database successfully!",
                Path = backupDir
            });
        }
    }
}
