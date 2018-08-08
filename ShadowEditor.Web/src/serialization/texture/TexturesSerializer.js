import BaseSerializer from '../BaseSerializer';

import TextureSerializer from './TextureSerializer';
import CanvasTextureSerializer from './CanvasTextureSerializer';
import CompressedTextureSerializer from './CompressedTextureSerializer';
import CubeTextureSerializer from './CubeTextureSerializer';
import DataTextureSerializer from './DataTextureSerializer';
import DepthTextureSerializer from './DepthTextureSerializer';
import VideoTextureSerializer from './VideoTextureSerializer';

var Serializers = {
    'CanvasTextureSerializer': CanvasTextureSerializer,
    'CompressedTextureSerializer': CompressedTextureSerializer,
    'CubeTextureSerializer': CubeTextureSerializer,
    'DataTextureSerializer': DataTextureSerializer,
    'DepthTextureSerializer': DepthTextureSerializer,
    'VideoTextureSerializer': VideoTextureSerializer
};

/**
 * TexturesSerializer
 */
function TexturesSerializer() {
    BaseSerializer.call(this);
}

TexturesSerializer.prototype = Object.create(BaseSerializer.prototype);
TexturesSerializer.prototype.constructor = TexturesSerializer;

TexturesSerializer.prototype.toJSON = function (obj) {
    if (obj == null) {
        return null;
    }

    var json = null;

    if (obj instanceof THREE.CanvasTexture) {
        json = (new CanvasTextureSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.CompressedTexture) {
        json = (new CompressedTextureSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.CubeTexture) {
        json = (new CubeTextureSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.DataTexture) {
        json = (new DataTextureSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.DepthTexture) {
        json = (new DepthTextureSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.VideoTexture) {
        json = (new VideoTextureSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.Texture) {
        json = (new TextureSerializer()).toJSON(obj);
    } else {
        console.warn(`TexturesSerializer: 不支持的纹理类型${obj.type}。`);
    }

    return json;
};

TexturesSerializer.prototype.fromJSON = function (json) {
    var generator = json.metadata.generator;

    if (Serializers[generator] === undefined) {
        console.warn(`TexturesSerializer: 不存在 ${generator} 的反序列化器`);
        return null;
    }

    return (new (Serializers[generator])()).fromJSON(json);
};

export default TexturesSerializer;