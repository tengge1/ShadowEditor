using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using MongoDB.Bson;
using ShadowEditor.Server.Helpers;

namespace ShadowEditor.Server.MMD
{
    /// <summary>
    /// MMD保存器
    /// </summary>
    public class MMDSaver : IMMDSaver
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

            var savePath = $"/Upload/MMD/{now.ToString("yyyyMMddHHmmss")}";
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
            var meshType = MMDType.unknown;

            var files = Directory.GetFiles(physicalPath);

            if (files.Where(o => o.ToLower().EndsWith(".pmd")).Count() > 0) // 模型文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".pmd")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MMDType.pmd;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".pmx")).Count() > 0) // 模型文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".pmx")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MMDType.pmx;
            }
            else if (files.Where(o => o.ToLower().EndsWith(".vmd")).Count() > 0) // 动画文件
            {
                entryFileName = files.Where(o => o.ToLower().EndsWith(".vmd")).FirstOrDefault();
                entryFileName = $"{savePath}/{Path.GetFileName(entryFileName)}";
                meshType = MMDType.vmd;
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
            doc["Url"] = entryFileName;

            mongo.InsertOne(Constant.MMDCollectionName, doc);

            return new Result
            {
                Code = 200,
                Msg = "上传成功！"
            };
        }
    }
}
