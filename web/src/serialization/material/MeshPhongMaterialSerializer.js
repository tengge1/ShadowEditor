import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshPhongMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function MeshPhongMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshPhongMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshPhongMaterialSerializer.prototype.constructor = MeshPhongMaterialSerializer;

MeshPhongMaterialSerializer.prototype.toJSON = function (obj) {
    let json = MaterialSerializer.prototype.toJSON.call(this, obj);

    json.specular = obj.specular;
    json.shininess = obj.shininess;

    return json;
};

MeshPhongMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.MeshPhongMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    obj.specular = new THREE.Color(json.specular);
    obj.shininess = json.shininess;

    return obj;
};

export default MeshPhongMaterialSerializer;