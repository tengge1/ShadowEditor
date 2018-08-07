import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * ExtrudeBufferGeometrySerializer
 */
function ExtrudeBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

ExtrudeBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
ExtrudeBufferGeometrySerializer.prototype.constructor = ExtrudeBufferGeometrySerializer;

ExtrudeBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

ExtrudeBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    // TODO

    var obj = parent === undefined ? new THREE.ExtrudeBufferGeometry(
        json.parameters.shapes,
        json.parameters.options
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default ExtrudeBufferGeometrySerializer;