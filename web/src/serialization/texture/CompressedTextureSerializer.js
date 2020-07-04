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
function CompressedTextureSerializer() {
    BaseSerializer.call(this);
}

CompressedTextureSerializer.prototype = Object.create(BaseSerializer.prototype);
CompressedTextureSerializer.prototype.constructor = CompressedTextureSerializer;

CompressedTextureSerializer.prototype.toJSON = function (obj) {
    return TextureSerializer.prototype.toJSON.call(this, obj);
};

CompressedTextureSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.CompressedTexture() : parent;

    TextureSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default CompressedTextureSerializer;