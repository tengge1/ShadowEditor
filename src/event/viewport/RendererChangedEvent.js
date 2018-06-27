import BaseEvent from '../BaseEvent';

/**
 * 渲染器改变事件
 * @param {*} app 
 */
function RendererChangedEvent(app) {
    BaseEvent.call(this, app);

    this.vrControls = null;
    this.vrCamera = null;
    this.vrEffect = null;
}

RendererChangedEvent.prototype = Object.create(BaseEvent.prototype);
RendererChangedEvent.prototype.constructor = RendererChangedEvent;

RendererChangedEvent.prototype.start = function () {
    this.app.on('rendererChanged.' + this.id, this.onRendererChanged.bind(this));
};

RendererChangedEvent.prototype.stop = function () {
    this.app.on('rendererChanged.' + this.id, null);
};

RendererChangedEvent.prototype.onRendererChanged = function (newRenderer) {
    var editor = this.app.editor;
    var renderer = this.app.editor.renderer;
    var container = this.app.viewport.container;

    if (renderer !== null) {
        container.dom.removeChild(renderer.domElement);
    }

    renderer = newRenderer;
    this.app.editor.renderer = renderer;

    renderer.autoClear = false;
    renderer.autoUpdateScene = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

    container.dom.appendChild(renderer.domElement);

    if (renderer.vr && renderer.vr.enabled) {
        this.vrCamera = new THREE.PerspectiveCamera();
        this.vrCamera.projectionMatrix = editor.camera.projectionMatrix;
        editor.camera.add(this.vrCamera);
        editor.vrCamera = this.vrCamera;

        this.vrControls = new THREE.VRControls(this.vrCamera);
        editor.vrControls = this.vrControls;

        this.vrEffect = new THREE.VREffect(renderer);
        editor.vrEffect = this.vrEffect;

        var _this = this;

        window.addEventListener('vrdisplaypresentchange', function (event) {
            _this.vrEffect.isPresenting ? _this.app.call('enteredVR', _this) : _this.app.call('exitedVR', _this);
        }, false);
    }

    _this.app.call('render');
};

export default RendererChangedEvent;