import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * CircleBufferGeometrySerializer
 */
function CircleBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

CircleBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
CircleBufferGeometrySerializer.prototype.constructor = CircleBufferGeometrySerializer;

CircleBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

CircleBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.CircleBufferGeometry() : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default CircleBufferGeometrySerializer;