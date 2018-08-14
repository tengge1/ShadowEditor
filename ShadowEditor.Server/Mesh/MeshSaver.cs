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
            foreach (var i in files)
            {
                if (i.EndsWith(".amf")) // amf文件
                {
                    entryFileName = i;
                    meshType = MeshType.amf;
                    break;
                }
                else if (i.EndsWith(".json")) // binary文件
                {
                    entryFileName = i;
                    meshType = MeshType.binary;
                    break;
                }
                else if (i.EndsWith(".awd")) // awd文件
                {
                    entryFileName = i;
                    meshType = MeshType.awd;
                    break;
                }
                else if (i.EndsWith(".babylon")) // babylon文件
                {
                    entryFileName = i;
                    meshType = MeshType.babylon;
                }
                else if (i.EndsWith(".ctm")) // ctm文件
                {
                    entryFileName = i;
                    meshType = MeshType.ctm;
                }
                else if (i.EndsWith(".dae"))
                {
                    entryFileName = i;
                    meshType = MeshType.dae;
                }
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
