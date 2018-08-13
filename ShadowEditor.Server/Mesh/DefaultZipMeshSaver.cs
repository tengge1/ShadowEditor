using ShadowEditor.Server.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShadowEditor.Server.Mesh
{
    /// <summary>
    /// 默认zip文件模型保存器
    /// </summary>
    public class DefaultZipMeshSaver : IMeshSaver
    {
        public MeshInfo Save(MeshType meshType = MeshType.unknown)
        {
            var Request = HttpContext.Current.Request;
            var Server = HttpContext.Current.Server;

            // 文件信息
            var file = Request.Files[0];
            var fileName = file.FileName;
            var fileSize = file.ContentLength;
            var fileType = file.ContentType;
            var fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

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

            // 查找模型目录中的json文件
            var jsonFileName = fileName.Replace(".zip", ".json");
            var files = Directory.GetFiles(physicalPath, "*.json");
            foreach (var i in files)
            {
                if (i.EndsWith(".json"))
                {
                    jsonFileName = Path.GetFileName(i);
                    break;
                }
            }

            var pinyin = PinYinHelper.GetTotalPinYin(fileNameWithoutExt);

            var info = new MeshInfo
            {
                AddTime = now,
                FileName = fileName,
                FileSize = fileSize,
                FileType = fileType,
                FirstPinYin = string.Join("", pinyin.FirstPinYin),
                Name = fileNameWithoutExt,
                SaveName = fileName,
                SavePath = savePath,
                Thumbnail = "",
                TotalPinYin = string.Join("", pinyin.TotalPinYin),
                Type = meshType,
                Url = savePath + "/" + jsonFileName
            };

            return info;
        }
    }
}
