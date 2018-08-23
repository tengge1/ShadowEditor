import BaseSerializer from '../BaseSerializer';
import CameraSerializer from './CameraSerializer';

/**
 * PerspectiveCameraSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function PerspectiveCameraSerializer(app) {
    BaseSerializer.call(this, app);
}

PerspectiveCameraSerializer.prototype = Object.create(BaseSerializer.prototype);
PerspectiveCameraSerializer.prototype.constructor = PerspectiveCameraSerializer;

PerspectiveCameraSerializer.prototype.toJSON = function (obj) {
    var json = CameraSerializer.prototype.toJSON.call(this, obj);

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

PerspectiveCameraSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.PerspectiveCamera() : parent;

    CameraSerializer.prototype.fromJSON.call(this, json, obj);

    obj.aspect = json.aspect;
    obj.far = json.far;
    obj.filmGauge = json.filmGauge;
    obj.filmOffset = json.filmOffset;
    obj.focus = json.focus;
    obj.fov = json.fov;
    obj.near = json.near;
    obj.view = json.view;
    obj.zoom = json.zoom;

    return obj;
};

export default PerspectiveCameraSerializer;