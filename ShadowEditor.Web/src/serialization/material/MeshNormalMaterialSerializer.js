import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshNormalMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function MeshNormalMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshNormalMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshNormalMaterialSerializer.prototype.constructor = MeshNormalMaterialSerializer;

MeshNormalMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshNormalMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.MeshNormalMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MeshNormalMaterialSerializer;