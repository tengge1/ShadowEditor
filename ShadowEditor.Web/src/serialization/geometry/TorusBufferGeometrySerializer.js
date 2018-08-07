import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * TorusBufferGeometrySerializer
 */
function TorusBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

TorusBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TorusBufferGeometrySerializer.prototype.constructor = TorusBufferGeometrySerializer;

TorusBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TorusBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TorusBufferGeometry(
        json.parameters.radius,
        json.parameters.tube,
        json.parameters.radialSegments,
        json.parameters.tubularSegments,
        json.parameters.arc
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default TorusBufferGeometrySerializer;