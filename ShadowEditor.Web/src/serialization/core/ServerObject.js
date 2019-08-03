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

    // 记录修改过的属性
    json.userData.changed = []; // 对应模型的children
    this.serializeChanged(obj, 0, json.userData.changed);
    return json;
};

/**
 * 序列化模型修改过的属性
 * @param {THREE.Object3D} obj 模型或部件
 * @param {Integer} index 索引
 * @param {Object} changed 修改过的属性
 */
ServerObject.prototype.serializeChanged = function (obj, index, changed) {
    changed[index] = {
        name: obj.name,
    };

    if (obj.children) {
        changed[index].children = [];

        obj.children.forEach((n, i) => {
            this.serializeChanged(n, i, changed[index].children);
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

    // 将server传递给MMDLoader，以便下载资源
    environment.server = options.server;

    return new Promise(resolve => {
        var loader = new ModelLoader();
        loader.load(url, json.userData, environment).then(obj => {
            if (obj) {
                Object3DSerializer.prototype.fromJSON.call(this, json, obj);
                if (json.userData.changed) {
                    this.parseChanged(obj, 0, json.userData.changed);
                }
                resolve(obj);
            } else {
                resolve(null);
            }
        });
    });
};

/**
 * 还原修改过的属性
 * @param {THREE.Object3D} obj 模型或部件
 * @param {Integer} index 索引
 * @param {Object} changed 修改过的属性
 */
ServerObject.prototype.parseChanged = function (obj, index, changed) {
    obj.name = changed[index].name;

    if (obj.children) {
        var changed1 = changed[index].children;

        obj.children.forEach((n, i) => {
            this.parseChanged(n, i, changed1);
        });
    }
};

export default ServerObject;