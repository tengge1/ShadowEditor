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
            position: 'absolute',
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
        this.clock = new THREE.Clock();
        this.events.forEach(n => {
            n.init();
        });
        this.renderScene();
        this.events.forEach(n => {
            n.start();
        });
        requestAnimationFrame(this.animate.bind(this));
    });
};

/**
 * 停止播放器
 */
Player.prototype.stop = function () {
    this.events.forEach(n => {
        n.stop();
    });

    if (!this.isPlaying) {
        return;
    }
    this.isPlaying = false;

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
            'app',
            'scene',
            'camera',
            'renderer',
            script.source +
            '; return { init, start, update, stop, onClick, onDblClick, onKeyDown, onKeyUp, ' +
            ' onMouseDown, onMouseMove, onMouseUp, onMouseWheel, onMouseWheel, onResize };'
        ))(this.app, this.scene, this.camera, this.renderer);
    });
};

/**
 * 渲染
 */
Player.prototype.renderScene = function () {
    this.renderer.render(this.scene, this.camera);
};

/**
 * 动画
 */
Player.prototype.animate = function () {
    this.renderScene();

    var deltaTime = this.clock.getDelta();

    this.events.forEach(n => {
        n.update(this.clock, deltaTime);
    });

    if (this.isPlaying) {
        requestAnimationFrame(this.animate.bind(this));
    }
};

export default Player;