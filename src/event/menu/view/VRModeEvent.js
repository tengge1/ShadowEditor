import MenuEvent from '../MenuEvent';

/**
 * 启动事件
 * @param {*} app 
 */
function VRModeEvent(app) {
    MenuEvent.call(this, app);
}

VRModeEvent.prototype = Object.create(MenuEvent.prototype);
VRModeEvent.prototype.constructor = VRModeEvent;

VRModeEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mVRMode.' + this.id, this.onVRMode.bind(this));
    this.app.on('animate.' + this.id, this.onAnimate.bind(this));
};

VRModeEvent.prototype.stop = function () {
    this.app.on('mVRMode.' + this.id, null);
    this.app.on('animate.' + this.id, null);
};

VRModeEvent.prototype.onVRMode = function () {
    var editor = this.app.editor;

    if (this.app.editor.renderer.vr.enabled) {
        this.app.call('enterVR', this);
    } else {
        alert('WebVR不可用');
    }
};

VRModeEvent.prototype.onAnimate = function () {
    var vrEffect = this.app.editor.vrEffect;

    if (vrEffect && vrEffect.isPresenting) {
        this.app.call('render', this);
    }
};

export default VRModeEvent;