import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from '../core/Object3DSerializer';

/**
 * CameraSerializer
 * @param {*} app 
 */
function CameraSerializer(app) {
    BaseSerializer.call(this, app);
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

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.matrixWorldInverse.copy(json.matrixWorldInverse);
    obj.projectionMatrix.copy(json.projectionMatrix);

    return obj;
};

export default CameraSerializer;