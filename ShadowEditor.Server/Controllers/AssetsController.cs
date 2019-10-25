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

            long sceneCount = 0, meshCount = 0, mapCount = 0, materialCount = 0, audioCount = 0, animationCount = 0, particleCount = 0,
                prefabCount = 0, characterCount = 0, screenshotCount = 0, videoCount = 0;

            // 获取所有类别
            if (ConfigHelper.EnableAuthority)
            {
                var user = UserHelper.GetCurrentUser();

                if (user != null)
                {
                    var filter = Builders<BsonDocument>.Filter.Eq("UserID", user.ID);

                    if (user.Name == "Administrator")
                    {
                        var filter2 = Builders<BsonDocument>.Filter.Exists("UserID");
                        var filter3 = Builders<BsonDocument>.Filter.Not(filter2);
                        filter = Builders<BsonDocument>.Filter.Or(filter, filter2);

                    }
                    sceneCount = mongo.Count(Constant.SceneCollectionName, filter);
                    meshCount = mongo.Count(Constant.MeshCollectionName, filter);
                    mapCount = mongo.Count(Constant.MapCollectionName, filter);
                    materialCount = mongo.Count(Constant.MaterialCollectionName, filter);
                    audioCount = mongo.Count(Constant.AudioCollectionName, filter);
                    animationCount = mongo.Count(Constant.AnimationCollectionName, filter);
                    particleCount = mongo.Count(Constant.ParticleCollectionName, filter);
                    prefabCount = mongo.Count(Constant.PrefabCollectionName, filter);
                    characterCount = mongo.Count(Constant.CharacterCollectionName, filter);
                    screenshotCount = mongo.Count(Constant.ScreenshotCollectionName, filter);
                    videoCount = mongo.Count(Constant.VideoCollectionName, filter);
                }
            }
            else
            {
                sceneCount = mongo.Count(Constant.SceneCollectionName);
                meshCount = mongo.Count(Constant.MeshCollectionName);
                mapCount = mongo.Count(Constant.MapCollectionName);
                materialCount = mongo.Count(Constant.MaterialCollectionName);
                audioCount = mongo.Count(Constant.AudioCollectionName);
                animationCount = mongo.Count(Constant.AnimationCollectionName);
                particleCount = mongo.Count(Constant.ParticleCollectionName);
                prefabCount = mongo.Count(Constant.PrefabCollectionName);
                characterCount = mongo.Count(Constant.CharacterCollectionName);
                screenshotCount = mongo.Count(Constant.ScreenshotCollectionName);
                videoCount = mongo.Count(Constant.VideoCollectionName);
            }

            return Json(new
            {
                Code = 200,
                Msg = "Get Successfully!",
                sceneCount,
                meshCount,
                mapCount,
                materialCount,
                audioCount,
                animationCount,
                particleCount,
                prefabCount,
                characterCount,
                screenshotCount,
                videoCount,
            });
        }
    }
}
