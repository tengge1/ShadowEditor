import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * RingBufferGeometrySerializer
 */
function RingBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

RingBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
RingBufferGeometrySerializer.prototype.constructor = RingBufferGeometrySerializer;

RingBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

RingBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.RingBufferGeometry(
        json.parameters.innerRadius,
        json.parameters.outerRadius,
        json.parameters.thetaSegments,
        json.parameters.phiSegments,
        json.parameters.thetaStart,
        json.parameters.thetaLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default RingBufferGeometrySerializer;