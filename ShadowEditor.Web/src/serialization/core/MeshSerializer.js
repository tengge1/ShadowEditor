import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

import GeometriesSerializer from '../geometry/GeometriesSerializer';
import MaterialsSerializer from '../material/MaterialsSerializer';

/**
 * Mesh序列化器
 */
function MeshSerializer() {
    BaseSerializer.call(this);
}

MeshSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshSerializer.prototype.constructor = MeshSerializer;

MeshSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.drawMode = obj.drawMode;

    if (obj.userData.Type === 'Model') { // 服务端模型
        json.userData = Object.assign({}, obj.userData);
    } else {
        json.geometry = (new GeometriesSerializer()).toJSON(obj.geometry);
        json.material = (new MaterialsSerializer()).toJSON(obj.material);
    }

    return json;
};

MeshSerializer.prototype.fromJSON = function (json, parent) {
    // 子类创建模型
    if (parent !== undefined) {
        var obj = parent;
        Object3DSerializer.prototype.fromJSON.call(this, json, obj);
        return obj;
    }

    // 服务端模型
    if (json.userData && json.userData.Type === 'Model') {
        var format = json.userData.Format;
        return new Promise((resolve, reject) => {
            if (format === 'Binary') {
                var loader = new THREE.BinaryLoader();

                loader.load(location.origin + '/' + json.userData.Model, (geometry, materials) => {
                    var mesh = new THREE.Mesh(geometry, materials);

                    Object3DSerializer.prototype.fromJSON.call(this, json, mesh);

                    resolve(mesh);
                });
            } else {
                console.warn(`MeshSerializer: 未知模型类型${format}。`);
                resolve(null);
            }
        });
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

    var geometry = (new GeometriesSerializer()).fromJSON(json.geometry);
    var material = (new MaterialsSerializer()).fromJSON(json.material);

    var obj = new THREE.Mesh(geometry, material);

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MeshSerializer;