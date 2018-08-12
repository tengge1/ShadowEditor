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
    /// 默认模型保存器
    /// </summary>
    /// <remarks>仅仅将上传的文件保存在Upload/Model/{yyyyMMddHHmmss}目录，并返回保存信息。</remarks>
    public class DefaultMeshSaver : IMeshSaver
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

            // 保存文件
            var now = DateTime.Now;

            var savePath = $"/Upload/Model/{now.ToString("yyyyMMddHHmmss")}";
            var physicalPath = Server.MapPath(savePath);

            if (!Directory.Exists(physicalPath))
            {
                Directory.CreateDirectory(physicalPath);
            }

            file.SaveAs($"{physicalPath}/{fileName}");

            var info = new MeshInfo
            {
                AddTime = now,
                FileName = fileName,
                FileSize = fileSize,
                FileType = fileType,
                Name = fileName,
                SaveName = fileName,
                SavePath = savePath,
                Thumbnail = "",
                Type = meshType,
                Url = $"{savePath}/{fileName}"
            };

            return info;
        }
    }
}
