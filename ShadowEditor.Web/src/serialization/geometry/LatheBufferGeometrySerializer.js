import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * LatheBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function LatheBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

LatheBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
LatheBufferGeometrySerializer.prototype.constructor = LatheBufferGeometrySerializer;

LatheBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

LatheBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.LatheBufferGeometry(
        json.parameters.points,
        json.parameters.segments,
        json.parameters.phiStart,
        json.parameters.phiLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default LatheBufferGeometrySerializer;