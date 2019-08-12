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

    // 模型被调整了层次和顺序，所以要记录调整过的uuid。
    json.userData.children = [];
    this.serializeChildren(obj.children, json.userData.children);

    // 记录修改过的名称
    json.userData.changed = []; // 对应模型的children
    this.serializeChanged(obj, 0, json.userData.changed);

    return json;
};

/**
 * 记录模型内部，调整过的每个组件的uuid。
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

                // 还原原始模型的uuid
                if (Array.isArray(json.userData._children)) {
                    this.parseChildren(obj.children, json.userData._children);
                }

                // 还原原来修改过的模型
                this.revertObject(obj, environment.parts);

                // 还原原来修改过的名称
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
 * 还原原始模型的uuid。
 * @param {THREE.Object3D} children 部件
 * @param {Array} list 原始的uuid列表
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

/**
 * 还原调整过顺序的原始模型。
 * @param {THREE.Object3D} obj 服务端模型
 * @param {Array} parts 反序列化后的模型组件
 */
ServerObject.prototype.revertObject = function (obj, parts = []) {
    let list = obj.userData.children;

    if (!Array.isArray(list) || list.length === 0) {
        return;
    }

    let children = [];
    this.traverseChildren(obj, children);
    this.revertLayer(obj, list, children, parts);
};

/**
 * 将模型所有子元素展开成一维数组
 * @param {THREE.Object} obj 服务端模型
 * @param {Array} list 模型子组件列表
 */
ServerObject.prototype.traverseChildren = function (obj, list) {
    if (!Array.isArray(obj.children) || obj.children.length === 0) {
        return;
    }

    while (obj.children.length) {
        let child = obj.children[0];

        if (child.parent) {
            child.parent.remove(child);
        }

        list.push(child);
        this.traverseChildren(child, list);
    }
};

/**
 * 还原服务端模型原来的层次结构
 * @param {*} obj 
 * @param {*} list 
 * @param {*} children 
 * @param {*} parts 
 */
ServerObject.prototype.revertLayer = function (obj, list, children, parts) {
    for (let i = 0; i < list.length; i++) {
        let item = list[i];

        const child1 = children.filter(n => n.uuid === item.uuid)[0];
        const child2 = parts.filter(n => n.uuid === item.uuid)[0];

        let child = null;

        if (child1) {
            obj.add(child1);

            child = child1;

            if (child2) {
                // TODO: 服务端原始模型组件，需要复制反序列化后的组件的属性。
                child1.name = child2.name;
                if (child1.position && child2.position) {
                    child1.position.copy(child2.position);
                }
                if (child1.rotation && child2.rotation) {
                    child1.rotation.copy(child2.rotation);
                }
                if (child1.scale && child2.scale) {
                    child1.scale.copy(child2.scale);
                }
                if (child1.material && child2.material) {
                    child1.material = child2.material;
                }
            }
        } else if (child2) {
            obj.add(child2);

            child = child2;
        } else {
            console.warn(`ServerObject: no object with uuid ${item.uuid}.`);
        }

        if (child && Array.isArray(item.children) && item.children.length > 0) {
            this.revertLayer(child, item.children, children, parts);
        }
    }
};

export default ServerObject;