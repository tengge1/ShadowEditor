using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using ShadowEditor.Server.Base;

namespace ShadowEditor.Server.Controllers.Tile
{
    /// <summary>
    /// 必应瓦片控制器
    /// </summary>
    public class BingTileController : ApiBase
    {
        private static readonly string rootPath;

        static BingTileController()
        {
            rootPath = HttpContext.Current.Server.MapPath("~/Upload/Tiles/Bing");
        }

        /// <summary>
        /// 获取必应瓦片
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="z"></param>
        /// <returns></returns>
        [HttpGet]
        public HttpResponseMessage Get(int x, int y, int z)
        {
            var path = $"{rootPath}\\{z}\\{y}\\{x}.jpg";

            if (!File.Exists(path))
            {
                DownloadTile(x, y, z, path);
            }

            var bytes = File.ReadAllBytes(path);

            var msg = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new ByteArrayContent(bytes)
            };

            msg.Headers.CacheControl = new CacheControlHeaderValue { Public = true };
            msg.Content.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

            return msg;
        }

        /// <summary>
        /// 下载底图
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="z"></param>
        /// <param name="savePath"></param>
        private void DownloadTile(int x, int y, int z, string savePath)
        {
            var dir = Path.GetDirectoryName(savePath);

            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            var quadKey = TileXYToQuadKey(x, y, z);
            var url = $"http://t0.ssl.ak.tiles.virtualearth.net/tiles/a{quadKey}.jpeg?g=5793";

            var request = (HttpWebRequest)HttpWebRequest.Create(url);
            request.Referer = "https://cn.bing.com/maps";
            request.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36";
            var response = (HttpWebResponse)request.GetResponse();
            var stream = response.GetResponseStream();

            var file = new FileStream(savePath, FileMode.Create, FileAccess.Write);

            var buffer = new byte[1000];
            var bytesRead = 0;

            while ((bytesRead = stream.Read(buffer, 0, 1000)) > 0)
            {
                file.Write(buffer, 0, bytesRead);
            }

            file.Close();

            stream.Close();
        }

        /// <summary>
        /// TileXY转QuadKey
        /// </summary>
        /// <param name="tileX"></param>
        /// <param name="tileY"></param>
        /// <param name="levelOfDetail"></param>
        /// <returns></returns>
        /// <see cref="https://docs.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system"/>
        private string TileXYToQuadKey(int tileX, int tileY, int levelOfDetail)
        {
            var quadKey = new StringBuilder();
            char digit;
            int mask;

            for (var i = levelOfDetail; i > 0; i--)
            {
                digit = '0';
                mask = 1 << (i - 1);
                if ((tileX & mask) != 0)
                {
                    digit++;
                }
                if ((tileY & mask) != 0)
                {
                    digit++;
                    digit++;
                }
                quadKey.Append(digit);
            }
            return quadKey.ToString();
        }
    }
}
