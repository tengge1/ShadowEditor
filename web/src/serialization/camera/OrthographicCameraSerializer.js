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
import CameraSerializer from './CameraSerializer';

/**
 * OrthographicCameraSerializer
 * @author tengge / https://github.com/tengge1
 */
function OrthographicCameraSerializer() {
    BaseSerializer.call(this);
}

OrthographicCameraSerializer.prototype = Object.create(BaseSerializer.prototype);
OrthographicCameraSerializer.prototype.constructor = OrthographicCameraSerializer;

OrthographicCameraSerializer.prototype.toJSON = function (obj) {
    var json = CameraSerializer.prototype.toJSON.call(this, obj);

    json.bottom = obj.bottom;
    json.far = obj.far;
    json.left = obj.left;
    json.near = obj.near;
    json.right = obj.right;
    json.top = obj.top;
    json.view = obj.view;
    json.zoom = obj.zoom;

    return json;
};

OrthographicCameraSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.OrthographicCamera() : parent;

    CameraSerializer.prototype.fromJSON.call(this, json, obj);

    obj.bottom = json.bottom;
    obj.far = json.far;
    obj.left = json.left;
    obj.near = json.near;
    obj.right = json.right;
    obj.top = json.top;
    obj.view = json.view;
    obj.zoom = json.zoom;

    return obj;
};

export default OrthographicCameraSerializer;