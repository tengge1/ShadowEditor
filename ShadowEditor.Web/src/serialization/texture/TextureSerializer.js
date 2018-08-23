import BaseSerializer from '../BaseSerializer';

/**
 * TextureSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function TextureSerializer(app) {
    BaseSerializer.call(this, app);
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

    if (obj.image && obj.image.tagName.toLowerCase() === 'img') { // img
        json.image = {
            tagName: 'img',
            src: obj.image.src,
            width: obj.image.width,
            height: obj.image.height
        };
    } else if (obj.image && obj.image.tagName.toLowerCase() === 'canvas') { // canvas
        json.image = {
            tagName: 'canvas',
            src: obj.image.toDataURL(),
            width: obj.image.width,
            height: obj.image.height
        };
    } else {
        json.image = null;
    }

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
    obj.center.copy(json.center);
    obj.encoding = json.encoding;
    obj.flipY = json.flipY;
    obj.format = json.format;
    obj.generateMipmaps = json.generateMipmaps;

    if (json.image && json.image.tagName === 'img') {
        var img = document.createElement('img');
        img.src = json.image.src;
        img.width = json.image.width;
        img.height = json.image.height;
        img.onload = function () {
            obj.needsUpdate = true;
        };
        obj.image = img;
    } else if (json.image && json.image.tagName === 'canvas') {
        var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        var ctx = canvas.getContext('2d');

        var img = document.createElement('img');
        img.src = json.image.src;
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            obj.needsUpdate = true;
        };

        obj.image = canvas;
    }

    obj.magFilter = json.magFilter;
    obj.mapping = json.mapping;
    obj.matrix.copy(json.matrix);
    obj.matrixAutoUpdate = json.matrixAutoUpdate;
    obj.minFilter = json.minFilter;
    obj.mipmaps = json.mipmaps;
    obj.name = json.name;
    obj.offset.copy(json.offset);
    obj.premultiplyAlpha = json.premultiplyAlpha;
    obj.repeat.copy(json.repeat);
    obj.rotation = json.rotation;
    obj.type = json.type;
    obj.unpackAlignment = json.unpackAlignment;
    obj.uuid = json.uuid;
    obj.version = json.version;
    obj.wrapS = json.wrapS;
    obj.wrapT = json.wrapT;
    obj.isTexture = json.isTexture;
    obj.needsUpdate = true;

    return obj;
};

export default TextureSerializer;