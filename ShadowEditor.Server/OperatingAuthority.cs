using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShadowEditor.Server.CustomAttribute;

namespace ShadowEditor.Server
{
    /// <summary>
    /// 操作权限
    /// </summary>
    public static class OperatingAuthority
    {
        /// <summary>
        /// 管理员权限
        /// </summary>
        /// <remarks>只有管理员能操作，不应该被其他角色使用。</remarks>
        [Hidden]
        public const string ADMINISTRATOR = "Administrator";

        /// <summary>
        /// 只有登录用户才能具有的权限
        /// </summary>
        [Hidden]
        public const string LOGIN = "Login";

        /// <summary>
        /// 获取动画列表（不具备该权限无法查看动画列表）
        /// </summary>
        public const string LIST_ANIMATION = "List Animation";

        /// <summary>
        /// 添加动画
        /// </summary>
        public const string ADD_ANIMATION = "Add Animation";

        /// <summary>
        /// 编辑动画
        /// </summary>
        public const string EDIT_ANIMATION = "Edit Animation";

        /// <summary>
        /// 删除动画
        /// </summary>
        public const string DELETE_ANIMATION = "Delete Animation";

        /// <summary>
        /// 获取音频列表（不具备该权限无法查看音频列表）
        /// </summary>
        public const string LIST_AUDIO = "List Audio";

        /// <summary>
        /// 添加音频
        /// </summary>
        public const string ADD_AUDIO = "Add Audio";

        /// <summary>
        /// 编辑音频
        /// </summary>
        public const string EDIT_AUDIO = "Edit Audio";

        /// <summary>
        /// 删除音频
        /// </summary>
        public const string DELETE_AUDIO = "Delete Audio";

        /// <summary>
        /// 获取分类列表（不具有该权限无法进入分类窗口）
        /// </summary>
        public const string LIST_CATEGORY = "List Category";

        /// <summary>
        /// 保存分类
        /// </summary>
        public const string SAVE_CATEGORY = "Save Category";

        /// <summary>
        /// 删除分类
        /// </summary>
        public const string DELETE_CATEGORY = "Delete Category";

        /// <summary>
        /// 获取人物列表（不具备该权限无法进入人物列表）
        /// </summary>
        public const string LIST_CHARACTER = "List Character";

        /// <summary>
        /// 编辑人物
        /// </summary>
        public const string EDIT_CHARACTER = "Edit Character";

        /// <summary>
        /// 保存人物
        /// </summary>
        public const string SAVE_CHARACTER = "Save Character";

        /// <summary>
        /// 删除人物
        /// </summary>
        public const string DELETE_CHARACTER = "Delete Character";

        /// <summary>
        /// 获取贴图列表（不具有该权限无法查看贴图列表）
        /// </summary>
        public const string LIST_MAP = "List Map";

        /// <summary>
        /// 添加贴图
        /// </summary>
        public const string ADD_MAP = "Add Map";

        /// <summary>
        /// 编辑贴图
        /// </summary>
        public const string EDIT_MAP = "Edit Map";

        /// <summary>
        /// 删除贴图
        /// </summary>
        public const string DELETE_MAP = "Delete Map";

        /// <summary>
        /// 获取材质列表（不具有该权限无法查看材质列表）
        /// </summary>
        public const string LIST_MATERIAL = "List Material";

        /// <summary>
        /// 编辑材质
        /// </summary>
        public const string EDIT_MATERIAL = "Edit Material";

        /// <summary>
        /// 保存材质
        /// </summary>
        public const string SAVE_MATERIAL = "Save Material";

        /// <summary>
        /// 删除材质
        /// </summary>
        public const string DELETE_MATERIAL = "Delete Material";

        /// <summary>
        /// 获取模型列表（不具有该权限无法查看模型列表）
        /// </summary>
        public const string LIST_MESH = "List Mesh";

        /// <summary>
        /// 添加模型
        /// </summary>
        public const string ADD_MESH = "Add Mesh";

        /// <summary>
        /// 编辑模型
        /// </summary>
        public const string EDIT_MESH = "Edit Mesh";

        /// <summary>
        /// 删除模型
        /// </summary>
        public const string DELETE_MESH = "Delete Mesh";

        /// <summary>
        /// 获取粒子列表（不具有该权限无法查看粒子列表）
        /// </summary>
        public const string LIST_PARTICLE = "List Particle";

        /// <summary>
        /// 编辑粒子
        /// </summary>
        public const string EDIT_PARTICLE = "Edit Particle";

        /// <summary>
        /// 保存粒子
        /// </summary>
        public const string SAVE_PARTICLE = "Save Particle";

        /// <summary>
        /// 删除粒子
        /// </summary>
        public const string DELETE_PARTICLE = "Delete Particle";

        /// <summary>
        /// 获取预设体列表（不具有该权限无法查看预设体列表）
        /// </summary>
        public const string LIST_PREFAB = "List Prefab";

        /// <summary>
        /// 编辑预设体
        /// </summary>
        public const string EDIT_PREFAB = "Edit Prefab";

        /// <summary>
        /// 保存预设体
        /// </summary>
        public const string SAVE_PREFAB = "Save prefab";

        /// <summary>
        /// 删除预设体
        /// </summary>
        public const string DELETE_PREFAB = "Delete Prefab";

        /// <summary>
        /// 编辑场景
        /// </summary>
        public const string EDIT_SCENE = "Edit Scene";

        /// <summary>
        /// 保存场景
        /// </summary>
        public const string SAVE_SCENE = "Save Scene";

        /// <summary>
        /// 发布场景
        /// </summary>
        public const string PUBLISH_SCENE = "Publish Scene";

        /// <summary>
        /// 删除场景
        /// </summary>
        public const string DELETE_SCENE = "Delete Scene";

        /// <summary>
        /// 获取截图列表（不具有该权限无法查看截图列表）
        /// </summary>
        public const string LIST_SCREENSHOT = "List Screenshot";

        /// <summary>
        /// 添加截图
        /// </summary>
        public const string ADD_SCREENSHOT = "Add Screenshot";

        /// <summary>
        /// 编辑截图
        /// </summary>
        public const string EDIT_SCREENSHOT = "Edit Screenshot";

        /// <summary>
        /// 删除截图
        /// </summary>
        public const string DELETE_SCREENSHOT = "Delete Screenshot";

        /// <summary>
        /// 获取视频列表（不具有该权限无法查看视频列表）
        /// </summary>
        public const string LIST_VIDEO = "List Video";

        /// <summary>
        /// 添加视频
        /// </summary>
        public const string ADD_VIDEO = "Add Video";

        /// <summary>
        /// 编辑视频
        /// </summary>
        public const string EDIT_VIDEO = "Edit Video";

        /// <summary>
        /// 删除视频
        /// </summary>
        public const string DELETE_VIDEO = "Delete Video";
    }
}
