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

    // 由于每次加载模型，uuid会变。所以要记录保存时的uuid。
    json.userData.children = [];
    this.serializeChildren(obj.children, json.userData.children);

    // 记录修改过的属性
    json.userData.changed = []; // 对应模型的children
    this.serializeChanged(obj, 0, json.userData.changed);
    return json;
};

/**
 * 记录模型内部，每个组件的uuid。
 * @param {Array} children 每个子元素
 * @param {Array} list 数组
 */
ServerObject.prototype.serializeChildren = function (children, list) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];

        let list1 = [];

        if (child.children && child.children.length > 0) {
            this.serializeChildren(child.children, list1);
        }

        list.push({
            uuid: child.uuid,
            children: list1,
        });
    }
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
    let url = json.userData.Url;

    if (url.indexOf(';') > -1) { // 包含多个入口文件
        url = url.split(';').map(n => options.server + n);
    } else {
        url = options.server + url;
    }

    // 将server传递给MMDLoader，以便下载资源
    environment.server = options.server;

    const loader = new ModelLoader();

    return new Promise(resolve => {
        loader.load(url, json.userData, environment).then(obj => {
            if (obj) {
                Object3DSerializer.prototype.fromJSON.call(this, json, obj);

                // 还原原来的uuid（兼容旧版）
                if (Array.isArray(json.userData.children)) {
                    this.parseChildren(obj.children, json.userData.children);
                }

                // 还原原来修改过的属性
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
 * 还原原来的uuid
 * @param {THREE.Object3D} children 部件
 * @param {Array} list 原来的uuid列表
 */
ServerObject.prototype.parseChildren = function (children, list) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];

        if (list[i]) {
            child.uuid = list[i].uuid;
        }

        if (child.children && list[i].children) {
            this.parseChildren(child.children, list[i].children)
        }
    }
};

/**
 * 还原修改过的属性
 * @param {THREE.Object3D} obj 模型或部件
 * @param {Integer} index 索引
 * @param {Array} changed 修改过的属性
 */
ServerObject.prototype.parseChanged = function (obj, index, changed) {
    if (obj && changed[index]) {
        obj.name = changed[index].name;
    }

    if (obj.children && changed[index]) {
        var changed1 = changed[index].children;

        obj.children.forEach((n, i) => {
            this.parseChanged(n, i, changed1);
        });
    }
};

export default ServerObject;