using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using MongoDB.Bson;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.Mesh
{
    /// <summary>
    /// 模型保存器
    /// </summary>
    public class MeshSaver : IMeshSaver
    {
        public Result Save(HttpContext context)
        {
            var Request = context.Request;
            var Server = context.Server;

            // 文件信息
            var file = Request.Files[0];
            var fileName = file.FileName;
            var fileSize = file.ContentLength;
            var fileType = file.ContentType;
            var fileExt = Path.GetExtension(fileName);
            var fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

            if (fileExt == null || fileExt.ToLower() != ".zip")
            {
                return new Result
                {
                    Code = 300,
                    Msg = "只允许上传zip格式文件！"
                };
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

            if (files.Where(o => o.ToLower().EndsWith(".amf")).Count() > 0) // amf文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".amf")).FirstOrDefault();
                meshType = MeshType.amf;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".json")).Count() > 0) // binary文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".json")).FirstOrDefault();
                meshType = MeshType.binary;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".awd")).Count() > 0) // awd文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".awd")).FirstOrDefault();
                meshType = MeshType.awd;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".babylon")).Count() > 0) // babylon文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".babylon")).FirstOrDefault();
                meshType = MeshType.babylon;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".ctm")).Count() > 0) // ctm文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".ctm")).FirstOrDefault();
                meshType = MeshType.ctm;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".dae")).Count() > 0) // dae文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".dae")).FirstOrDefault();
                meshType = MeshType.dae;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".fbx")).Count() > 0) // fbx文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".fbx")).FirstOrDefault();
                meshType = MeshType.fbx;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".glb")).Count() > 0) // glb文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".glb")).FirstOrDefault();
                meshType = MeshType.glb;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".gltf")).Count() > 0) // gltf文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".gltf")).FirstOrDefault();
                meshType = MeshType.gltf;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".kmz")).Count() > 0) // kmz文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".kmz")).FirstOrDefault();
                meshType = MeshType.kmz;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".md2")).Count() > 0) // md2文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".md2")).FirstOrDefault();
                meshType = MeshType.md2;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".obj")).Count() > 0) // obj文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".obj")).FirstOrDefault();
                meshType = MeshType.obj;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".ply")).Count() > 0) // ply文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".ply")).FirstOrDefault();
                meshType = MeshType.ply;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".stl")).Count() > 0) // stl文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".stl")).FirstOrDefault();
                meshType = MeshType.stl;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".vtk")).Count() > 0) // vtk文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".vtk")).FirstOrDefault();
                meshType = MeshType.vtk;
            }

            if (entryFileName == null || meshType == MeshType.unknown)
            {
                Directory.Delete(physicalPath, true);

                return new Result
                {
                    Code = 300,
                    Msg = "未知文件类型！"
                };
            }

            var pinyin = PinYinHelper.GetTotalPinYin(fileNameWithoutExt);

            // 保存到Mongo
            var mongo = new MongoHelper();

            var doc = new BsonDocument();
            doc["AddTime"] = BsonDateTime.Create(now);
            doc["FileName"] = fileName;
            doc["FileSize"] = fileSize;
            doc["FileType"] = fileType;
            doc["FirstPinYin"] = string.Join("", pinyin.FirstPinYin);
            doc["Name"] = fileNameWithoutExt;
            doc["SaveName"] = fileName;
            doc["SavePath"] = savePath;
            doc["Thumbnail"] = "";
            doc["TotalPinYin"] = string.Join("", pinyin.TotalPinYin);
            doc["Type"] = meshType.ToString();
            doc["Url"] = $"{savePath}/{Path.GetFileName(entryFileName)}";

            mongo.InsertOne(Constant.MeshCollectionName, doc);

            return new Result
            {
                Code = 200,
                Msg = "上传成功！"
            };
        }
    }
}
