using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using ICSharpCode.SharpZipLib;
using ICSharpCode.SharpZipLib.Checksum;
using ICSharpCode.SharpZipLib.Zip;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// Zip文件帮助类
    /// </summary>
    public class ZipHelper
    {
        #region 压缩文件
        /// <summary>
        /// Zip文件压缩
        /// ZipOutputStream：相当于一个压缩包；
        /// ZipEntry：相当于压缩包里的一个文件；
        /// 以上两个类是SharpZipLib的主类。
        /// </summary>
        /// <param name="sourceFileLists"></param>
        /// <param name="descFile">压缩文件保存的目录</param>
        public static void Zip(List<string> sourceFileLists, string descFile)
        {
            Crc32 crc32 = new Crc32();
            using (ZipOutputStream stream = new ZipOutputStream(File.Create(descFile)))
            {
                ZipEntry entry;
                for (int i = 0; i < sourceFileLists.Count; i++)
                {
                    entry = new ZipEntry(Path.GetFileName(sourceFileLists[i]));
                    entry.DateTime = DateTime.Now;
                    using (FileStream fs = File.OpenRead(sourceFileLists[i]))
                    {
                        byte[] buffer = new byte[fs.Length];
                        fs.Read(buffer, 0, buffer.Length);
                        entry.Size = fs.Length;
                        crc32.Reset();
                        crc32.Update(buffer);
                        entry.Crc = crc32.Value;
                        stream.PutNextEntry(entry);
                        stream.Write(buffer, 0, buffer.Length);
                    }
                    stream.CloseEntry();
                }

            }
        }
        #endregion

        #region 解压文件
        /// <summary>
        /// 解压文件
        /// </summary>
        /// <param name="zipFilePath">待解压文件路径</param>
        /// <param name="upzipDir">解压路径</param>
        /// <returns></returns>
        public static string Unzip(string zipFilePath, string upzipDir)
        {
            string rootFile = " ";

            // 读取压缩文件(zip文件),准备解压缩
            var file = File.OpenRead(zipFilePath);

            var stream = new ZipInputStream(file);

            ZipEntry theEntry;
            var path = upzipDir;

            while ((theEntry = stream.GetNextEntry()) != null)
            {
                var rootDir = Path.GetDirectoryName(theEntry.Name);

                if (rootDir.IndexOf("\\") >= 0)
                {
                    rootDir = rootDir.Substring(0, rootDir.IndexOf("\\") + 1);
                }

                var dir = Path.GetDirectoryName(theEntry.Name);
                var fileName = Path.GetFileName(theEntry.Name);

                if (dir != " ")
                {
                    if (!Directory.Exists(upzipDir + "\\" + dir))
                    {
                        path = upzipDir + "\\" + dir;
                        Directory.CreateDirectory(path);
                    }
                }
                else if (dir == " " && fileName != "")
                {
                    path = upzipDir;
                    rootFile = fileName;
                }
                else if (dir != " " && fileName != "")
                {
                    if (dir.IndexOf("\\") > 0)
                    {
                        path = upzipDir + "\\" + dir;
                    }
                }

                if (dir == rootDir)
                {
                    path = upzipDir + "\\" + rootDir;
                }

                if (fileName != String.Empty)
                {
                    FileStream streamWriter = File.Create(path + "\\" + fileName);

                    int size = 2048;
                    byte[] data = new byte[2048];
                    while (true)
                    {
                        size = stream.Read(data, 0, data.Length);
                        if (size > 0)
                        {
                            streamWriter.Write(data, 0, size);
                        }
                        else
                        {
                            break;
                        }
                    }

                    streamWriter.Close();
                }
            }

            stream.Close();
            file.Close();

            return rootFile;
        }
        #endregion
    }
}