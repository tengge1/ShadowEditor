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
using ShadowEditor.Model.Mesh;
using ShadowEditor.Server.Base;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Controllers
{
    /// <summary>
    /// 网格控制器
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

            // 获取所有类别
            var filter = Builders<BsonDocument>.Filter.Eq("Type", "Mesh");
            var categories = mongo.FindMany(Constant.CategoryCollectionName, filter).ToList();

            var meshes = mongo.FindAll(Constant.MeshCollectionName).SortBy(n => n["Name"]).ToList();

            var list = new List<MeshModel>();

            foreach (var i in meshes)
            {
                var categoryID = "";
                var categoryName = "";

                if (i.Contains("Category") && !i["Category"].IsBsonNull && !string.IsNullOrEmpty(i["Category"].ToString()))
                {
                    var doc = categories.Where(n => n["_id"].ToString() == i["Category"].ToString()).FirstOrDefault();
                    if (doc != null)
                    {
                        categoryID = doc["_id"].ToString();
                        categoryName = doc["Name"].ToString();
                    }
                }

                var info = new MeshModel
                {
                    ID = i["_id"].ToString(),
                    Name = i["Name"].ToString(),
                    CategoryID = categoryID,
                    CategoryName = categoryName,
                    TotalPinYin = i["TotalPinYin"].ToString(),
                    FirstPinYin = i["FirstPinYin"].ToString(),
                    Type = i["Type"].ToString(),
                    Url = i["Url"].ToString(),
                    Thumbnail = i.Contains("Thumbnail") && !i["Thumbnail"].IsBsonNull ? i["Thumbnail"].ToString() : null
                };

                list.Add(info);
            }

            return Json(new
            {
                Code = 200,
                Msg = "获取成功！",
                Data = list
            });
        }

        /// <summary>
        /// 保存模型
        /// </summary>
        /// <returns></returns>
        public JsonResult Add()
        {
            var Request = HttpContext.Current.Request;
            var Server = HttpContext.Current.Server;

            // 文件信息
            var file = Request.Files[0];
            var fileName = file.FileName;
            var fileSize = file.ContentLength;
            var fileType = file.ContentType;
            var fileExt = Path.GetExtension(fileName);
            var fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

            if (fileExt == null || fileExt.ToLower() != ".zip")
            {
                return Json(new
                {
                    Code = 300,
                    Msg = "只允许上传zip格式文件！"
                });
            }

            // 保存文件
            var now = DateTime.Now;

            var savePath = $"/Upload/Model/{now.ToString("yyyyMMddHHmmss")}";
            var physicalPath = Server.MapPath(savePath);

            var tempPath = physicalPath + "\\temp"; // zip压缩文件临时保存目录

            if (!Directory.Exists(tempPath))
            {
                Directory.CreateDirectory(tempPath);
            }

            file.SaveAs($"{tempPath}\\{fileName}");

            // 解压文件
            ZipHelper.Unzip($"{tempPath}\\{fileName}", physicalPath);

            // 删除临时目录
            Directory.Delete(tempPath, true);

            // 判断文件类型
            string entryFileName = null;
            var meshType = MeshType.unknown;

            var files = Directory.GetFiles(physicalPath);

            if (files.Where(o => o.ToLower().EndsWith(".3ds")).Count() > 0) // 3ds文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".3ds")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType._3ds;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".3mf")).Count() > 0) // 3mf文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".3mf")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType._3mf;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".amf")).Count() > 0) // amf文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".amf")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.amf;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".assimp")).Count() > 0) // assimp文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".assimp")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.assimp;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".json")).Count() > 0 && files.Where(o => o.ToLower().EndsWith(".bin")).Count() > 0) // binary文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".json")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.binary;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".json")).Count() > 0) // json文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".json")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.json;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".js")).Count() > 0) // Skinned json文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".js")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.js;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".awd")).Count() > 0) // awd文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".awd")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.awd;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".babylon")).Count() > 0) // babylon文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".babylon")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.babylon;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".bvh")).Count() > 0) // bvh文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".bvh")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.bvh;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".ctm")).Count() > 0) // ctm文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".ctm")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.ctm;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".dae")).Count() > 0) // dae文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".dae")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.dae;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".drc")).Count() > 0) // drc文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".drc")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.drc;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".fbx")).Count() > 0) // fbx文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".fbx")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.fbx;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".gcode")).Count() > 0) // gcode文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".gcode")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.gcode;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".glb")).Count() > 0) // glb文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".glb")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.glb;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".gltf")).Count() > 0) // gltf文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".gltf")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.gltf;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".kmz")).Count() > 0) // kmz文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".kmz")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.kmz;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".md2")).Count() > 0) // md2文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".md2")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.md2;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".nrrd")).Count() > 0) // nrrd文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".nrrd")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.nrrd;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".obj")).Count() > 0) // obj文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".obj")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.obj;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".pcd")).Count() > 0) // pcd文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".pcd")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.pcd;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".pdb")).Count() > 0) // pdb文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".pdb")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.pdb;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".ply")).Count() > 0) // ply文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".ply")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.ply;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".pmd")).Count() > 0) // pmd文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".pmd")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.pmd;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".pmx")).Count() > 0) // pmd文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".pmx")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.pmx;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".prwm")).Count() > 0) // prwm文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".prwm")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.prwm;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".sea")).Count() > 0) // sea3d文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".sea")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.sea3d;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".stl")).Count() > 0) // stl文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".stl")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.stl;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".vrm")).Count() > 0) // vrm文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".vrm")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.vrm;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".wrl")).Count() > 0) // vrml文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".wrl")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.vrml;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".vtk")).Count() > 0) // vtk文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".vtk")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.vtk;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".lmesh")).Count() > 0) // lol文件
            {
                if (files.Where(o => o.ToLower().EndsWith(".lanim")).Count() == -1)
                {
                    Directory.Delete(physicalPath, true);

                    return Json(new
                    {
                        Code = 300,
                        Msg = "未上传动画(.lanim)文件！"
                    });
                }

                if (files.Where(o => o.ToLower().EndsWith(".png")).Count() == -1)
                {
                    Directory.Delete(physicalPath, true);

                    return Json(new
                    {
                        Code = 300,
                        Msg = "未上传贴图(.png)文件！"
                    });
                }

                var lmeshName = files.Where(o => o.ToLower().EndsWith(".lmesh")).FirstOrDefault();
                var lanimName = files.Where(o => o.ToLower().EndsWith(".lanim")).FirstOrDefault();
                var ltextureName = files.Where(o => o.ToLower().EndsWith(".png")).FirstOrDefault();

                lmeshName = $"{savePath}/{Path.GetFileName(lmeshName)}";
                lanimName = $"{savePath}/{Path.GetFileName(lanimName)}";
                ltextureName = $"{savePath}/{Path.GetFileName(ltextureName)}";

                entryFileName = $"{lmeshName};{lanimName};{ltextureName}";

                meshType = MeshType.lol;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".x")).Count() > 0) // x文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".x")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MeshType.x;
            }

            if (entryFileName == null || meshType == MeshType.unknown)
            {
                Directory.Delete(physicalPath, true);

                return Json(new
                {
                    Code = 300,
                    Msg = "未知文件类型！"
                });
            }

            var pinyin = PinYinHelper.GetTotalPinYin(fileNameWithoutExt);

            // 保存到Mongo
            var mongo = new MongoHelper();

            var doc = new BsonDocument
            {
                ["AddTime"] = BsonDateTime.Create(now),
                ["FileName"] = fileName,
                ["FileSize"] = fileSize,
                ["FileType"] = fileType,
                ["FirstPinYin"] = string.Join("", pinyin.FirstPinYin),
                ["Name"] = fileNameWithoutExt,
                ["SaveName"] = fileName,
                ["SavePath"] = savePath,
                ["Thumbnail"] = "",
                ["TotalPinYin"] = string.Join("", pinyin.TotalPinYin),
                ["Type"] = meshType.ToString(),
                ["Url"] = entryFileName
            };

            mongo.InsertOne(Constant.MeshCollectionName, doc);

            return Json(new
            {
                Code = 200,
                Msg = "上传成功！"
            });
        }

        /// <summary>
        /// 编辑信息
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Edit(MeshEditModel model)
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

            UpdateDefinition<BsonDocument> update5;

            if (string.IsNullOrEmpty(model.Category))
            {
                update5 = Builders<BsonDocument>.Update.Unset("Category");
            }
            else
            {
                update5 = Builders<BsonDocument>.Update.Set("Category", model.Category);
            }

            var update = Builders<BsonDocument>.Update.Combine(update1, update2, update3, update4, update5);
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
                    Msg = "该资源不存在！"
                });
            }

            // TODO：为避免误删等严重后果，暂时不删除文件
            // 删除模型所在目录
            //var path = doc["SavePath"].ToString();
            //var physicalPath = HttpContext.Current.Server.MapPath(path);

            //try
            //{
            //    Directory.Delete(physicalPath, true);
            //}
            //catch (Exception ex)
            //{
            //    return Json(new
            //    {
            //        Code = 300,
            //        Msg = ex.Message
            //    });
            //}

            // 删除模型信息
            mongo.DeleteOne(Constant.MeshCollectionName, filter);

            return Json(new
            {
                Code = 200,
                Msg = "删除成功！"
            });
        }
    }
}
