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
 * SpotLightSerializer
 * @author tengge / https://github.com/tengge1
 */
function SpotLightSerializer() {
    BaseSerializer.call(this);
}

SpotLightSerializer.prototype = Object.create(BaseSerializer.prototype);
SpotLightSerializer.prototype.constructor = SpotLightSerializer;

SpotLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.isSpotLight = obj.isSpotLight;
    json.distance = obj.distance;
    json.angle = obj.angle;
    json.penumbra = obj.penumbra;
    json.decay = obj.decay;

    return json;
};

SpotLightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.SpotLight(
        json.color,
        json.intensity,
        json.distance,
        json.angle,
        json.penumbra,
        json.decay) : parent;

    LightSerializer.prototype.fromJSON.call(this, json, obj);

    obj.isSpotLight = json.isSpotLight;
    obj.distance = json.distance;
    obj.angle = json.angle;
    obj.penumbra = json.penumbra;
    obj.decay = json.decay;

    return obj;
};

export default SpotLightSerializer;