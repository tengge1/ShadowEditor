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
import TextureSerializer from './TextureSerializer';

/**
 * CompressedTextureSerializer
 * @author tengge / https://github.com/tengge1
 */
class CompressedTextureSerializer extends BaseSerializer {
    toJSON(obj) {
        return TextureSerializer.prototype.toJSON.call(this, obj);
    }

    fromJSON(json, parent, server) {
        var obj = parent === undefined ? new THREE.CompressedTexture() : parent;

        TextureSerializer.prototype.fromJSON.call(this, json, obj, server);

        return obj;
    }
}

export default CompressedTextureSerializer;