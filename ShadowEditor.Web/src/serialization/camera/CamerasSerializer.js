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
 * @author tengge / https://github.com/tengge1
 */
function CamerasSerializer() {
    BaseSerializer.call(this);
}

CamerasSerializer.prototype = Object.create(BaseSerializer.prototype);
CamerasSerializer.prototype.constructor = CamerasSerializer;

CamerasSerializer.prototype.toJSON = function (obj) {
    var serializer = Serializers[obj.constructor.name];

    if (serializer === undefined) {
        console.warn(`CamerasSerializer: No serializer with ${obj.constructor.name}.`);
        return null;
    }

    return (new serializer()).toJSON(obj);
};

CamerasSerializer.prototype.fromJSON = function (json, parent) {
    var generator = json.metadata.generator;

    var serializer = Serializers[generator.replace('Serializer', '')];

    if (serializer === undefined) {
        console.warn(`CamerasSerializer: No deserializer with ${generator}.`);
        return null;
    }

    return (new serializer()).fromJSON(json, parent);
};

export default CamerasSerializer;