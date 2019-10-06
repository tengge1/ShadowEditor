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
        /// 获取动画列表
        /// </summary>
        [Sort(0)]
        public const string LIST_ANIMATION = "List Animation";

        /// <summary>
        /// 添加动画
        /// </summary>
        [Sort(1)]
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
        /// 获取音频列表
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
        /// 获取分类列表
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
        /// 获取人物列表
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
        /// 获取贴图列表
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
        public const string DELETE_MAP = "Edit Map";

        /// <summary>
        /// 获取材质列表
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
        /// 获取模型列表
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
        /// 获取粒子列表
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
        /// 获取预设体列表
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
        /// 获取场景列表
        /// </summary>
        public const string LIST_SCENE = "List Scene";

        /// <summary>
        /// 编辑场景
        /// </summary>
        public const string EDIT_SCENE = "Edit Scene";

        /// <summary>
        /// 保存场景
        /// </summary>
        public const string SAVE_SCENE = "Save Scene";

        /// <summary>
        /// 删除场景
        /// </summary>
        public const string DELETE_SCENE = "Delete Scene";

        /// <summary>
        /// 获取截图列表
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
        /// 上传缩略图
        /// </summary>
        public const string UPLOAD_THUMBNAIL = "Upload Thumbnail";

        /// <summary>
        /// 获取视频列表
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

        /// <summary>
        /// 导出编辑器
        /// </summary>
        public const string EXPORT_EDITOR = "Export Editor";

        /// <summary>
        /// 导出示例
        /// </summary>
        public const string EXPORT_EXAMPLES = "Export Examples";

        /// <summary>
        /// 导出场景
        /// </summary>
        public const string EXPORT_SCENE = "Export Scene";

        /// <summary>
        /// 获取操作权限列表
        /// </summary>
        public const string LIST_OPERATING_AUTHORITY = "List Operating Authority";

        /// <summary>
        /// 保存操作权限列表
        /// </summary>
        public const string SAVE_OPERATING_AUTHORITY = "Save Operating Authority";

        /// <summary>
        /// 获取角色列表
        /// </summary>
        public const string LIST_ROLE = "List Role";

        /// <summary>
        /// 添加角色
        /// </summary>
        public const string ADD_ROLE = "Add Role";

        /// <summary>
        /// 编辑角色
        /// </summary>
        public const string EDIT_ROLE = "Edit Role";

        /// <summary>
        /// 删除角色
        /// </summary>
        public const string DELETE_ROLE = "Delete Role";

        /// <summary>
        /// 获取用户列表
        /// </summary>
        public const string LIST_USER = "List User";

        /// <summary>
        /// 添加用户
        /// </summary>
        public const string ADD_USER = "Add User";

        /// <summary>
        /// 编辑用户
        /// </summary>
        public const string EDIT_USER = "Edit User";

        /// <summary>
        /// 删除用户
        /// </summary>
        public const string DELETE_USER = "Delete User";

        /// <summary>
        /// 整理贴图
        /// </summary>
        public const string ARRANGE_MAP = "Arrange Map";

        /// <summary>
        /// 整理模型
        /// </summary>
        public const string ARRANGE_MESH = "Arrange Mesh";

        /// <summary>
        /// 整理缩略图
        /// </summary>
        public const string ARRANGE_THUMBNAIL = "Arrange Thumbnail";

        /// <summary>
        /// 清理场景
        /// </summary>
        public const string CLEAN_UP_SCENES = "Clean Up Scenes";
    }
}
