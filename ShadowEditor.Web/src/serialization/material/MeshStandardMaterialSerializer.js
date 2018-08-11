import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshStandardMaterialSerializer
 * @param {*} app 
 */
function MeshStandardMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

MeshStandardMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshStandardMaterialSerializer.prototype.constructor = MeshStandardMaterialSerializer;

MeshStandardMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshStandardMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.MeshStandardMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MeshStandardMaterialSerializer;