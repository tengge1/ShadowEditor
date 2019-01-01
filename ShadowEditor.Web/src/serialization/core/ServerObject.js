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
    this.serializeMaterials(obj, '', json.userData.materials);
    return json;
};

/**
 * 记录服务端模型所有材质
 * @param {*} obj 
 * @param {*} path 
 * @param {*} materials 
 */
ServerObject.prototype.serializeMaterials = function (obj, path, materials) {
    if (obj.material && Array.isArray(obj.material)) { // 多材质
        obj.material.forEach((n, i) => {
            var json = (new MaterialsSerializer()).toJSON(n);
            json._path = `${path}${i}`;
            materials.push(json);
        });
    } else if (obj.material) { // 单材质
        var json = (new MaterialsSerializer()).toJSON(obj.material);
        json._path = `${path}$`;
        materials.push(json);
    }

    if (obj.children) {
        obj.children.forEach((n, i) => {
            this.serializeMaterials(n, `${path}${i}`, materials);
        });
    }
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
                this.parseMaterials(obj, '', json.userData.materials);
                resolve(obj);
            } else {
                resolve(null);
            }
        });
    });
};

/**
 * 还原服务端模型所有材质
 * @param {*} obj 
 * @param {*} path 
 * @param {*} materials 
 */
ServerObject.prototype.parseMaterials = function (obj, path, materials) {
    if (obj.material && Array.isArray(obj.material)) { // 多材质
        obj.material.forEach((n, i) => {
            var json = materials.filter(n => n._path === `${path}${i}`)[0];
            if (json) {
                var material = obj.material[i];
                obj.material[i] = (new MaterialsSerializer()).fromJSON(json);
                obj.material[i].needsUpdate = true;
                material.dispose();
            }
        });
    } else if (obj.material) { // 单材质
        var json = materials.filter(n => n._path === `${path}$`)[0];
        if (json) {
            var material = obj.material;
            obj.material = (new MaterialsSerializer()).fromJSON(json);
            obj.material.needsUpdate = true;
            material.dispose();
        }
    }

    if (obj.children) {
        obj.children.forEach((n, i) => {
            this.parseMaterials(n, `${path}${i}`, materials);
        });
    }
};

export default ServerObject;