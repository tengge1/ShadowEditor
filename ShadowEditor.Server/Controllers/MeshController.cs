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
using ShadowEditor.Server.Mesh;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 模型控制器
    /// </summary>
    public class MeshController : ApiBase
    {
        /// <summary>
        /// 获取模型列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult List()
        {
            var mongo = new MongoHelper();
            var docs = mongo.FindAll(Constant.MeshCollectionName);

            docs.Reverse();

            var data = docs.Select(o => new
            {
                ID = o["_id"].ToString(),
                Name = o["Name"].ToString(),
                TotalPinYin = o["TotalPinYin"].ToString(),
                FirstPinYin = o["FirstPinYin"].ToString(),
                Type = o["Type"].ToString(),
                Url = o["Url"].ToString(),
                Thumbnail = o.Contains("Thumbnail") && !o["Thumbnail"].IsBsonNull ? o["Thumbnail"].ToString() : null
            });

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = data
            });
        }

        /// <summary>
        /// 保存模型
        /// </summary>
        /// <returns></returns>
        public JsonResult Add()
        {
            var saver = new MeshSaver();
            var result = saver.Save(HttpContext.Current);
            return Json(result);
        }

        /// <summary>
        /// 编辑信息
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Edit(EditMeshModel model)
        {
            var objectId = ObjectId.GenerateNewId();

            if (!string.IsNullOrEmpty(model.ID) && !ObjectId.TryParse(model.ID, out objectId))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "ID不合法。"
                });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "名称不允许为空。"
                });
            }

            var mongo = new MongoHelper();

            var pinyin = PinYinHelper.GetTotalPinYin(model.Name);

            var filter = Builders<BsonDocument>.Filter.Eq("_id", objectId);
            var update1 = Builders<BsonDocument>.Update.Set("Name", model.Name);
            var update2 = Builders<BsonDocument>.Update.Set("TotalPinYin", pinyin.TotalPinYin);
            var update3 = Builders<BsonDocument>.Update.Set("FirstPinYin", pinyin.FirstPinYin);
            var update4 = Builders<BsonDocument>.Update.Set("Thumbnail", model.Image);
            var update = Builders<BsonDocument>.Update.Combine(update1, update2, update3, update4);
            mongo.UpdateOne(Constant.MeshCollectionName, filter, update);

            return Json(new
            {
                Code = 200,
                Msg = "保存成功！"
            });
        }

        /// <summary>
        /// 删除模型
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Delete(string ID)
        {
            var mongo = new MongoHelper();

            var filter = Builders<BsonDocument>.Filter.Eq("_id", BsonObjectId.Create(ID));
            var doc = mongo.FindOne(Constant.MeshCollectionName, filter);

            if (doc == null)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "该模型不存在！"
                });
            }

            // 删除模型所在目录
            var path = doc["SavePath"].ToString();
            var physicalPath = HttpContext.Current.Server.MapPath(path);

            try
            {
                Directory.Delete(physicalPath, true);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    Code = 300,
                    Msg = ex.Message
                });
            }

            // 删除模型信息
            mongo.DeleteOne(Constant.MeshCollectionName, filter);

            return Json(new
            {
                Code = 200,
                Msg = "删除模型成功！"
            });
        }
    }
}
