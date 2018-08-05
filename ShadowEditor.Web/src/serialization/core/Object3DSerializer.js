import BaseSerializer from '../BaseSerializer';

/**
 * Object3D序列化器
 */
function Object3DSerializer() {
    BaseSerializer.call(this);
}

Object3DSerializer.prototype = Object.create(BaseSerializer.prototype);
Object3DSerializer.prototype.constructor = Object3DSerializer;

Object3DSerializer.prototype.filter = function (obj) {
    if (obj instanceof THREE.Object3D) {
        return true;
    } else if (obj.metadata && obj.metadata.generator === this.constructor.name) {
        return true;
    } else {
        return false;
    }
};

Object3DSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.type = obj.type;
    json.uuid = obj.uuid;
    json.castShadow = obj.castShadow;
    json.children = obj.children.map(child => {
        return child.uuid;
    });
    json.frustumCulled = obj.frustumCulled;
    json.matrix = obj.matrix;
    json.matrixAutoUpdate = obj.matrixAutoUpdate;
    json.name = obj.name;
    json.parent = obj.parent == null ? null : obj.parent.uuid;
    json.position = obj.position;
    json.quaternion = {
        x: obj.quaternion.x,
        y: obj.quaternion.y,
        z: obj.quaternion.z,
        w: obj.quaternion.w
    };
    json.receiveShadow = obj.receiveShadow;
    json.renderOrder = obj.renderOrder;
    json.rotation = {
        x: obj.rotation.x,
        y: obj.rotation.y,
        z: obj.rotation.z,
        order: obj.rotation.order
    };
    json.scale = obj.scale;
    json.up = obj.up;
    json.userData = obj.userData;

    return json;
};

Object3DSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? THREE.Object3D : parent;

    BaseSerializer.prototype.fromJSON.call(this, json, obj);

    obj.type = json.type;
    obj.uuid = json.uuid;
    obj.castShadow = json.castShadow;
    // json.children = obj.children.map(child => {
    //     return child.uuid;
    // });
    obj.frustumCulled = json.frustumCulled;
    obj.matrix.copy(json.matrix);
    obj.matrixAutoUpdate = json.matrixAutoUpdate;
    obj.name = json.name;
    // obj.parent = obj.parent == null ? null : obj.parent.uuid;
    obj.position.copy(json.position);
    obj.quaternion.copy(json.quaternion);
    obj.receiveShadow = json.receiveShadow;
    obj.renderOrder = json.renderOrder;
    obj.rotation.set(json.rotation.x, json.rotation.y, json.rotation.z, json.rotation.order);
    obj.scale.copy(json.scale);
    obj.up.copy(json.up);
    Object.assign(obj.userData, json.userData);

    return obj;
};

export default Object3DSerializer;