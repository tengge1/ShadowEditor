import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshBasicMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function MeshBasicMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshBasicMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshBasicMaterialSerializer.prototype.constructor = MeshBasicMaterialSerializer;

MeshBasicMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshBasicMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.MeshBasicMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default MeshBasicMaterialSerializer;