import BaseSerialization from './BaseSerialization';

/**
 * Object3D串行化
 */
function Object3DSerialization() {

}

Object3DSerialization.prototype = Object.create();
Object3DSerialization.prototype.constructor = Object3DSerialization;

Object3DSerialization.prototype.toJSON = function (obj) {
    return {
        type: obj.type,
        uuid: obj.uuid,
        castShadow: obj.castShadow,
        children: obj.children.map(function (child) {
            return child.uuid;
        }),
        frustumCulled: obj.frustumCulled,
        matrix: obj.matrix,
        matrixAutoUpdate: obj.matrixAutoUpdate,
        name: obj.name,
        parent: obj.parent == null ? null : obj.parent.uuid,
        position: obj.position,
        quaternion: {
            x: obj.quaternion.x,
            y: obj.quaternion.y,
            z: obj.quaternion.z,
            w: obj.quaternion.w
        },
        receiveShadow: obj.receiveShadow,
        renderOrder: obj.renderOrder,
        rotation: {
            x: obj.rotation.x,
            y: obj.rotation.y,
            z: obj.rotation.z,
            order: obj.rotation.order
        },
        scale: obj.scale,
        up: obj.up,
        userData: obj.userData
    };
};

Object3DSerialization.prototype.fromJSON = function (json) {

};

export default Object3DSerialization;