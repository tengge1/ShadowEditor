import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * RingBufferGeometrySerializer
 */
function ShapeBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

ShapeBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
ShapeBufferGeometrySerializer.prototype.constructor = ShapeBufferGeometrySerializer;

ShapeBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

ShapeBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ShapeBufferGeometry() : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default ShapeBufferGeometrySerializer;