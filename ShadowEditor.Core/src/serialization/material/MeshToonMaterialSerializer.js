import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshToonMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function MeshToonMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshToonMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshToonMaterialSerializer.prototype.constructor = MeshToonMaterialSerializer;

MeshToonMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshToonMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.MeshToonMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MeshToonMaterialSerializer;