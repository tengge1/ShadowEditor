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
    this.app.on('mVRMode.' + this.id, function () {
        _this.onVRMode();
    });
};

VRModeEvent.prototype.stop = function () {
    this.app.on('mVRMode.' + this.id, null);
};

VRModeEvent.prototype.onVRMode = function () {
    var editor = this.app.editor;

    if (this.app.editor.renderer.vr.enabled) {
        this.app.call('enterVR', this);
    } else {
        alert('WebVR不可用');
    }
};

export default VRModeEvent;