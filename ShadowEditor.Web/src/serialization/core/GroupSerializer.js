import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

/**
 * GroupSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function GroupSerializer(app) {
    BaseSerializer.call(this, app);
}

GroupSerializer.prototype = Object.create(BaseSerializer.prototype);
GroupSerializer.prototype.constructor = GroupSerializer;

GroupSerializer.prototype.toJSON = function (obj) {
    return Object3DSerializer.prototype.toJSON.call(this, obj);
};

GroupSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Group() : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default GroupSerializer;