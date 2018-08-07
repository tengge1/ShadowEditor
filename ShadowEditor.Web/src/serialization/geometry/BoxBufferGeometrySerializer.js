import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * BoxBufferGeometrySerializer
 */
function BoxBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

BoxBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
BoxBufferGeometrySerializer.prototype.constructor = BoxBufferGeometrySerializer;

BoxBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

BoxBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.BoxBufferGeometry(
        json.width,
        json.height,
        json.depth,
        json.widthSegments,
        json.heightSegments,
        json.depthSegments
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default BoxBufferGeometrySerializer;