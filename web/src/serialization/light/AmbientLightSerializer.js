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
 * AmbientLightSerializer
 * @author tengge / https://github.com/tengge1
 */
class AmbientLightSerializer extends BaseSerializer {
    toJSON(obj) {
        var json = LightSerializer.prototype.toJSON.call(this, obj);

        json.isAmbientLight = obj.isAmbientLight;

        return json;
    }

    fromJSON(json, parent) {
        var obj = parent === undefined ? new THREE.AmbientLight(json.color, json.intensity) : parent;

        LightSerializer.prototype.fromJSON.call(this, json, obj);

        obj.isAmbientLight = json.isAmbientLight;

        return obj;
    }
}

export default AmbientLightSerializer;