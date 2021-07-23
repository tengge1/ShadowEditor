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
 * DirectionalLightSerializer
 * @author tengge / https://github.com/tengge1
 */
class DirectionalLightSerializer extends BaseSerializer {
    toJSON(obj) {
        var json = LightSerializer.prototype.toJSON.call(this, obj);

        json.isDirectionalLight = obj.isDirectionalLight;

        return json;
    }

    fromJSON(json, parent) {
        var obj = parent === undefined ? new THREE.DirectionalLight(json.color, json.intensity) : parent;

        LightSerializer.prototype.fromJSON.call(this, json, obj);

        obj.isDirectionalLight = json.isDirectionalLight;

        return obj;
    }
}

export default DirectionalLightSerializer;