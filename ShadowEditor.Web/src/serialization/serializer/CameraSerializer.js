import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

/**
 * Camera序列化器
 */
function CameraSerializer() {
    BaseSerializer.call(this);
}

CameraSerializer.prototype = Object.create(BaseSerializer.prototype);
CameraSerializer.prototype.constructor = CameraSerializer;

CameraSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON(obj);

    json.matrixWorldInverse = obj.matrixWorldInverse;
    json.projectionMatrix = obj.projectionMatrix;

    return json;
};

CameraSerializer.prototype.fromJSON = function (json) {

};

export default CameraSerializer;