import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * DodecahedronBufferGeometrySerializer
 */
function DodecahedronBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

DodecahedronBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
DodecahedronBufferGeometrySerializer.prototype.constructor = DodecahedronBufferGeometrySerializer;

DodecahedronBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

DodecahedronBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.DodecahedronBufferGeometry(
        json.parameters.radius,
        json.parameters.detail
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default DodecahedronBufferGeometrySerializer;