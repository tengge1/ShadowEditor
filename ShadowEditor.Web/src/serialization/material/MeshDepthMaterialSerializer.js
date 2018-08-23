import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshDepthMaterialSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function MeshDepthMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

MeshDepthMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshDepthMaterialSerializer.prototype.constructor = MeshDepthMaterialSerializer;

MeshDepthMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshDepthMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.MeshDepthMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MeshDepthMaterialSerializer;