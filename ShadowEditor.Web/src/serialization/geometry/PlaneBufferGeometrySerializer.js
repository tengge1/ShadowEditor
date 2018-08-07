import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * PlaneBufferGeometrySerializer
 */
function PlaneBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

PlaneBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
PlaneBufferGeometrySerializer.prototype.constructor = PlaneBufferGeometrySerializer;

PlaneBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

PlaneBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.PlaneBufferGeometry(
        json.width,
        json.height,
        json.widthSegments,
        json.heightSegments
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default PlaneBufferGeometrySerializer;