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

    // app事件
    'appStart', // 应用程序开始前调用
    'appStarted', // 应用程序开始后调用
    'initApp', // 引用程序初始化
    'appStop', // 程序开始结束前调用
    'appStoped', // 程序结束后调用

    // 菜单栏事件
    'mNewScene', // 新建
    'mLoadScene', // 载入
    'mSaveScene', // 保存
    'mSaveSceneAs', // 另存为
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
    'mAddRectAreaLight', // 添加矩形光
    'mAddText', // 添加文本
    'mAddPerspectiveCamera', // 添加透视相机

    'mAddAsset', // 添加模型
    'mExportGeometry', // 导出几何体
    'mExportObject', // 导出物体
    'mExportScene', // 导出场景
    'mExportGLTF', // 导出gltf文件
    'mExportMMD', // 导出mmd文件
    'mExportOBJ', // 导出obj模型
    'mExportPLY', // 导出ply文件
    'mExportSTLB', // 导出stl二进制文件
    'mExportSTL', // 导出stl模型

    'mAddPerson', // 添加人
    'mAddFire', // 添加火焰
    'mAddSmoke', // 添加烟
    'mAddMiku', // 初音未来

    'mAddPhysicsPlane', // 添加平板
    'mAddPhysicsWall', // 添加墙
    'mAddPhysicsCloth', // 添加布料
    'mThrowBall', // 探测小球

    'mParticleEmitter', // 粒子发射器

    'mPlay', // 启动

    'mArkanoid', // 打砖块
    'mCamera', // 相机
    'mParticles', // 粒子
    'mPong', // 乒乓球

    'mSurfaceOptions', // 外观选项
    'mSceneOptions', // 场景选项
    'mRendererOptions', // 渲染器选项

    'mSourceCode', // 源码
    'mAbout', // 关于

    // 工具栏事件

    'changeMode', // 改变模式（select, translate, rotate, scale, delete）

    // editor事件
    'setScene', // 设置编辑器场景
    'addObject', // 添加物体
    'moveObject', // 移动物体
    'removeObject', // 删除物体
    'addHelper', // 添加帮助事件
    'removeHelper', // 移除脚本
    'addScript', // 添加脚本
    'removeScript', // 移除脚本
    'select', // 选中事件
    'clear', // 清空场景
    'load', // 加载场景

    // signal事件
    'editScript', // 编辑脚本事件

    'startPlayer', // 启动播放器事件
    'stopPlayer', // 停止播放器事件

    'editorCleared', // 编辑器已经清空事件

    'snapChanged', // 对齐单元格事件
    'spaceChanged', // 空间坐标系改变事件

    'sceneGraphChanged', // 场景内容改变事件

    'cameraChanged', // 相机改变事件

    'geometryChanged', // 几何体改变事件

    'objectSelected', // 物体选中改变
    'objectFocused', // 物体交点改变事件

    'objectAdded', // 添加物体事件
    'objectChanged', // 物体改变事件
    'objectRemoved', // 物体移除事件

    'materialChanged', // 材质改变事件

    'scriptAdded', // 添加脚本事件
    'scriptChanged', // 脚本改变事件
    'scriptRemoved', // 脚本移除事件

    'showGridChanged', // 网格显示隐藏改变
    'refreshSidebarObject3D', // 刷新Object3D侧边栏事件
    'historyChanged', // 历史改变事件
    'refreshScriptEditor', // 刷新脚本编辑器事件

    // 场景编辑区
    'transformControlsChange', // 变形控件改变
    'transformControlsMouseDown', // 变形控件按下鼠标键
    'transformControlsMouseUp', // 变形控件抬起鼠标键
    'render', // 渲染一次场景
    'animate', // 进行动画

    // 侧边栏
    'newMaterial', // 材质面板新建材质
    'copyMaterial', // 材质面板复制材质
    'pasteMaterial', // 材质面板粘贴材质
    'updateMaterial', // 根据材质面板更新材质
    'updateMaterialPanel', // 更新材质面板UI

    'updateScaleX', // 物体面板更新缩放x
    'updateScaleY', // 物体面板更新缩放y
    'updateScaleZ', // 物体面板更新缩放z
    'updateObject', // 更新物体属性
    'updateObjectPanel', // 更新物体面板

    'selectTab', // 点击选择侧边栏选项卡
    'selectPropertyTab', // 点击选择属性选项卡

    'updateScenePanelFog', // 刷新场景面板雾效设置
    'outlinerChange', // 场景大纲发生改变

    // 状态栏
    'gridChange', // 状态栏网格改变事件
    'codeMirrorChange', // CodeMirror改变事件
];

export default EventList;