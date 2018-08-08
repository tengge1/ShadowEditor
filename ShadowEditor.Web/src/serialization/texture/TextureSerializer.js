import BaseSerializer from '../BaseSerializer';

/**
 * TextureSerializer
 */
function TextureSerializer() {
    BaseSerializer.call(this);
}

TextureSerializer.prototype = Object.create(BaseSerializer.prototype);
TextureSerializer.prototype.constructor = TextureSerializer;

TextureSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.anisotropy = obj.anisotropy;
    json.center = obj.center;
    json.encoding = obj.encoding;
    json.flipY = obj.flipY;
    json.format = obj.format;
    json.generateMipmaps = obj.generateMipmaps;
    json.id = obj.id;
    json.image = obj.image;
    json.magFilter = obj.magFilter;
    json.mapping = obj.mapping;
    json.matrix = obj.matrix;
    json.matrixAutoUpdate = obj.matrixAutoUpdate;
    json.minFilter = obj.minFilter;
    json.mipmaps = obj.mipmaps;
    json.name = obj.name;
    json.offset = obj.offset;
    json.premultiplyAlpha = obj.premultiplyAlpha;
    json.repeat = obj.repeat;
    json.rotation = obj.rotation;
    json.type = obj.type;
    json.unpackAlignment = obj.unpackAlignment;
    json.uuid = obj.uuid;
    json.version = obj.version;
    json.wrapS = obj.wrapS;
    json.wrapT = obj.wrapT;
    json.isTexture = obj.isTexture;
    json.needsUpdate = obj.needsUpdate;

    return json;
};

TextureSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Texture() : parent;

    obj.anisotropy = json.anisotropy;
    obj.center = json.center;
    obj.encoding = json.encoding;
    obj.flipY = json.flipY;
    obj.format = json.format;
    obj.generateMipmaps = json.generateMipmaps;
    obj.id = json.id;
    obj.image = json.image;
    obj.magFilter = json.magFilter;
    obj.mapping = json.mapping;
    obj.matrix = json.matrix;
    obj.matrixAutoUpdate = json.matrixAutoUpdate;
    obj.minFilter = json.minFilter;
    obj.mipmaps = json.mipmaps;
    obj.name = json.name;
    obj.offset = json.offset;
    obj.premultiplyAlpha = json.premultiplyAlpha;
    obj.repeat = json.repeat;
    obj.rotation = json.rotation;
    obj.type = json.type;
    obj.unpackAlignment = json.unpackAlignment;
    obj.uuid = json.uuid;
    obj.version = json.version;
    obj.wrapS = json.wrapS;
    obj.wrapT = json.wrapT;
    obj.isTexture = json.isTexture;
    obj.needsUpdate = json.needsUpdate;

    return obj;
};

export default TextureSerializer;