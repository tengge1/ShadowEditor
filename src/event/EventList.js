/**
 * 自定义事件列表
 */
var EventList = [
    // dom事件
    'click',
    'contextmenu',
    'dblclick',
    'keydown',
    'keyup',
    'mousedown',
    'mousemove',
    'mouseup',
    'mousewheel',
    'resize',
    'dragover',
    'drop',

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
    'stopPlayer',

    'enterVR',
    'enteredVR',
    'exitedVR',

    'editorCleared',

    'savingStarted',
    'savingFinished',

    'themeChanged',

    'transformModeChanged',
    'snapChanged',
    'spaceChanged',
    'rendererChanged',

    'sceneBackgroundChanged',
    'sceneFogChanged',
    'sceneGraphChanged',

    'cameraChanged',

    'geometryChanged',

    'objectSelected',
    'objectFocused',

    'objectAdded',
    'objectChanged',
    'objectRemoved',

    'helperAdded',
    'helperRemoved',

    'materialChanged',

    'scriptAdded',
    'scriptChanged',
    'scriptRemoved',

    'windowResize',

    'showGridChanged',
    'refreshSidebarObject3D',
    'historyChanged',
    'refreshScriptEditor'
];

export default EventList;