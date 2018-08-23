import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * ExtrudeBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ExtrudeBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

ExtrudeBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
ExtrudeBufferGeometrySerializer.prototype.constructor = ExtrudeBufferGeometrySerializer;

ExtrudeBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

ExtrudeBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    // TODO

    var obj = parent === undefined ? new THREE.ExtrudeBufferGeometry(
        json.parameters.shapes,
        json.parameters.options
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ExtrudeBufferGeometrySerializer;