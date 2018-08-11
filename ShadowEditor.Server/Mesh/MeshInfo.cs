﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Mesh
{
    /// <summary>
    /// 模型信息
    /// </summary>
    public class MeshInfo
    {
        /// <summary>
        /// 模型名称（改名前等同于上传文件名称）
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 模型类型
        /// </summary>
        public MeshType Type { get; set; }

        /// <summary>
        /// 客户端下载地址
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// 上传文件名称
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        /// 文件大小
        /// </summary>
        public int FileSize { get; set; }

        /// <summary>
        /// 文件类型
        /// </summary>
        public string FileType { get; set; }

        /// <summary>
        /// 保存文件名称
        /// </summary>
        public string SaveName { get; set; }

        /// <summary>
        /// 保存路径
        /// </summary>
        public string SavePath { get; set; }

        /// <summary>
        /// 上传时间
        /// </summary>
        public DateTime AddTime { get; set; }

        /// <summary>
        /// 缩略图
        /// </summary>
        public string Thumbnail { get; set; }
    }
}
