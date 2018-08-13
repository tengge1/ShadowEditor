import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

/**
 * ServerObject
 * @param {*} app 
 */
function ServerObject(app) {
    BaseSerializer.call(this, app);
}

ServerObject.prototype = Object.create(BaseSerializer.prototype);
ServerObject.prototype.constructor = ServerObject;

ServerObject.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);
    json.userData = Object.assign({}, obj.userData);
    return json;
};

ServerObject.prototype.fromJSON = function (json) {
    var type = json.userData.Type;
    return new Promise((resolve, reject) => {
        if (type === 'amf') {
            var loader = new THREE.AMFLoader();
            loader.load(this.app.options.server + json.userData.Url, (group) => {
                Object3DSerializer.prototype.fromJSON.call(this, json, group);
                resolve(group);
            });
        } else if (type === 'binary') {
            var loader = new THREE.BinaryLoader();

            loader.load(this.app.options.server + json.userData.Url, (geometry, materials) => {
                var mesh = new THREE.Mesh(geometry, materials);

                Object3DSerializer.prototype.fromJSON.call(this, json, mesh);
                resolve(mesh);
            });
        } else {
            console.warn(`MeshSerializer: 未知模型类型${type}。`);
            resolve(null);
        }
    });

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ServerObject;