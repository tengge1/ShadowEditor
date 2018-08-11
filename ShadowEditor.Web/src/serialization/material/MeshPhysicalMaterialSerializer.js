import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshPhysicalMaterialSerializer
 * @param {*} app 
 */
function MeshPhysicalMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

MeshPhysicalMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshPhysicalMaterialSerializer.prototype.constructor = MeshPhysicalMaterialSerializer;

MeshPhysicalMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshPhysicalMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.MeshPhysicalMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MeshPhysicalMaterialSerializer;