/**
 * 播放器事件
 * @author tengge / https://github.com/tengge1
 * @param {*} scripts 脚本列表
 * @param {*} scene 场景
 * @param {*} camera 相机
 * @param {*} renderer 渲染器
 */
function PlayerEvent(scripts, scene, camera, renderer) {
    var dom = renderer.domElement;

    this.events = Object.keys(scripts).map(uuid => {
        var script = scripts[uuid];
        return (new Function(
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
            return { init, start, update, stop, onClick, onDblClick, onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp, onMouseWheel, onResize };
            `
        )).call(scene, scene, camera, renderer);
    });

    this.events.forEach(n => {
        if (typeof (n.onClick) === 'function') {
            dom.addEventListener('click', n.onClick.bind(this.scene));
        }
        if (typeof (n.onDblClick) === 'function') {
            dom.addEventListener('dblclick', n.onDblClick.bind(this.scene));
        }
        if (typeof (n.onKeyDown) === 'function') {
            dom.addEventListener('keydown', n.onKeyDown.bind(this.scene));
        }
        if (typeof (n.onKeyUp) === 'function') {
            dom.addEventListener('keyup', n.onKeyUp.bind(this.scene));
        }
        if (typeof (n.onMouseDown) === 'function') {
            dom.addEventListener('mousedown', n.onMouseDown.bind(this.scene));
        }
        if (typeof (n.onMouseMove) === 'function') {
            dom.addEventListener('mousemove', n.onMouseMove.bind(this.scene));
        }
        if (typeof (n.onMouseUp) === 'function') {
            dom.addEventListener('mouseup', n.onMouseUp.bind(this.scene));
        }
        if (typeof (n.onMouseWheel) === 'function') {
            dom.addEventListener('mousewheel', n.onMouseWheel.bind(this.scene));
        }
        if (typeof (n.onResize) === 'function') {
            window.addEventListener('resize', n.onResize.bind(this.scene));
        }
    });
}

/**
 * 场景载入前执行一次
 */
PlayerEvent.prototype.init = function () {
    this.events.forEach(n => {
        if (typeof (n.init) === 'function') {
            n.init();
        }
    });
};

/**
 * 场景载入后执行一次
 */
PlayerEvent.prototype.start = function () {
    this.events.forEach(n => {
        if (typeof (n.start) === 'function') {
            n.start();
        }
    });
};

/**
 * 运行期间每帧都要执行
 * @param {*} clock 
 * @param {*} deltaTime 
 */
PlayerEvent.prototype.update = function (clock, deltaTime) {
    this.events.forEach(n => {
        if (typeof (n.update) === 'function') {
            n.update(clock, deltaTime);
        }
    });
};

/**
 * 程序结束运行后执行一次
 */
PlayerEvent.prototype.stop = function () {
    this.events.forEach(n => {
        if (typeof (n.stop) === 'function') {
            n.stop();
        }
    });
};

/**
 * 析构PlayerEvent
 * @param {*} renderer 渲染器
 */
PlayerEvent.prototype.dispose = function (renderer) {
    var dom = renderer.domElement;

    this.events.forEach(n => {
        if (typeof (n.onClick) === 'function') {
            dom.removeEventListener('click', n.onClick.bind(this.scene));
        }
        if (typeof (n.onDblClick) === 'function') {
            dom.removeEventListener('dblclick', n.onDblClick.bind(this.scene));
        }
        if (typeof (n.onKeyDown) === 'function') {
            dom.removeEventListener('keydown', n.onKeyDown.bind(this.scene));
        }
        if (typeof (n.onKeyUp) === 'function') {
            dom.removeEventListener('keyup', n.onKeyUp.bind(this.scene));
        }
        if (typeof (n.onMouseDown) === 'function') {
            dom.removeEventListener('mousedown', n.onMouseDown.bind(this.scene));
        }
        if (typeof (n.onMouseMove) === 'function') {
            dom.removeEventListener('mousemove', n.onMouseMove.bind(this.scene));
        }
        if (typeof (n.onMouseUp) === 'function') {
            dom.removeEventListener('mouseup', n.onMouseUp.bind(this.scene));
        }
        if (typeof (n.onMouseWheel) === 'function') {
            dom.removeEventListener('mousewheel', n.onMouseWheel.bind(this.scene));
        }
        if (typeof (n.onResize) === 'function') {
            window.removeEventListener('resize', n.onResize.bind(this.scene));
        }
    });
    this.events.length = 0;
};

export default PlayerEvent;