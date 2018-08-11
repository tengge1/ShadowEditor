import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshBasicMaterialSerializer
 * @param {*} app 
 */
function MeshBasicMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

MeshBasicMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshBasicMaterialSerializer.prototype.constructor = MeshBasicMaterialSerializer;

MeshBasicMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshBasicMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.MeshBasicMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MeshBasicMaterialSerializer;