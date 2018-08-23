import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * ParametricBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function ParametricBufferGeometrySerializer(app) {
    BaseSerializer.call(this, app);
}

ParametricBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
ParametricBufferGeometrySerializer.prototype.constructor = ParametricBufferGeometrySerializer;

ParametricBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

ParametricBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ParametricBufferGeometry(
        json.parameters.func,
        json.parameters.slices,
        json.parameters.stacks
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ParametricBufferGeometrySerializer;