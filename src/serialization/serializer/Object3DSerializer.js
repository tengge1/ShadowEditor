import BaseSerializer from '../BaseSerializer';

/**
 * Object3D串行化
 */
function Object3DSerializer() {
    BaseSerializer.call(this);
}

Object3DSerializer.prototype = Object.create(BaseSerializer.prototype);
Object3DSerializer.prototype.constructor = Object3DSerializer;

Object3DSerializer.prototype.toJSON = function (obj) {
    var obj = BaseSerializer.prototype.toJSON(obj);

    obj.type = obj.type;
    obj.uuid = obj.uuid;
    obj.castShadow = obj.castShadow;
    obj.children = obj.children.map(function (child) {
        return child.uuid;
    });
    obj.frustumCulled = obj.frustumCulled;
    obj.matrix = obj.matrix;
    obj.matrixAutoUpdate = obj.matrixAutoUpdate;
    obj.name = obj.name;
    obj.parent = obj.parent == null ? null : obj.parent.uuid;
    obj.position = obj.position;
    obj.quaternion = {
        x: obj.quaternion.x,
        y: obj.quaternion.y,
        z: obj.quaternion.z,
        w: obj.quaternion.w
    };
    obj.receiveShadow = obj.receiveShadow;
    obj.renderOrder = obj.renderOrder;
    obj.rotation = {
        x: obj.rotation.x,
        y: obj.rotation.y,
        z: obj.rotation.z,
        order: obj.rotation.order
    };
    obj.scale = obj.scale;
    obj.up = obj.up;
    obj.userData = obj.userData;

    return obj;
};

Object3DSerializer.prototype.fromJSON = function (json) {

};

export default Object3DSerializer;