import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';
import ModelLoader from '../../loader/ModelLoader';

/**
 * ServerObject
 * @author tengge / https://github.com/tengge1
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
    return new Promise(resolve => {
        var loader = new ModelLoader(this.app);
        loader.load(this.app.options.server + json.userData.Url).then(obj => {
            if (obj) {
                Object3DSerializer.prototype.fromJSON.call(this, json, obj);
                resolve(obj);
            } else {
                resolve(null);
            }
        });
    });
};

export default ServerObject;