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
    var json = BaseSerializer.prototype.toJSON(obj);

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

    // TODO: Object3D反序列化

    return obj;
};

export default Object3DSerializer;