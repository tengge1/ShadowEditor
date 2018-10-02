import UI from '../ui/UI';
import Converter from '../serialization/Converter';
import PlayerEvent from './PlayerEvent';
import PlayerAnimation from './PlayerAnimation';

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

    this.animation = new PlayerAnimation(this.app);

    this.audioListener = null;

    this.assets = {};

    this.event = null;

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
        animation: this.app.editor.animation,
        scene: this.app.editor.scene
    });

    var promise = (new Converter()).fromJson(jsons, {
        server: this.app.options.server
    });

    promise.then(obj => {
        this.initPlayer(obj);
        this.event = new PlayerEvent(this.scripts, this.scene, this.camera, this.renderer);
        this.animation.init(this.scene, this.camera, this.renderer, obj.animation);
        this.loadAssets().then(() => {
            this.clock = new THREE.Clock();
            this.event.init();
            this.renderScene();
            this.initScene();
            this.event.start();
            requestAnimationFrame(this.animate.bind(this));
        });
    });
};

/**
 * 停止播放器
 */
Player.prototype.stop = function () {
    this.event.stop();

    if (!this.isPlaying) {
        return;
    }
    this.isPlaying = false;

    this.event.dispose(this.renderer);
    this.animation.dispose();
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

    // 音频监听器
    if (obj.audioListener) {
        this.audioListener = obj.audioListener;
    } else {
        this.app.warn(`Player: 场景中不存在音频监听器信息。`);
        this.audioListener = new THREE.AudioListener();
    }
    this.camera.add(this.audioListener);

    // 场景
    if (obj.scene) {
        this.scene = obj.scene;
    } else {
        this.scene = new THREE.Scene();
    }
};

/**
 * 下载资源
 */
Player.prototype.loadAssets = function () {
    return new Promise(resolve => {
        var promises = [];

        this.scene.traverse(n => {
            if (n instanceof THREE.Audio) {
                promises.push(new Promise(resolve1 => {
                    var loader = new THREE.AudioLoader();

                    loader.load(this.app.options.server + n.userData.Url, buffer => {
                        this.assets[n.userData.Url] = buffer;
                        resolve1();
                    }, undefined, () => {
                        this.app.error(`Player: ${n.userData.Url}下载失败。`);
                        resolve1();
                    });
                }));
            }
        });

        if (promises.length > 0) {
            Promise.all(promises).then(() => {
                resolve();
            });
        } else {
            resolve();
        }
    });
};

Player.prototype.initScene = function () {
    this.audios = [];

    // 音乐
    this.scene.traverse(n => {
        if (n instanceof THREE.Audio) {
            var buffer = this.assets[n.userData.Url];

            if (buffer === undefined) {
                this.app.error(`Player: 加载背景音乐失败。`);
                return;
            }

            n.setBuffer(buffer);

            if (n.userData.autoplay) {
                n.autoplay = n.userData.autoplay;
                n.play();
            }

            this.audios.push(n);
        }
    });
};

Player.prototype.renderScene = function () {
    this.renderer.render(this.scene, this.camera);
};

Player.prototype.destroyScene = function () {
    this.audios.forEach(n => {
        if (n.isPlaying) {
            n.stop();
        }
    });
};

Player.prototype.animate = function () {
    if (!this.isPlaying) {
        return;
    }

    this.renderScene();

    var deltaTime = this.clock.getDelta();

    this.event.update(this.clock, deltaTime);
    this.animation.update(this.clock, deltaTime);

    requestAnimationFrame(this.animate.bind(this));
};

export default Player;