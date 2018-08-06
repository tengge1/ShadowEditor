import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * LatheBufferGeometrySerializer
 */
function LatheBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

LatheBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
LatheBufferGeometrySerializer.prototype.constructor = LatheBufferGeometrySerializer;

LatheBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

LatheBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.LatheBufferGeometry() : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default LatheBufferGeometrySerializer;