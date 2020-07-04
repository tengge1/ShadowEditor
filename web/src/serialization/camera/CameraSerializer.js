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
import Object3DSerializer from '../core/Object3DSerializer';

/**
 * CameraSerializer
 * @author tengge / https://github.com/tengge1
 */
function CameraSerializer() {
    BaseSerializer.call(this);
}

CameraSerializer.prototype = Object.create(BaseSerializer.prototype);
CameraSerializer.prototype.constructor = CameraSerializer;

CameraSerializer.prototype.filter = function (obj) {
    if (obj instanceof THREE.Camera) {
        return true;
    } else if (obj.metadata && obj.metadata.generator === this.constructor.name) {
        return true;
    } else {
        return false;
    }
};

CameraSerializer.prototype.toJSON = function (obj) {
    return Object3DSerializer.prototype.toJSON.call(this, obj);
};

CameraSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Camera() : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default CameraSerializer;