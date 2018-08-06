import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * TextBufferGeometrySerializer
 */
function TextBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

TextBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TextBufferGeometrySerializer.prototype.constructor = TextBufferGeometrySerializer;

TextBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TextBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TextBufferGeometry() : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default TextBufferGeometrySerializer;