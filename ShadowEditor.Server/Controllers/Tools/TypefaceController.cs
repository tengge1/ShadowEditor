using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server.Controllers.Tools
{
    /// <summary>
    /// 字体控制器
    /// </summary>
    public class TypefaceController : ApiBase
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var dir = HttpContext.Current.Server.MapPath("~/assets/fonts/ttf");

            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            var list = Directory.GetFiles(dir);

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                Data = list
            });
        }

        /// <summary>
        /// 添加
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authority("ADMINISTRATOR")]
        public JsonResult Add()
        {
            var files = HttpContext.Current.Request.Files;

            // 校验上传文件
            if (files.Count != 1)
            {
                return Json(new Result
                {
                    Code = 300,
                    Msg = "Only one file is allowed to upload!"
                });
            }

            var file = files[0];

            if (!file.FileName.EndsWith(".ttf"))
            {
                return Json(new Result
                {
                    Code = 300,
                    Msg = "Only font file (.ttf) is allowed to upload."
                });
            }

            var dir = HttpContext.Current.Server.MapPath("~/assets/fonts/ttf");

            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            var path = $@"{dir}\{file.FileName}";

            if (File.Exists(path))
            {
                return Json(new Result
                {
                    Code = 300,
                    Msg = "The file is already existed."
                });
            }

            file.SaveAs(path);

            return Json(new Result
            {
                Code = 200,
                Msg = "Upload successfully!"
            });
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="Name"></param>
        /// <returns></returns>
        [HttpPost]
        [Authority("ADMINISTRATOR")]
        public JsonResult Delete(string Name)
        {
            var dir = HttpContext.Current.Server.MapPath("~/assets/fonts/ttf");

            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            var path = $@"{dir}\{Name}";

            if (!File.Exists(path))
            {
                return Json(new Result
                {
                    Code = 300,
                    Msg = "The asset is not existed!"
                });
            }

            File.Delete(path);

            return Json(new
            {
                Code = 200,
                Msg = "Delete successfully!"
            });
        }
    }
}
