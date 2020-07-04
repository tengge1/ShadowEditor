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
import LightShadowSerializer from './LightShadowSerializer';

/**
 * DirectionalLightShadowSerializer
 * @author tengge / https://github.com/tengge1
 */
function DirectionalLightShadowSerializer() {
    BaseSerializer.call(this);
}

DirectionalLightShadowSerializer.prototype = Object.create(BaseSerializer.prototype);
DirectionalLightShadowSerializer.prototype.constructor = DirectionalLightShadowSerializer;

DirectionalLightShadowSerializer.prototype.toJSON = function (obj) {
    var json = LightShadowSerializer.prototype.toJSON.call(this, obj);

    json.isDirectionalLightShadow = obj.isDirectionalLightShadow;

    return json;
};

DirectionalLightShadowSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.DirectionalLightShadow() : parent;

    LightShadowSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default DirectionalLightShadowSerializer;