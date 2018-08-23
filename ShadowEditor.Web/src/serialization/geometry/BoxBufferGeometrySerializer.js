import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * BoxBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function BoxBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

BoxBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
BoxBufferGeometrySerializer.prototype.constructor = BoxBufferGeometrySerializer;

BoxBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

BoxBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.BoxBufferGeometry(
        json.parameters.width,
        json.parameters.height,
        json.parameters.depth,
        json.parameters.widthSegments,
        json.parameters.heightSegments,
        json.parameters.depthSegments
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default BoxBufferGeometrySerializer;