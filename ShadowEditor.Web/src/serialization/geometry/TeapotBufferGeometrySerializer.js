import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * TeapotBufferGeometrySerializer
 * @param {*} app 
 */
function TeapotBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

TeapotBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TeapotBufferGeometrySerializer.prototype.constructor = TeapotBufferGeometrySerializer;

TeapotBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TeapotBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TeapotBufferGeometry(
        json.parameters.size,
        json.parameters.segments,
        json.parameters.bottom,
        json.parameters.lid,
        json.parameters.body,
        json.parameters.fitLid,
        json.parameters.blinn
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default TeapotBufferGeometrySerializer;