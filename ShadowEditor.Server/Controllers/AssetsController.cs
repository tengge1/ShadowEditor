using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using ShadowEditor.Model.Scene;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// (所有)资源控制器
    /// </summary>
    public class AssetsController : ApiBase
    {
        /// <summary>
        /// 获取信息列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();

            // 获取所有类别
            var sceneCount = mongo.Count(Constant.SceneCollectionName);
            var meshCount = mongo.Count(Constant.MeshCollectionName);
            var mapCount = mongo.Count(Constant.MapCollectionName);
            var materialCount = mongo.Count(Constant.MaterialCollectionName);
            var audioCount = mongo.Count(Constant.AudioCollectionName);
            var animationCount = mongo.Count(Constant.AnimationCollectionName);
            var particleCount = mongo.Count(Constant.ParticleCollectionName);
            var prefabCount = mongo.Count(Constant.PrefabCollectionName);
            var characterCount = mongo.Count(Constant.CharacterCollectionName);

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                sceneCount,
                meshCount,
                mapCount,
                materialCount,
                audioCount,
                animationCount,
                particleCount,
                prefabCount,
                characterCount
            });
        }
    }
}
