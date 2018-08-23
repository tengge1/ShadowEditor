import BaseSerializer from '../BaseSerializer';
import TextureSerializer from './TextureSerializer';

/**
 * CompressedTextureSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function CompressedTextureSerializer(app) {
    BaseSerializer.call(this, app);
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