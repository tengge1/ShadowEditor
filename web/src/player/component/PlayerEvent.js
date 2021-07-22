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

    create(scene, camera, renderer, scripts) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.scripts = scripts;

        var dom = renderer.domElement;

        this.events = Object.keys(scripts).map(uuid => {
            var script = scripts[uuid];
            // TODO: 存在安全风险。
            return new Function(
                'app',
                'scene',
                'camera',
                'renderer',
                script.source + `
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
            return { init, start, update, stop, onClick, onDblClick, onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp, onMouseWheel, onTouchStart, onTouchEnd, onTouchMove, onResize, onVRConnected, onVRDisconnected, onVRSelectStart, onVRSelectEnd };
            `
            ).call(scene, this.app, scene, camera, renderer);
        });

        this.events.forEach((n, i) => {
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
    };

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