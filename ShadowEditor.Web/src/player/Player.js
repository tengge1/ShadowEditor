import UI from '../ui/UI';
import Converter from '../serialization/Converter';
import Ease from '../animation/Ease';

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
    this.animation = null;
    this.maxAnimationTime = 0;
    this.currentAnimationTime = 0;

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
        animation: this.app.editor.animation,
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

    // 动画
    this.animation = obj.animation;
    this.maxAnimationTime = 0;
    this.animation.forEach(n => {
        n.animations.forEach(m => {
            if (m.endTime > this.maxAnimationTime) {
                this.maxAnimationTime = m.endTime;
            }
        });
    });
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

/**
 * 渲染
 */
Player.prototype.renderScene = function () {
    this.renderer.render(this.scene, this.camera);
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

    // 动画
    this.app.call(`resetAnimation`, this.id);
    this.app.call(`startAnimation`, this.id);
    this.app.on(`animationTime.${this.id}`, (time) => {
        this.currentAnimationTime = time;
    });
};

Player.prototype.destroyScene = function () {
    this.audios.forEach(n => {
        if (n.isPlaying) {
            n.stop();
        }
    });

    this.app.on(`animationTime.${this.id}`, null);
    this.app.call(`resetAnimation`, this.id);
    this.currentAnimationTime = 0;
    this.maxAnimationTime = 0;
};

/**
 * 动画
 */
Player.prototype.animate = function () {
    this.renderScene();

    // 脚本事件
    var deltaTime = this.clock.getDelta();

    this.events.forEach(n => {
        if (typeof (n.update) === 'function') {
            n.update(this.clock, deltaTime);
        }
    });

    // 动画
    this.animation.forEach(n => {
        n.animations.forEach(m => {
            this.tweenObject(m); // 补间动画
        });
    });

    // 超过最大动画时间，重置动画
    if (this.currentAnimationTime > this.maxAnimationTime) {
        this.app.call(`resetAnimation`, this.id);
        this.app.call(`startAnimation`, this.id);
    }

    if (this.isPlaying) {
        requestAnimationFrame(this.animate.bind(this));
    }
};

/**
 * 补间动画处理
 * @param {*} animation 
 */
Player.prototype.tweenObject = function (animation) {
    var time = this.currentAnimationTime;

    // 条件判断
    if (animation.type !== 'Tween' || time < animation.beginTime || time > animation.endTime || animation.target == null) {
        return;
    }

    // 获取对象
    var target = this.scene.getObjectByProperty('uuid', animation.target);
    if (target == null) {
        console.warn(`Player: 场景中不存在uuid为${animation.target}的物体。`);
        return;
    }

    // 获取插值函数
    var ease = Ease[animation.ease];
    if (ease == null) {
        console.warn(`Player: 不存在名称为${animation.ease}的插值函数。`);
        return;
    }

    var result = ease((time - animation.beginTime) / (animation.endTime - animation.beginTime));

    var positionX = animation.beginPositionX + (animation.endPositionX - animation.beginPositionX) * result;
    var positionY = animation.beginPositionY + (animation.endPositionY - animation.beginPositionY) * result;
    var positionZ = animation.beginPositionZ + (animation.endPositionZ - animation.beginPositionZ) * result;

    var rotationX = animation.beginRotationX + (animation.endRotationX - animation.beginRotationX) * result;
    var rotationY = animation.beginRotationY + (animation.endRotationY - animation.beginRotationY) * result;
    var rotationZ = animation.beginRotationZ + (animation.endRotationZ - animation.beginRotationZ) * result;

    var scaleX = animation.beginScaleX + (animation.endScaleX - animation.beginScaleX) * result;
    var scaleY = animation.beginScaleY + (animation.endScaleY - animation.beginScaleY) * result;
    var scaleZ = animation.beginScaleZ + (animation.endScaleZ - animation.beginScaleZ) * result;

    target.position.x = positionX;
    target.position.y = positionY;
    target.position.z = positionZ;

    target.rotation.x = rotationX;
    target.rotation.y = rotationY;
    target.rotation.z = rotationZ;

    target.scale.x = scaleX;
    target.scale.y = scaleY;
    target.scale.z = scaleZ;
};

export default Player;