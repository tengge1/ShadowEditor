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
class DirectionalLightShadowSerializer extends BaseSerializer {
    toJSON(obj) {
        var json = LightShadowSerializer.prototype.toJSON.call(this, obj);

        json.isDirectionalLightShadow = obj.isDirectionalLightShadow;

        return json;
    }

    fromJSON(json, parent) {
        var obj = parent === undefined ? new THREE.DirectionalLightShadow() : parent;

        LightShadowSerializer.prototype.fromJSON.call(this, json, obj);

        return obj;
    }
}

export default DirectionalLightShadowSerializer;