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

/**
 * WebGLShadowMapSerializer
 * @author tengge / https://github.com/tengge1
 */
class WebGLShadowMapSerializer extends BaseSerializer {
    toJSON(obj) {
        var json = BaseSerializer.prototype.toJSON.call(this, obj);

        json.autoUpdate = obj.autoUpdate;
        json.enabled = obj.enabled;
        json.needsUpdate = obj.needsUpdate;
        json.type = obj.type;

        return json;
    }

    fromJSON(json, parent) {
        if (parent === undefined) {
            console.warn(`WebGLShadowMapSerializer: parent is empty.`);
            return null;
        }

        var obj = parent;

        obj.autoUpdate = json.autoUpdate;
        obj.enabled = json.enabled;
        obj.needsUpdate = true;
        obj.type = json.type;

        return obj;
    }
}

export default WebGLShadowMapSerializer;