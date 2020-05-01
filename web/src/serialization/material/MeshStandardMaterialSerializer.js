import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshStandardMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function MeshStandardMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshStandardMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshStandardMaterialSerializer.prototype.constructor = MeshStandardMaterialSerializer;

MeshStandardMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshStandardMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.MeshStandardMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default MeshStandardMaterialSerializer;