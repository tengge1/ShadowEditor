/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 自定义事件列表
 * @author tengge / https://github.com/tengge1
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
    'dragover', // 拖动到某元素上
    'drop', // 放置到某元素上

    // app事件
    'appStart', // 应用程序开始前调用
    'appStarted', // 应用程序开始后调用
    'appStop', // 程序开始结束前调用
    'appStoped', // 程序结束后调用
    'showMask', // 是否显示加载器
    'login', // 登录成功
    'logout', // 注销成功
    'message', // 接收到一个WebSocket消息，格式：{ type: 'Message Type', ... }
    'send', // 通过WebSocket向服务端发送消息，格式：{ type: 'Message Type', ... }
    'queryLoadAutoSceneScene', // 提示是否加载自动保存的场景

    // 配置
    'optionChange', // 某个配置发生变化
    'optionsChanged', // 配置改变事件（参数：无）
    'storageChanged', // 存储改变事件（参数：key, value）

    // 工具栏事件
    'changeMode', // 改变模式（select, translate, rotate, scale, delete）
    'changeView', // 改变视图（perspective, front, side, top）
    'viewChanged', // 视图已经改变

    // 编辑工具栏
    'undo',
    'redo',
    'clearHistory',
    'copy',
    'clone',
    'delete',

    // editor事件
    'sceneSaved', // 场景保存成功
    'select', // 选中事件
    'clear', // 清空场景
    'load', // 加载场景，(url, name, id)
    'loadSceneList', // 加载场景，(list, name, id)
    'log', // 日志事件

    'editScript', // 编辑脚本事件 uuid, name, type, source
    'editorCleared', // 编辑器已经清空事件

    'snapChanged', // 对齐单元格事件
    'spaceChanged', // 空间坐标系改变事件

    'sceneGraphChanged', // 场景内容改变事件
    'cameraChanged', // 相机改变事件
    'rendererChanged', // 渲染器改变

    'geometryChanged', // 几何体改变事件

    'objectSelected', // 物体选中改变
    'objectFocused', // 物体交点改变事件

    'objectAdded', // 添加物体事件
    'objectChanged', // 物体改变事件
    'objectRemoved', // 物体移除事件

    'addText', // 添加文字
    'removeText', // 移除文字

    'scriptChanged', // 脚本改变事件

    'historyChanged', // 历史改变事件
    'refreshScriptEditor', // 刷新脚本编辑器事件

    'sceneLoaded', // 场景载入
    'postProcessingChanged', // 后期处理设置改变
    'currentMaterialChange', // 当前材质改变

    // 场景编辑区
    'transformControlsChange', // 变形控件改变
    'transformControlsMouseDown', // 变形控件按下鼠标键
    'transformControlsMouseUp', // 变形控件抬起鼠标键

    'raycast', // 光线投射（不碰到模型也会触发）
    'intersect', // 碰撞到模型（只有碰撞到模型才会触发）
    'gpuPick', // 使用GPU选取到某个模型，参数：{ object: 碰撞到的物体，没碰到为null, point: 碰撞到物体坐标点，没碰到与y=0平面碰撞, distance: 相机到碰撞点距离，没碰到为0 }
    'beforeRender', // 渲染前执行
    'afterRender', // 渲染后执行
    'animate', // 进行动画

    // 侧边栏
    'animationSelected', // 动画选中事件
    'animationChanged', // 动画发生改变事件
    'resetAnimation', // 重制动画时间轴
    'startAnimation', // 开始播放动画
    'animationTime', // 时间轴发送当前动画时间

    // 底部面板事件
    'selectBottomPanel', // 点击选择某个面板
    'showBottomPanel', // 显示某个底部面板以后
    'selectModel', // 选择模型
    'selectMap', // 选择贴图
    'selectMaterial', // 选择材质
    'selectAudio', // 选择音频
    'selectAnimation', // 选择动画
    'selectParticle', // 选择粒子

    // 状态栏事件
    'enableThrowBall' // 是否允许扔小球
];

export default EventList;