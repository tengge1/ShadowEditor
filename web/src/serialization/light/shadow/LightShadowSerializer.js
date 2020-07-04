/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseSerializer from '../../BaseSerializer';
import CamerasSerializer from '../../camera/CamerasSerializer';
import WebGLRenderTargetSerializer from '../../core/WebGLRenderTargetSerializer';

/**
 * LightShadowSerializer
 * @author tengge / https://github.com/tengge1
 */
function LightShadowSerializer() {
    BaseSerializer.call(this);
}

LightShadowSerializer.prototype = Object.create(BaseSerializer.prototype);
LightShadowSerializer.prototype.constructor = LightShadowSerializer;

LightShadowSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.bias = obj.bias;
    json.camera = new CamerasSerializer().toJSON(obj.camera);
    json.map = !obj.map ? null : new WebGLRenderTargetSerializer().toJSON(obj.map);
    json.mapSize = obj.mapSize;
    json.radius = obj.radius;

    return json;
};

LightShadowSerializer.prototype.fromJSON = function (json, parent) {
    var camera = new CamerasSerializer().fromJSON(json.camera);

    var obj = parent === undefined ? new THREE.LightShadow(camera) : parent;

    obj.bias = json.bias;
    obj.camera.copy(camera);
    obj.mapSize.copy(json.mapSize);
    obj.radius = json.radius;

    return obj;
};

export default LightShadowSerializer;