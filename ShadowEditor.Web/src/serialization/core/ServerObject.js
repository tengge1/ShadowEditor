import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';
import ModelLoader from '../../loader/ModelLoader';
import MaterialsSerializer from '../material/MaterialsSerializer';

/**
 * ServerObject
 * @author tengge / https://github.com/tengge1
 */
function ServerObject() {
    BaseSerializer.call(this);
}

ServerObject.prototype = Object.create(BaseSerializer.prototype);
ServerObject.prototype.constructor = ServerObject;

ServerObject.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);
    json.userData = Object.assign({}, obj.userData);
    delete json.userData.model;
    delete json.userData.obj; // 以后下载对象缓存统一改为obj
    delete json.userData.root; // 模型根节点
    delete json.userData.helper;

    // 记录材质
    json.userData.materials = [];

    if (obj.material && Array.isArray(obj.material)) { // 多材质
        obj.material.forEach(n => {
            if (n) {
                var json1 = (new MaterialsSerializer()).toJSON(n);
                json.userData.materials.push(json1);
            } else {
                json.userData.materials.push(null);
            }
        });
    } else if (obj.material) { // 单材质
        var json1 = (new MaterialsSerializer()).toJSON(obj.material);
        json.userData.materials.push(json1);
    }

    return json;
};

ServerObject.prototype.fromJSON = function (json, options, environment) {
    var url = json.userData.Url;

    if (url.indexOf(';') > -1) { // 包含多个入口文件
        url = url.split(';').map(n => options.server + n);
    } else {
        url = options.server + url;
    }

    return new Promise(resolve => {
        var loader = new ModelLoader();
        loader.load(url, json.userData, environment).then(obj => {
            if (obj) {
                Object3DSerializer.prototype.fromJSON.call(this, json, obj);
                this.parseMaterials(json, obj);
                resolve(obj);
            } else {
                resolve(null);
            }
        });
    });
};

ServerObject.prototype.parseMaterials = function (json, obj) {
    var materials = json.userData.materials;

    if (materials && Array.isArray(materials)) {
        if (Array.isArray(obj.material)) { // 多材质
            for (var i = 0; i < obj.material.length; i++) {
                if (materials[i]) {
                    var material = obj.material[i];
                    obj.material[i] = (new MaterialsSerializer()).fromJSON(materials[i]);
                    obj.material[i].needsUpdate = true;
                    material.dispose();
                }
            }
        } else if (obj.material) { // 单材质
            if (materials[0]) {
                var material = obj.material;
                obj.material = (new MaterialsSerializer()).fromJSON(materials[0]);
                obj.material.needsUpdate = true;
                material.dispose();
            }
        }
    }
};

export default ServerObject;