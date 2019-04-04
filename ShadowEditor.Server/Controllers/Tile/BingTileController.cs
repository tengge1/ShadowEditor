using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers.Tile
{
    /// <summary>
    /// 必应瓦片控制器
    /// </summary>
    public class BingTileController : ApiBase
    {
        /// <summary>
        /// 获取必应瓦片
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="z"></param>
        [HttpPost]
        public void Get(int x, int y, int z)
        {

        }
    }
}
