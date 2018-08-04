import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from '../core/Object3DSerializer';

/**
 * Camera序列化器
 */
function CameraSerializer() {
    BaseSerializer.call(this);
}

CameraSerializer.prototype = Object.create(BaseSerializer.prototype);
CameraSerializer.prototype.constructor = CameraSerializer;

CameraSerializer.prototype.filter = function (obj) {
    if (obj instanceof THREE.Camera) {
        return true;
    } else if (obj.metadata && obj.metadata.generator === this.constructor.name) {
        return true;
    } else {
        return false;
    }
};

CameraSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.matrixWorldInverse = obj.matrixWorldInverse;
    json.projectionMatrix = obj.projectionMatrix;

    return json;
};

CameraSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Camera() : parent;

    // TODO: Three.Camera反序列化

    return obj;
};

export default CameraSerializer;