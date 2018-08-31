import UI from '../../ui/UI';

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

    this.isPlaying = false;
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

    this.create();

    requestAnimationFrame(this.animate.bind(this));
};

/**
 * 停止播放器
 */
Player.prototype.stop = function () {
    if (!this.isPlaying) {
        return;
    }
    this.isPlaying = false;

    var container = UI.get('player');
    container.dom.style.display = 'none';
};

/**
 * 创建场景
 */
Player.prototype.create = function () {
    var container = UI.get('player');

    if (this.renderer !== null) {
        container.dom.removeChild(this.renderer.domElement);
    }
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    container.dom.appendChild(this.renderer.domElement);

    this.camera = this.app.editor.camera.clone();

    this.scene = this.app.editor.camera.scene.clone();
};

/**
 * 动画
 */
Player.prototype.animate = function () {
    var container = UI.get('player');

    var scene = this.app.editor.scene;
    var camera = this.app.editor.camera;
    var renderer = this.app.editor.renderer;

    renderer.render(scene, camera);

    if (this.isPlaying) {
        requestAnimationFrame(this.animate.bind(this));
    }
};

export default Player;