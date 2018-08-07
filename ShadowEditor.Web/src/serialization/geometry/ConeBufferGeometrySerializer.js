import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * ConeBufferGeometrySerializer
 */
function ConeBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

ConeBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
ConeBufferGeometrySerializer.prototype.constructor = ConeBufferGeometrySerializer;

ConeBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

ConeBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ConeBufferGeometry(
        json.parameters.radius,
        json.parameters.height,
        json.parameters.radialSegments,
        json.parameters.heightSegments,
        json.parameters.openEnded,
        json.parameters.thetaStart,
        json.parameters.thetaLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default ConeBufferGeometrySerializer;