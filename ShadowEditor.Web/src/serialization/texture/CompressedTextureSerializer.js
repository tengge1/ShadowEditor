import BaseSerializer from '../BaseSerializer';
import TextureSerializer from './TextureSerializer';

/**
 * CompressedTextureSerializer
 */
function CompressedTextureSerializer() {
    BaseSerializer.call(this);
}

CompressedTextureSerializer.prototype = Object.create(BaseSerializer.prototype);
CompressedTextureSerializer.prototype.constructor = CompressedTextureSerializer;

CompressedTextureSerializer.prototype.toJSON = function (obj) {
    return TextureSerializer.prototype.toJSON.call(this, obj);
};

CompressedTextureSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.CompressedTexture() : parent;

    TextureSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default CompressedTextureSerializer;