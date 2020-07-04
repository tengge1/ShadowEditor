/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseSerializer from '../BaseSerializer';

/**
 * Object3DSerializer
 * @author tengge / https://github.com/tengge1
 */
function Object3DSerializer() {
    BaseSerializer.call(this);
}

Object3DSerializer.prototype = Object.create(BaseSerializer.prototype);
Object3DSerializer.prototype.constructor = Object3DSerializer;

Object3DSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.castShadow = obj.castShadow;
    json.children = obj.children.map(child => {
        return child.uuid;
    });
    json.frustumCulled = obj.frustumCulled;
    json.layers = obj.layers;
    json.matrixAutoUpdate = obj.matrixAutoUpdate;
    json.matrixWorldNeedsUpdate = obj.matrixWorldNeedsUpdate;
    json.modelViewMatrix = obj.modelViewMatrix;
    json.name = obj.name;
    json.parent = !obj.parent ? null : obj.parent.uuid;
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
    json.type = obj.type;
    json.up = obj.up;

    json.userData = {};

    Object.assign(json.userData, obj.userData);

    delete json.userData.helper;

    json.uuid = obj.uuid;
    json.visible = obj.visible;
    json.isObject3D = obj.isObject3D;

    return json;
};

Object3DSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Object3D() : parent;

    BaseSerializer.prototype.fromJSON.call(this, json, obj);

    obj.castShadow = json.castShadow;
    obj.frustumCulled = json.frustumCulled;
    obj.type = json.type;
    obj.uuid = json.uuid;

    obj.matrixAutoUpdate = json.matrixAutoUpdate;
    obj.name = json.name;
    obj.position.copy(json.position);
    obj.quaternion.copy(json.quaternion);
    obj.receiveShadow = json.receiveShadow;
    obj.renderOrder = json.renderOrder;
    obj.rotation.set(json.rotation.x, json.rotation.y, json.rotation.z, json.rotation.order);
    obj.scale.copy(json.scale);
    obj.up.copy(json.up);
    obj.visible = json.visible;

    for (var i in json.userData) {
        if (json.userData[i]) {
            obj.userData[i] = json.userData[i];
        }
    }

    return obj;
};

export default Object3DSerializer;