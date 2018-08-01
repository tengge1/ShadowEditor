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

OrthographicCameraSerializer.prototype.toJSON = function (obj) {
    var json = CameraSerializer.prototype.toJSON(obj);

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

OrthographicCameraSerializer.prototype.fromJSON = function (json) {

};

export default OrthographicCameraSerializer;