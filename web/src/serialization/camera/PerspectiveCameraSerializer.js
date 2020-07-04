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
 * PerspectiveCameraSerializer
 * @author tengge / https://github.com/tengge1
 */
function PerspectiveCameraSerializer() {
    BaseSerializer.call(this);
}

PerspectiveCameraSerializer.prototype = Object.create(BaseSerializer.prototype);
PerspectiveCameraSerializer.prototype.constructor = PerspectiveCameraSerializer;

PerspectiveCameraSerializer.prototype.toJSON = function (obj) {
    var json = CameraSerializer.prototype.toJSON.call(this, obj);

    json.aspect = obj.aspect;
    json.far = obj.far;
    json.filmGauge = obj.filmGauge;
    json.filmOffset = obj.filmOffset;
    json.focus = obj.focus;
    json.fov = obj.fov;
    json.near = obj.near;
    json.view = obj.view;
    json.zoom = obj.zoom;

    return json;
};

PerspectiveCameraSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.PerspectiveCamera() : parent;

    CameraSerializer.prototype.fromJSON.call(this, json, obj);

    obj.aspect = json.aspect;
    obj.far = json.far;
    obj.filmGauge = json.filmGauge;
    obj.filmOffset = json.filmOffset;
    obj.focus = json.focus;
    obj.fov = json.fov;
    obj.near = json.near;
    obj.view = json.view;
    obj.zoom = json.zoom;

    return obj;
};

export default PerspectiveCameraSerializer;