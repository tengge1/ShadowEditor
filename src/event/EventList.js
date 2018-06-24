/**
 * 自定义事件列表
 */
var EventList = [
    // dom事件
    'click', // 点击
    'contextmenu', // 右键
    'dblclick', // 双击
    'keydown', // 按下键盘按键
    'keyup', // 抬起键盘按键
    'mousedown', // 按下鼠标按键
    'mousemove', // 鼠标移动
    'mouseup', // 抬起鼠标按键
    'mousewheel', // 鼠标滚轮
    'resize', // 窗口大小改变
    'dragover', // 拖入dom
    'drop', // 放置到dom中

    // app事件
    'appStart', // 应用程序开始前调用
    'appStarted', // 应用程序开始后调用
    'initApp', // 引用程序初始化

    // editor事件
    'setTheme', // 设置编辑器主题
    'setScene', // 设置编辑器场景
    'addObject', // 添加物体
    'moveObject', // 移动物体
    'nameObject', // 重命名物体
    'removeObject', // 删除物体
    'addGeometry', // 添加几何体事件
    'setGeometryName', // 设置几何体名称事件
    'addMaterial', // 添加材质事件
    'setMaterialName', // 设置材质名称
    'addTexture', // 添加纹理
    'addHelper', // 添加帮助事件
    'removeHelper', // 移除脚本
    'addScript', // 添加脚本
    'removeScript', // 移除脚本
    'select', // 选中事件
    'clear', // 清空场景
    'load', // 加载场景
    'save', // 保存场景

    // signal事件
    'editScript', // 编辑脚本事件

    'startPlayer', // 启动播放器事件
    'stopPlayer', // 停止播放器事件

    'enterVR', // 进入VR事件
    'enteredVR', // 已经进入VR事件
    'exitedVR', // 已经退出VR事件

    'editorCleared', // 编辑器已经清空事件

    'savingStarted', // 开始保存事件
    'savingFinished', // 保存完成事件

    'themeChanged', // 改变主题事件

    'transformModeChanged', // 平移旋转缩放模式改变事件
    'snapChanged', // 对齐单元格事件
    'spaceChanged', // 空间坐标系改变事件
    'rendererChanged', // 渲染模式改变事件

    'sceneBackgroundChanged', // 场景背景改变事件
    'sceneFogChanged', // 场景雾效改变事件
    'sceneGraphChanged', // 场景内容改变事件

    'cameraChanged', // 相机改变事件

    'geometryChanged', // 几何体改变事件

    'objectSelected', // 物体选中改变
    'objectFocused', // 物体交点改变事件

    'objectAdded', // 添加物体事件
    'objectChanged', // 物体改变事件
    'objectRemoved', // 物体移除事件

    'helperAdded', // 添加帮助事件
    'helperRemoved', // 移除帮助事件

    'materialChanged', // 材质改变事件

    'scriptAdded', // 添加脚本事件
    'scriptChanged', // 脚本改变事件
    'scriptRemoved', // 脚本移除事件

    'windowResize', // 窗口大小改变事件

    'showGridChanged', // 网格显示隐藏改变
    'refreshSidebarObject3D', // 刷新Object3D侧边栏事件
    'historyChanged', // 历史改变事件
    'refreshScriptEditor', // 刷新脚本编辑器事件

    // menubar事件
    'mNewScene', // 新建
    'mLoadScene', // 载入
    'mSaveScene', // 保存
    'mPublishScene', // 发布

    'mUndo', // 撤销
    'mRedo', // 重做
    'mClearHistory', // 清空历史记录
    'mClone', // 复制
    'mDelete', // 删除
    'mMinifyShader', // 清除着色器

    'mAddGroup', // 添加组
    'mAddPlane', // 添加平板
    'mAddBox', // 添加正方体
    'mAddCircle', // 添加圆
    'mAddCylinder', // 添加圆柱体
    'mAddSphere', // 添加球体
    'mAddIcosahedron', // 添加二十面体
    'mAddTorus', // 添加轮胎
    'mAddTorusKnot', // 添加纽结
    'mAddTeaport', // 添加茶壶
    'mAddLathe', // 添加花瓶
    'mAddSprite', // 添加精灵
    'mAddPointLight', // 添加点光源
    'mAddSpotLight', // 添加聚光灯
    'mAddDirectionalLight', // 添加平行光源
    'mAddHemisphereLight', // 添加半球光
    'mAddAmbientLight', // 添加环境光
    'mAddPerspectiveCamera', // 添加透视相机

    'mImportAsset', // 导入资源
    'mExportGeometry', // 导出几何体
    'mExportObject', // 导出物体
    'mExportScene', // 导出场景
    'mExportOBJ', // 导出obj模型
    'mExportSTL', // 导出stl模型

    'mPlay', // 启动

    'mVRMode', // VR模式

    'mArkanoid', // 打砖块
    'mCamera', // 相机
    'mParticles', // 粒子
    'mPong', // 乒乓球

    'mSourceCode', // 源码
    'mAbout', // 关于

    // 状态栏
    'gridChange', // 状态栏网格改变事件
];

export default EventList;