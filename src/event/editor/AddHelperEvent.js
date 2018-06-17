import BaseEvent from '../BaseEvent';

/**
 * 添加帮助事件
 * @param {*} app 
 */
function AddHelperEvent(app) {
    BaseEvent.call(this, app);
}

AddHelperEvent.prototype = Object.create(BaseEvent.prototype);
AddHelperEvent.prototype.constructor = AddHelperEvent;

AddHelperEvent.prototype.start = function () {
    var _this = this;
    this.app.on('addHelper.' + this.id, function (object) {
        _this.onAddHelper(object);
    });
};

AddHelperEvent.prototype.stop = function () {
    this.app.on('addHelper.' + this.id, null);
};

AddHelperEvent.prototype.onAddHelper = function (object) {
    var editor = this.app.editor;

    var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        visible: false
    });

    var helper;

    if (object instanceof THREE.Camera) { // 相机

        helper = new THREE.CameraHelper(object, 1);

    } else if (object instanceof THREE.PointLight) { // 点光源

        helper = new THREE.PointLightHelper(object, 1);

    } else if (object instanceof THREE.DirectionalLight) { // 平行光

        helper = new THREE.DirectionalLightHelper(object, 1);

    } else if (object instanceof THREE.SpotLight) { // 聚光灯

        helper = new THREE.SpotLightHelper(object, 1);

    } else if (object instanceof THREE.HemisphereLight) { // 半球光

        helper = new THREE.HemisphereLightHelper(object, 1);

    } else if (object instanceof THREE.SkinnedMesh) { // 带皮肤网格

        helper = new THREE.SkeletonHelper(object);

    } else {

        // no helper for this object type
        return;

    }

    var picker = new THREE.Mesh(geometry, material);
    picker.name = 'picker';
    picker.userData.object = object;
    helper.add(picker);

    editor.sceneHelpers.add(helper);
    editor.helpers[object.id] = helper;

    editor.signals.helperAdded.dispatch(helper);
};

export default AddHelperEvent;