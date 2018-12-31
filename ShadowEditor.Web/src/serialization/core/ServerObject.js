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

    // 清理无用材质
    if (obj.userData.materials) {
        Object.keys(obj.userData.materials).forEach(n => {
            if (n !== obj.material.uuid) {
                delete obj.userData.materials[n];
            }
        });
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
    if (json.userData.materials) {
        Object.values(json.userData.materials).forEach(n => {
            this.parseMaterial(n, obj);
        });
    }
};

ServerObject.prototype.parseMaterial = function (json, obj) {
    if (obj.material.uuid === json.uuid) {
        var material = obj.material;
        obj.material = (new MaterialsSerializer()).fromJSON(json);
        obj.material.needsUpdate = true;
        material.dispose();
    }
};

export default ServerObject;