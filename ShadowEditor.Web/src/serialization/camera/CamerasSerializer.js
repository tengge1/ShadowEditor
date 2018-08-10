import BaseSerializer from '../BaseSerializer';

import CameraSerializer from './CameraSerializer';
import OrthographicCameraSerializer from './OrthographicCameraSerializer';
import PerspectiveCameraSerializer from './PerspectiveCameraSerializer';

var Serializers = {
    'OrthographicCamera': OrthographicCameraSerializer,
    'PerspectiveCamera': PerspectiveCameraSerializer,
    'Camera': CameraSerializer
};

/**
 * CamerasSerializer
 */
function CamerasSerializer() {
    BaseSerializer.call(this);
}

CamerasSerializer.prototype = Object.create(BaseSerializer.prototype);
CamerasSerializer.prototype.constructor = CamerasSerializer;

CamerasSerializer.prototype.toJSON = function (obj) {
    var serializer = Serializers[obj.constructor.name];

    if (serializer === undefined) {
        console.warn(`CamerasSerializer: 无法序列化${obj.constructor.name}。`);
        return null;
    }

    return (new serializer()).toJSON(obj);
};

CamerasSerializer.prototype.fromJSON = function (json) {
    var generator = json.metadata.generator;

    var serializer = Serializers[generator.replace('Serializer', '')];

    if (serializer === undefined) {
        console.warn(`CamerasSerializer: 不存在 ${generator} 的反序列化器`);
        return null;
    }

    return (new serializer()).fromJSON(json);
};

export default CamerasSerializer;