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
import LightShadowsSerializer from './shadow/LightShadowsSerializer';

/**
 * LightSerializer
 * @author tengge / https://github.com/tengge1
 */
function LightSerializer() {
    BaseSerializer.call(this);
}

LightSerializer.prototype = Object.create(BaseSerializer.prototype);
LightSerializer.prototype.constructor = LightSerializer;

LightSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.color = obj.color;
    json.intensity = obj.intensity;
    json.isLight = obj.isLight;
    json.shadow = !obj.shadow ? null : new LightShadowsSerializer().toJSON(obj.shadow);

    return json;
};

LightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Light() : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.color = new THREE.Color(json.color);
    obj.intensity = json.intensity;
    obj.isLight = json.isLight;

    if (json.shadow) {
        obj.shadow = new LightShadowsSerializer().fromJSON(json.shadow);
    }

    return obj;
};

export default LightSerializer;