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
import LightSerializer from './LightSerializer';

/**
 * RectAreaLightSerializer
 * @author tengge / https://github.com/tengge1
 */
function RectAreaLightSerializer() {
    BaseSerializer.call(this);
}

RectAreaLightSerializer.prototype = Object.create(BaseSerializer.prototype);
RectAreaLightSerializer.prototype.constructor = RectAreaLightSerializer;

RectAreaLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.width = obj.width;
    json.height = obj.height;

    return json;
};

RectAreaLightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.RectAreaLight(json.color, json.intensity, json.width, json.height) : parent;

    LightSerializer.prototype.fromJSON.call(this, json, obj);

    obj.isRectAreaLight = true;

    return obj;
};

export default RectAreaLightSerializer;