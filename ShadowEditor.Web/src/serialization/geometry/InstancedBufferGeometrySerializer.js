import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * InstancedBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function InstancedBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

InstancedBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
InstancedBufferGeometrySerializer.prototype.constructor = InstancedBufferGeometrySerializer;

InstancedBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

InstancedBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.InstancedBufferGeometry() : parent;

    // TODO: 

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default InstancedBufferGeometrySerializer;