import BaseSerializer from '../BaseSerializer';
import CameraSerializer from './CameraSerializer';

/**
 * PerspectiveCamera序列化器
 */
function PerspectiveCameraSerializer() {
    BaseSerializer.call(this);
}

PerspectiveCameraSerializer.prototype = Object.create(BaseSerializer.prototype);
PerspectiveCameraSerializer.prototype.constructor = PerspectiveCameraSerializer;

PerspectiveCameraSerializer.prototype.toJSON = function (obj) {
    var json = CameraSerializer.prototype.toJSON(obj);

    json.aspect = obj.aspect;
    json.far = obj.far;
    json.filmGauge = obj.filmGauge;
    json.filmOffset = obj.filmOffset;
    json.focus = obj.focus;
    json.fov = obj.fov;
    json.near = obj.near;
    json.view = obj.view;
    json.zoom = obj.zoom;

    return json;
};

PerspectiveCameraSerializer.prototype.fromJSON = function (json) {

};

export default PerspectiveCameraSerializer;