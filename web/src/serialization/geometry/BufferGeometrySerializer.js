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
 * BufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function BufferGeometrySerializer() {
    BaseSerializer.call(this);
}

BufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
BufferGeometrySerializer.prototype.constructor = BufferGeometrySerializer;

BufferGeometrySerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    // json.attributes太大，不要保存在Mongo
    // json.attributes = obj.attributes;
    json.boundingBox = obj.boundingBox;
    json.boundingSphere = obj.boundingSphere;
    json.drawRange = obj.drawRange;
    json.groups = obj.groups;
    // json.index = obj.index;
    json.morphAttributes = obj.morphAttributes;
    json.name = obj.name;
    json.parameters = obj.parameters;
    json.type = obj.type;
    json.userData = obj.userData;
    json.uuid = obj.uuid;

    return json;
};

BufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.BufferGeometry() : parent;

    BaseSerializer.prototype.fromJSON.call(this, json, obj);

    // obj.attributes = json.attributes;
    // if (json.boundingBox) {
    //     obj.boundingBox = new THREE.Box3(
    //         new THREE.Vector3().copy(json.boundingBox.min),
    //         new THREE.Vector3().copy(json.boundingBox.max),
    //     );
    // }

    // if (json.boundingSphere) {
    //     obj.boundingSphere = new THREE.Sphere(
    //         new THREE.Vector3().copy(json.boundingSphere.center),
    //         json.boundingSphere.radius
    //     );
    // }

    // if (json.drawRange) {
    //     obj.drawRange.start = json.drawRange.start;
    //     obj.drawRange.count = json.drawRange.count === null ? Infinity : json.drawRange.count;
    // }

    obj.groups = json.groups;
    // obj.index = json.index;
    obj.morphAttributes = json.morphAttributes;
    obj.name = json.name;
    obj.parameters = json.parameters;
    obj.type = json.type;
    obj.userData = json.userData;
    obj.uuid = json.uuid;

    return obj;
};

export default BufferGeometrySerializer;