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
import MaterialSerializer from './MaterialSerializer';

/**
 * SpriteMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
class SpriteMaterialSerializer extends BaseSerializer {
    toJSON(obj) {
        var json = MaterialSerializer.prototype.toJSON.call(this, obj);
        json.isSpriteMaterial = true;
        return json;
    }

    fromJSON(json, parent, server) {
        var obj = parent === undefined ? new THREE.SpriteMaterial() : parent;

        MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

        return obj;
    }
}

export default SpriteMaterialSerializer;