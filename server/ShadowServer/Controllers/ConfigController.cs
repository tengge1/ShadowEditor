using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using ShadowServer.Base;
using ShadowServer.Helpers;

namespace ShadowServer.Controllers
{
    public class ConfigController : ApiBase
    {
        [HttpGet]
        public JsonResult List(string name = "Shadow Server")
        {
            return Json(JsonHelper.ToJson(new
            {
                Code = 200,
                Msg = "Hello, world!"
            }));
        }
    }
}
