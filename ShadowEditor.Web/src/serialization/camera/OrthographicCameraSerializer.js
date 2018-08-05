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

    CameraSerializer.prototype.fromJSON.call(this, json, obj);

    obj.bottom = json.bottom;
    obj.far = json.far;
    obj.left = json.left;
    obj.near = json.near;
    obj.right = json.right;
    obj.top = json.top;
    obj.view = json.view;
    obj.zoom = json.zoom;

    return obj;
};

export default OrthographicCameraSerializer;