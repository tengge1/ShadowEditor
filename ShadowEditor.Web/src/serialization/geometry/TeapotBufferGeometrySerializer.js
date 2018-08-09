import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * TeapotBufferGeometrySerializer
 */
function TeapotBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

TeapotBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TeapotBufferGeometrySerializer.prototype.constructor = TeapotBufferGeometrySerializer;

TeapotBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TeapotBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TeapotBufferGeometry(
        json.size,
        json.segments,
        json.bottom,
        json.lid,
        json.body,
        json.fitLid,
        json.blinn
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default TeapotBufferGeometrySerializer;