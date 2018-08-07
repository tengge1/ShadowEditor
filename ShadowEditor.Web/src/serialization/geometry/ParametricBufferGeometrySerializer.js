import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * ParametricBufferGeometrySerializer
 */
function ParametricBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

ParametricBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
ParametricBufferGeometrySerializer.prototype.constructor = ParametricBufferGeometrySerializer;

ParametricBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

ParametricBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ParametricBufferGeometry(
        json.parameters.func,
        json.parameters.slices,
        json.parameters.stacks
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default ParametricBufferGeometrySerializer;