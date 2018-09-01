import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * TextBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
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
    var obj = parent === undefined ? new THREE.TextBufferGeometry(
        json.parameters.text,
        json.parameters.parameters
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default TextBufferGeometrySerializer;