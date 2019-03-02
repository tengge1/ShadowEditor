using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// 目录帮助类
    /// </summary>
    public class DirectoryHelper
    {
        /// <summary>
        /// 复制文件夹及内容
        /// </summary>
        /// <see cref="https://www.cnblogs.com/zhaoyongjiang/p/8016938.html"/>
        /// <param name="sourceDirName"></param>
        /// <param name="destDirName"></param>
        public static void Copy(string sourceDirName, string destDirName)
        {
            // 检查目标目录是否以目录分割字符结束如果不是则添加
            if (!destDirName.EndsWith(Path.DirectorySeparatorChar.ToString()))
            {
                destDirName += Path.DirectorySeparatorChar;
            }
            // 判断目标目录是否存在如果不存在则新建
            if (!Directory.Exists(destDirName))
            {
                Directory.CreateDirectory(destDirName);
            }
            // 得到源目录的文件列表，该里面是包含文件以及目录路径的一个数组
            // 如果你指向copy目标文件下面的文件而不包含目录请使用下面的方法
            // string[] fileList = Directory.GetFiles（srcPath）；
            var fileList = Directory.GetFileSystemEntries(sourceDirName);

            // 遍历所有的文件和目录
            foreach (var file in fileList)
            {
                // 先当作目录处理如果存在这个目录就递归Copy该目录下面的文件
                if (Directory.Exists(file))
                {
                    Copy(file, destDirName + Path.GetFileName(file));
                }
                else // 否则直接Copy文件
                {
                    File.Copy(file, destDirName + Path.GetFileName(file), true);
                }
            }
        }

        /// <summary>
        /// 移除某个路径下的空文件夹
        /// </summary>
        /// <param name="path"></param>
        public static void RemoveEmptyDir(string path)
        {
            if (!Directory.Exists(path))
            {
                return;
            }

            var directories = Directory.GetDirectories(path);
            var files = Directory.GetFiles(path);

            if (directories.Length + files.Length == 0)
            {
                Directory.Delete(path);
                return;
            }

            foreach (var i in directories)
            {
                RemoveEmptyDir(i);
            }
        }
    }
}