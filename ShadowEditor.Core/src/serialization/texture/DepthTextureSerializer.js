import BaseSerializer from '../BaseSerializer';
import TextureSerializer from './TextureSerializer';

/**
 * DepthTextureSerializer
 * @author tengge / https://github.com/tengge1
 */
function DepthTextureSerializer() {
    BaseSerializer.call(this);
}

DepthTextureSerializer.prototype = Object.create(BaseSerializer.prototype);
DepthTextureSerializer.prototype.constructor = DepthTextureSerializer;

DepthTextureSerializer.prototype.toJSON = function (obj) {
    return TextureSerializer.prototype.toJSON.call(this, obj);
};

DepthTextureSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.DataTexture() : parent;

    TextureSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default DepthTextureSerializer;