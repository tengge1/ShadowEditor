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
];

export default EventList;