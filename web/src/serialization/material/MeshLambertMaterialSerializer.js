import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshLambertMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function MeshLambertMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshLambertMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshLambertMaterialSerializer.prototype.constructor = MeshLambertMaterialSerializer;

MeshLambertMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshLambertMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.MeshLambertMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default MeshLambertMaterialSerializer;