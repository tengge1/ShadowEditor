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

    json.matrixWorldInverse = item.matrixWorldInverse;
    json.projectionMatrix = item.projectionMatrix;

    return json;
};

CameraSerializer.prototype.fromJSON = function (json) {

};

export default CameraSerializer;