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
import Object3DSerializer from './Object3DSerializer';

/**
 * GroupSerializer
 * @author tengge / https://github.com/tengge1
 */
function GroupSerializer() {
    BaseSerializer.call(this);
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