import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * SphereBufferGeometrySerializer
 */
function SphereBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

SphereBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
SphereBufferGeometrySerializer.prototype.constructor = SphereBufferGeometrySerializer;

SphereBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

SphereBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.SphereBufferGeometry(
        json.radius,
        json.widthSegments,
        json.heightSegments,
        json.phiStart,
        json.phiLength,
        json.thetaStart,
        json.thetaLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default SphereBufferGeometrySerializer;