/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 *
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { dispatch } from '../third_party';

import EventList from './EventList';
import PackageManager from '../package/PackageManager';
import PlayerLoader from './component/PlayerLoader';
import PlayerEvent from './component/PlayerEvent';
import PlayerControl from './component/PlayerControl';
import PlayerAudio from './component/PlayerAudio';
import PlayerRenderer from './component/PlayerRenderer';
import PlayerAnimation from './component/PlayerAnimation';
import PlayerPhysics from './component/PlayerPhysics';
import PlayerLoadMask from './component/PlayerLoadMask';
import WebVR from './component/WebVR';
import CssUtils from '../utils/CssUtils';
import global from '../global';

/**
 * 播放器
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 * @param {HTMLElement} container 容器
 * @param {Object} options 配置信息
 * @param {String} options.server 服务器信息，例如：http://localhost:2000
 * @param {Boolean} options.enableThrowBall 是否允许扔小球进行物理测试
 * @param {Boolean} options.showStats 是否显示性能控件
 */
class Player {
  constructor(container = document.body, options = {}) {
    this.container = container;
    this.options = options;

    this.options.server = this.options.server || window.origin;
    this.options.enablePhysics = false; // 这个配置在场景里
    this.options.enableThrowBall = false;
    this.options.showStats = this.options.showStats || false;

    // 在播放器中
    if (!global.app) {
      global.app = this;
    }

    this.dispatch = dispatch.apply(dispatch, EventList);
    this.call = this.dispatch.call.bind(this.dispatch);
    this.on = this.dispatch.on.bind(this.dispatch);

    // 性能控件
    if (this.options.showStats) {
      this.stats = new Stats();
      Object.assign(this.stats.dom.style, {
        position: 'absolute',
        left: '8px',
        top: '8px',
        zIndex: 'initial',
      });

      container.appendChild(this.stats.dom);
    }

    window.addEventListener('resize', this.onResize.bind(this));

    var observer = new MutationObserver(this.onResize.bind(this));

    observer.observe(this.container, {
      attributes: true,
      characterData: false,
      childList: false,
    });

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.gis = null;

    this.package = new PackageManager();
    this.require = this.package.require.bind(this.package);

    this.loader = new PlayerLoader(this);
    this.event = new PlayerEvent(this);
    this.control = new PlayerControl(this);
    this.audio = new PlayerAudio(this);
    this.playerRenderer = new PlayerRenderer(this);
    this.animation = new PlayerAnimation(this);
    this.physics = new PlayerPhysics(this);
    this.webvr = new WebVR(this);
    this.mask = new PlayerLoadMask(this);

    this.isPlaying = false;
    this.clock = new THREE.Clock(false);

    // 保证播放器在不加载语言包的情况下正常运行
    if (!window._t) {
      window._t = function (data) {
        return data;
      };
    }
  }

  /**
   * 启动播放器
   * @param {String} sceneData 场景数据
   */
  start(sceneData) {
    if (typeof sceneData !== 'string') {
      global.app.toast(_t('Scene data of string type is needed.'));
      return;
    }

    var jsons;

    try {
      // 获取场景数据+用户自定义脚本数据等等
      jsons = JSON.parse(sceneData);
    } catch (e) {
      global.app.toast(_t('Cannot deserialize scene data.'), 'error');
      return;
    }

    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;

    this.container.style.display = 'block';

    this.mask.show();

    this.loader
      .create(jsons, {
        domWidth: this.container.clientWidth,
        domHeight: this.container.clientHeight,
      })
      .then(obj => {
        this.initPlayer(obj);

        this.dispatch.call('init', this);

        // 设置用户脚本的上下文环境
        var promise1 = this.event.create(this.scene, this.camera, this.renderer, obj.scripts);
        var promise2 = this.control.create(this.scene, this.camera, this.renderer);
        var promise3 = this.audio.create(this.scene, this.camera, this.renderer);
        var promise4 = this.playerRenderer.create(this.scene, this.camera, this.renderer);
        var promise5 = this.animation.create(this.scene, this.camera, this.renderer, obj.animations);
        var promise6 = this.physics.create(this.scene, this.camera, this.renderer);
        var promise7 = this.webvr.create(this.scene, this.camera, this.renderer);

        Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]).then(() => {
          this.mask.hide();
          this.event.init();
          this.clock.start();
          this.event.start();
          this.renderer.setAnimationLoop(this.animate.bind(this));
        });
      });
  }

  /**
   * 停止播放器
   */
  stop() {
    if (!this.isPlaying) {
      return;
    }
    this.isPlaying = false;
    this.renderer.setAnimationLoop(null);

    this.event.stop();

    this.loader.dispose();
    this.event.dispose();
    this.control.dispose();
    this.audio.dispose();
    this.animation.dispose();
    this.physics.dispose();
    this.webvr.dispose();

    // if (this.gis) {
    //     this.gis.dispose();
    //     this.gis = null;
    // }

    this.playerRenderer.dispose();

    this.container.removeChild(this.renderer.domElement);
    this.container.style.display = 'none';

    this.scene.children.length = 0;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.clock.stop();
  }

  /**
   * 初始化播放器
   * @param {*} obj 场景数据
   */
  initPlayer(obj) {
    var container = this.container;

    // options
    this.options.enablePhysics = obj.options.enablePhysics;
    this.options.enableVR = obj.options.enableVR;
    this.options.vrSetting = obj.options.vrSetting;

    // camera
    this.camera = obj.camera;

    if (!this.camera) {
      console.warn(`Player: Three is no camera in the scene.`);
      this.camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    }

    // renderer
    this.renderer =
      obj.renderer ||
      new THREE.WebGLRenderer({
        antialias: true,
      });

    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
    this.camera.updateProjectionMatrix();

    var listener = obj.audioListener || new THREE.AudioListener();
    this.camera.add(listener);

    this.renderer.domElement.style.filter = CssUtils.serializeFilter(obj.options);

    // scene
    this.scene = obj.scene || new THREE.Scene();
  }

  animate() {
    if (!this.isPlaying) {
      return;
    }

    if (this.stats) {
      this.stats.begin();
    }

    this.clock._getDelta(); // see: ../polyfills.js

    var deltaTime = this.clock.getDelta();

    this.event.update(this.clock, deltaTime);
    this.control.update(this.clock, deltaTime);
    this.playerRenderer.update(this.clock, deltaTime);
    this.animation.update(this.clock, deltaTime);
    this.physics.update(this.clock, deltaTime);
    this.webvr.update(this.clock, deltaTime);

    // if (this.gis) {
    //     this.gis.update();
    // }

    if (this.stats) {
      this.stats.end();
    }
  }

  resize() {
    if (!this.camera || !this.renderer) {
      return;
    }

    var width = this.container.clientWidth;
    var height = this.container.clientHeight;

    var camera = this.camera;
    var renderer = this.renderer;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.domElement;
    renderer.setSize(width, height);
  }

  onResize() {
    this.resize();
  }
}

export default Player;
