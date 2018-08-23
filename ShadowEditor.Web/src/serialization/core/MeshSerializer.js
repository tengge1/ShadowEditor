import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

import GeometriesSerializer from '../geometry/GeometriesSerializer';
import MaterialsSerializer from '../material/MaterialsSerializer';

/**
 * MeshSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function MeshSerializer(app) {
    BaseSerializer.call(this, app);
}

MeshSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshSerializer.prototype.constructor = MeshSerializer;

MeshSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.drawMode = obj.drawMode;
    json.geometry = (new GeometriesSerializer(this.app)).toJSON(obj.geometry);
    json.material = (new MaterialsSerializer(this.app)).toJSON(obj.material);

    return json;
};

MeshSerializer.prototype.fromJSON = function (json, parent) {
    // 子类创建模型
    if (parent !== undefined) {
        var obj = parent;
        Object3DSerializer.prototype.fromJSON.call(this, json, obj);
        return obj;
    }

    // 其他模型
    if (json.geometry == null) {
        console.warn(`MeshSerializer: ${json.name} json.geometry未定义。`);
        return null;
    }
    if (json.material == null) {
        console.warn(`MeshSerializer: ${json.name} json.material未定义。`);
        return null;
    }

    var geometry = (new GeometriesSerializer(this.app)).fromJSON(json.geometry);
    var material = (new MaterialsSerializer(this.app)).fromJSON(json.material);

    var obj = new THREE.Mesh(geometry, material);

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MeshSerializer;