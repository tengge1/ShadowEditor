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
import CanvasTextureSerializer from './CanvasTextureSerializer';
import CompressedTextureSerializer from './CompressedTextureSerializer';
import CubeTextureSerializer from './CubeTextureSerializer';
import DataTextureSerializer from './DataTextureSerializer';
import DepthTextureSerializer from './DepthTextureSerializer';
import VideoTextureSerializer from './VideoTextureSerializer';

var Serializers = {
    'CanvasTexture': CanvasTextureSerializer,
    'CompressedTexture': CompressedTextureSerializer,
    'CubeTexture': CubeTextureSerializer,
    'DataTexture': DataTextureSerializer,
    'DepthTexture': DepthTextureSerializer,
    'VideoTexture': VideoTextureSerializer,
    'Texture': TextureSerializer
};

/**
 * TexturesSerializer
 * @author tengge / https://github.com/tengge1
 */
function TexturesSerializer() {
    BaseSerializer.call(this);
}

TexturesSerializer.prototype = Object.create(BaseSerializer.prototype);
TexturesSerializer.prototype.constructor = TexturesSerializer;

TexturesSerializer.prototype.toJSON = function (obj) {
    var serializer = Serializers[obj.constructor.name];

    if (serializer === undefined) {
        console.warn(`TexturesSerializer: No serializer with ${obj.type}.`);
        return null;
    }

    return new serializer().toJSON(obj);
};

TexturesSerializer.prototype.fromJSON = function (json, parent, server) {
    var generator = json.metadata.generator;

    var serializer = Serializers[generator.replace('Serializer', '')];

    if (serializer === undefined) {
        console.warn(`TexturesSerializer: No deserializer with ${generator}.`);
        return null;
    }

    return new serializer().fromJSON(json, parent, server);
};

export default TexturesSerializer;