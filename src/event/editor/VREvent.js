import BaseEvent from '../BaseEvent';

/**
 * VR事件
 * @param {*} app 
 */
function VREvent(app) {
    BaseEvent.call(this, app);
    this.groupVR = null;
}

VREvent.prototype = Object.create(BaseEvent.prototype);
VREvent.prototype.constructor = VREvent;

VREvent.prototype.start = function () {
    var _this = this;
    var editor = this.app.editor;
    this.app.on('enterVR.' + this.id, function () {
        _this.onEnterVR();
    });
    editor.signals.exitedVR.add(function () {
        _this.onExitedVR();
    });
};

VREvent.prototype.stop = function () {

};

VREvent.prototype.onEnterVR = function () {

    var groupVR = this.groupVR;
    var editor = this.app.editor;
    var viewport = this.app.viewport;
    var sidebar = this.app.sidebar;
    var signals = editor.signals;

    if (groupVR == null) {

        groupVR = new THREE.HTMLGroup(viewport.dom);
        editor.sceneHelpers.add(groupVR);

        var mesh = new THREE.HTMLMesh(sidebar.dom);
        mesh.position.set(15, 0, 15);
        mesh.rotation.y = -0.5;
        groupVR.add(mesh);

        var _this = this;
        signals.objectSelected.add(function () {
            _this.updateTexture(mesh);
        });
        signals.objectAdded.add(function () {
            _this.updateTexture(mesh);
        });
        signals.objectChanged.add(function () {
            _this.updateTexture(mesh);
        });
        signals.objectRemoved.add(function () {
            _this.updateTexture(mesh);
        });
        signals.sceneGraphChanged.add(function () {
            _this.updateTexture(mesh);
        });
        signals.historyChanged.add(function () {
            _this.updateTexture(mesh);
        });

    }

    groupVR.visible = true;
};

VREvent.prototype.updateTexture = function (mesh) {
    mesh.material.map.update();
};

VREvent.prototype.onExitedVR = function () {

    var groupVR = this.groupVR;

    if (groupVR !== undefined) {
        groupVR.visible = false;
    }

};

export default VREvent;