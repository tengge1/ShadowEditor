import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshPhongMaterialSerializer
 */
function MeshPhongMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshPhongMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshPhongMaterialSerializer.prototype.constructor = MeshPhongMaterialSerializer;

MeshPhongMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshPhongMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.MeshPhongMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MeshPhongMaterialSerializer;