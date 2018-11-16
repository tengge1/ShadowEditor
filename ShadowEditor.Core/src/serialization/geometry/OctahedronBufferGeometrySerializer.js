import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * OctahedronBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function OctahedronBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

OctahedronBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
OctahedronBufferGeometrySerializer.prototype.constructor = OctahedronBufferGeometrySerializer;

OctahedronBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

OctahedronBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.OctahedronBufferGeometry(
        json.parameters.radius,
        json.parameters.detail
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default OctahedronBufferGeometrySerializer;