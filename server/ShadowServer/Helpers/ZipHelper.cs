using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using ICSharpCode.SharpZipLib;
using ICSharpCode.SharpZipLib.Zip;

namespace ShadowServer.Helpers
{
    /// <summary>
    /// Zip文件帮助类
    /// </summary>
    public class ZipHelper
    {
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
    }
}