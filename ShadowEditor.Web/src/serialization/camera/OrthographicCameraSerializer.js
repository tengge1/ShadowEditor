import BaseSerializer from '../BaseSerializer';
import CameraSerializer from './CameraSerializer';

/**
 * OrthographicCamera序列化器
 */
function OrthographicCameraSerializer() {
    BaseSerializer.call(this);
}

OrthographicCameraSerializer.prototype = Object.create(BaseSerializer.prototype);
OrthographicCameraSerializer.prototype.constructor = OrthographicCameraSerializer;

OrthographicCameraSerializer.prototype.filter = function (obj) {
    if (obj instanceof THREE.OrthographicCamera) {
        return true;
    } else if (obj.metadata && obj.metadata.generator === this.constructor.name) {
        return true;
    } else {
        return false;
    }
};

OrthographicCameraSerializer.prototype.toJSON = function (obj) {
    var json = CameraSerializer.prototype.toJSON.call(this, obj);

    json.bottom = obj.bottom;
    json.far = obj.far;
    json.left = obj.left;
    json.near = obj.near;
    json.right = obj.right;
    json.top = obj.top;
    json.view = obj.view;
    json.zoom = obj.zoom;

    return json;
};

OrthographicCameraSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.OrthographicCamera() : parent;

    // TODO: THREE.OrthographicCamera反序列化

    return obj;
};

export default OrthographicCameraSerializer;