import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

/**
 * GlobeSerializer
 * @author tengge / https://github.com/tengge1
 */
function GlobeSerializer() {
    BaseSerializer.call(this);
}

GlobeSerializer.prototype = Object.create(BaseSerializer.prototype);
GlobeSerializer.prototype.constructor = GlobeSerializer;

GlobeSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    return json;
};

GlobeSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Bone() : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default GlobeSerializer;