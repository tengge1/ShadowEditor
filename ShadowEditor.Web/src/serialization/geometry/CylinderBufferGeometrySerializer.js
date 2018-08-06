import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * CylinderBufferGeometrySerializer
 */
function CylinderBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

CylinderBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
CylinderBufferGeometrySerializer.prototype.constructor = CylinderBufferGeometrySerializer;

CylinderBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

CylinderBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.CylinderBufferGeometry() : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default CylinderBufferGeometrySerializer;