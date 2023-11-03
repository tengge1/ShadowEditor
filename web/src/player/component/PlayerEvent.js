/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import PlayerComponent from './PlayerComponent';
/**
 * 播放器事件
 * @param {*} app 播放器
 */
class PlayerEvent extends PlayerComponent {
  constructor(app) {
    super(app);
  }

  /**
   * 补全用户自定义脚本上下文环境
   * @param {THREE.Scene} scene threejs场景
   * @param {THREE.Camera} camera threejs相机
   * @param {THREE.WebGlRenderer} renderer threejs渲染器
   * @param {objct} scripts 用户自定义脚本
   * @returns 返回promise,便于后续处理
   */
  create(scene, camera, renderer, scripts) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.scripts = scripts;

    var dom = renderer.domElement;

    // 循环每个用户自定义的脚本,处理每个脚本的上下文环境,最终会返回一个array[用户自定义脚本函数,......],并且用户自定义脚本在这里自动执行(call方法)
    this.events = Object.keys(scripts).map(uuid => {
      // 获取当前用户自定义脚本
      var script = scripts[uuid];

      // TODO: 创建用户自定义脚本上下文环境,存在一定的安全风险。
      return new Function(
        // 这里除了最后一个参数是函数的执行内容之外,其余都是函数的参数
        'app',
        'scene',
        'camera',
        'renderer',

        // 函数的执行内容
        script.source +
          `
            // 根据用户自定义脚本来判断用户是否定义了这些事件,从而便于后续的绑定事件
            var init = init || null;
            var start = start || null;
            var update = update || null;
            var stop = stop || null;
            var onClick = onClick || null;
            var onDblClick = onDblClick || null;
            var onKeyDown = onKeyDown || null;
            var onKeyUp = onKeyUp || null;
            var onMouseDown = onMouseDown || null;
            var onMouseMove = onMouseMove || null;
            var onMouseUp = onMouseUp || null;
            var onMouseWheel = onMouseWheel || null;
            var onResize = onResize || null;
            var onTouchStart = onTouchStart || null;
            var onTouchEnd = onTouchEnd || null;
            var onTouchMove = onTouchMove || null;
            var onVRConnected = onVRConnected || null;
            var onVRDisconnected = onVRDisconnected || null;
            var onVRSelectStart = onVRSelectStart || null;
            var onVRSelectEnd = onVRSelectEnd || null;
            return { init, start, update, stop, onClick, onDblClick, onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp, onMouseWheel, onTouchStart, onTouchEnd, onTouchMove, onResize, onVRConnected, onVRDisconnected, onVRSelectStart, onVRSelectEnd };`
      ).call(scene, this.app, scene, camera, renderer);
    });

    // 循环用户自定义脚本,给脚本中添加自定义事件与用户在自定义脚本中相对应的事件代码,这里的事件会再自定义脚本结束后再进行绑定
    this.events.forEach((n, i) => {
      // 如果用户设置onClick,并且onClick还是一个函数,就在这里绑定onClick事件并传递场景参数onClick作为事件的参数
      if (typeof n.onClick === 'function') {
        dom.addEventListener('click', n.onClick.bind(this.scene));
      }
      if (typeof n.onDblClick === 'function') {
        dom.addEventListener('dblclick', n.onDblClick.bind(this.scene));
      }
      if (typeof n.onKeyDown === 'function') {
        dom.addEventListener('keydown', n.onKeyDown.bind(this.scene));
      }
      if (typeof n.onKeyUp === 'function') {
        dom.addEventListener('keyup', n.onKeyUp.bind(this.scene));
      }
      if (typeof n.onMouseDown === 'function') {
        dom.addEventListener('mousedown', n.onMouseDown.bind(this.scene));
      }
      if (typeof n.onMouseMove === 'function') {
        dom.addEventListener('mousemove', n.onMouseMove.bind(this.scene));
      }
      if (typeof n.onMouseUp === 'function') {
        dom.addEventListener('mouseup', n.onMouseUp.bind(this.scene));
      }
      if (typeof n.onMouseWheel === 'function') {
        dom.addEventListener('mousewheel', n.onMouseWheel.bind(this.scene));
      }
      if (typeof n.onTouchStart === 'function') {
        dom.addEventListener('touchstart', n.onTouchStart.bind(this.scene));
      }
      if (typeof n.onTouchEnd === 'function') {
        dom.addEventListener('touchend', n.onTouchEnd.bind(this.scene));
      }
      if (typeof n.onTouchMove === 'function') {
        dom.addEventListener('touchmove', n.onTouchMove.bind(this.scene));
      }
      if (typeof n.onResize === 'function') {
        window.addEventListener('resize', n.onResize.bind(this.scene));
      }
      if (typeof n.onVRConnected === 'function') {
        this.app.on(`vrConnected.${this.id}-${i}`, n.onVRConnected.bind(this.scene));
      }
      if (typeof n.onVRDisconnected === 'function') {
        this.app.on(`vrDisconnected.${this.id}-${i}`, n.onVRDisconnected.bind(this.scene));
      }
      if (typeof n.onVRSelectStart === 'function') {
        this.app.on(`vrSelectStart.${this.id}-${i}`, n.onVRSelectStart.bind(this.scene));
      }
      if (typeof n.onVRSelectEnd === 'function') {
        this.app.on(`vrSelectEnd.${this.id}-${i}`, n.onVRSelectEnd.bind(this.scene));
      }
    });

    // 返回一个promise,便于接收方处理
    return new Promise(resolve => {
      resolve();
    });
  }

  /**
   * 场景载入前执行一次
   */
  init() {
    this.events.forEach(n => {
      if (typeof n.init === 'function') {
        n.init();
      }
    });
  }

  /**
   * 场景载入后执行一次
   */
  start() {
    this.events.forEach(n => {
      if (typeof n.start === 'function') {
        n.start();
      }
    });
  }

  /**
   * 运行期间每帧都要执行
   * @param {THREE.Clock} clock 时钟
   * @param {Number} deltaTime 间隔时间
   */
  update(clock, deltaTime) {
    this.events.forEach(n => {
      if (typeof n.update === 'function') {
        n.update(clock, deltaTime);
      }
    });
  }

  /**
   * 程序结束运行后执行一次
   */
  stop() {
    this.events.forEach(n => {
      if (typeof n.stop === 'function') {
        n.stop();
      }
    });
  }

  /**
   * 析构PlayerEvent
   */
  dispose() {
    var dom = this.renderer.domElement;

    this.events.forEach(n => {
      if (typeof n.onClick === 'function') {
        dom.removeEventListener('click', n.onClick.bind(this.scene));
      }
      if (typeof n.onDblClick === 'function') {
        dom.removeEventListener('dblclick', n.onDblClick.bind(this.scene));
      }
      if (typeof n.onKeyDown === 'function') {
        dom.removeEventListener('keydown', n.onKeyDown.bind(this.scene));
      }
      if (typeof n.onKeyUp === 'function') {
        dom.removeEventListener('keyup', n.onKeyUp.bind(this.scene));
      }
      if (typeof n.onMouseDown === 'function') {
        dom.removeEventListener('mousedown', n.onMouseDown.bind(this.scene));
      }
      if (typeof n.onMouseMove === 'function') {
        dom.removeEventListener('mousemove', n.onMouseMove.bind(this.scene));
      }
      if (typeof n.onMouseUp === 'function') {
        dom.removeEventListener('mouseup', n.onMouseUp.bind(this.scene));
      }
      if (typeof n.onMouseWheel === 'function') {
        dom.removeEventListener('mousewheel', n.onMouseWheel.bind(this.scene));
      }
      if (typeof n.onResize === 'function') {
        window.removeEventListener('resize', n.onResize.bind(this.scene));
      }
    });

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.scripts = null;
    this.events.length = 0;
  }
}

export default PlayerEvent;
