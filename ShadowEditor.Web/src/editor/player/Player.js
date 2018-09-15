import UI from '../../ui/UI';
import Converter from '../../serialization/Converter';

/**
 * 播放器
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function Player(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.scripts = null;

    this.audioListener = null;

    this.assets = {};

    this.events = null;

    this.isPlaying = false;
    this.clock = null;
};

Player.prototype = Object.create(UI.Control.prototype);
Player.prototype.constructor = Player;

Player.prototype.render = function () {
    this.container = UI.create({
        xtype: 'div',
        parent: this.parent,
        id: 'player',
        cls: 'Panel player',
        style: {
            display: 'none'
        }
    });

    this.container.render();
};

/**
 * 启动播放器
 */
Player.prototype.start = function () {
    if (this.isPlaying) {
        return;
    }
    this.isPlaying = true;

    var container = UI.get('player');
    container.dom.style.display = '';

    if (this.renderer !== null) {
        container.dom.removeChild(this.renderer.domElement);
    }

    this.assets = {};

    var jsons = (new Converter()).toJSON({
        options: this.app.options,
        camera: this.app.editor.camera,
        renderer: this.app.editor.renderer,
        scripts: this.app.editor.scripts,
        scene: this.app.editor.scene
    });

    var promise = (new Converter()).fromJson(jsons, {
        server: this.app.options.server
    });

    promise.then(obj => {
        this.initPlayer(obj);
        this.initScript();
        this.loadAssets().then(() => {
            this.clock = new THREE.Clock();
            this.events.forEach(n => {
                if (typeof (n.init) === 'function') {
                    n.init();
                }
            });
            this.renderScene();
            this.initScene();
            this.events.forEach(n => {
                if (typeof (n.start) === 'function') {
                    n.start();
                }
            });
            requestAnimationFrame(this.animate.bind(this));
        });
    });
};

/**
 * 停止播放器
 */
Player.prototype.stop = function () {
    this.events.forEach(n => {
        if (typeof (n.stop) === 'function') {
            n.stop();
        }
    });

    if (!this.isPlaying) {
        return;
    }
    this.isPlaying = false;

    this.destroyScene();

    var container = UI.get('player');
    container.dom.style.display = 'none';
};

/**
 * 初始化播放器
 * @param {*} obj 
 */
Player.prototype.initPlayer = function (obj) {
    var container = UI.get('player');
    var editor = this.app.editor;

    // 相机
    if (obj.camera) {
        this.camera = obj.camera;
    } else {
        this.camera = new THREE.PerspectiveCamera(editor.DEFAULT_CAMERA.fov, container.clientWidth / container.clientHeight, editor.DEFAULT_CAMERA.near, editor.DEFAULT_CAMERA.far);
    }
    this.camera.updateProjectionMatrix();

    // 渲染器
    if (obj.renderer) {
        this.renderer = obj.renderer;
    } else {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
    }
    this.renderer.setSize(container.dom.clientWidth, container.dom.clientHeight);
    container.dom.appendChild(this.renderer.domElement);

    // 脚本
    if (obj.scripts) {
        this.scripts = obj.scripts;
    } else {
        this.scripts = {};
    }

    this.audioListener = new THREE.AudioListener();
    this.camera.add(this.audioListener);

    // 场景
    if (obj.scene) {
        this.scene = obj.scene;
    } else {
        this.scene = new THREE.Scene();
    }
};

/**
 * 初始化脚本
 */
Player.prototype.initScript = function () {
    var dom = this.renderer.domElement;

    this.events = Object.keys(this.scripts).map(uuid => {
        var script = this.scripts[uuid];
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
        )).call(this.scene, this.scene, this.camera, this.renderer);
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
};

/**
 * 下载资源
 */
Player.prototype.loadAssets = function () {
    return new Promise(resolve => {
        var backgroundMusic = this.scene.userData.backgroundMusic;

        if (backgroundMusic) {
            var loader = new THREE.AudioLoader();

            loader.load(this.app.options.server + backgroundMusic.Url, buffer => {
                this.assets[backgroundMusic.Url] = buffer;
                resolve();
            }, undefined, () => {
                this.app.error(`Player: ${backgroundMusic.Url}下载失败。`);
                resolve();
            });
        } else {
            resolve();
        }
    });
};

/**
 * 渲染
 */
Player.prototype.renderScene = function () {
    this.renderer.render(this.scene, this.camera);
};

Player.prototype.initScene = function () {
    var backgroundMusic = this.scene.userData.backgroundMusic;
    if (backgroundMusic) {
        var buffer = this.assets[backgroundMusic.Url];

        if (buffer === undefined) {
            this.app.error(`Player: 加载背景音乐失败。`);
            return;
        }

        this.backgroundMusic = new THREE.Audio(this.audioListener);
        this.backgroundMusic.setBuffer(buffer);
        this.backgroundMusic.setLoop(true);
        this.backgroundMusic.setVolume(1.0);
        this.backgroundMusic.play();
    }
};

Player.prototype.destroyScene = function () {
    if (this.backgroundMusic) {
        if (this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        }
    }
};

/**
 * 动画
 */
Player.prototype.animate = function () {
    this.renderScene();

    var deltaTime = this.clock.getDelta();

    this.events.forEach(n => {
        if (typeof (n.update) === 'function') {
            n.update(this.clock, deltaTime);
        }
    });

    if (this.isPlaying) {
        requestAnimationFrame(this.animate.bind(this));
    }
};

export default Player;