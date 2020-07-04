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
import ImageUtils from '../../utils/ImageUtils';

/**
 * TextureSerializer
 * @author tengge / https://github.com/tengge1
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

    // 说明：立体贴图obj.image是一个图片数组。
    if (obj.image && !Array.isArray(obj.image) && obj.image.tagName && obj.image.tagName.toLowerCase() === 'img') { // 图片
        var src = obj.image.src;
        if (!src.startsWith('data:') && !src.startsWith('blob')) { // data和blob地址不应该被修改
            src = src.replace(location.href, '/');
        }

        json.image = {
            tagName: 'img',
            src: src,
            width: obj.image.width,
            height: obj.image.height
        };
    } else if (obj.image && !Array.isArray(obj.image) && obj.image.tagName && obj.image.tagName.toLowerCase() === 'canvas') { // 画布
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

TextureSerializer.prototype.fromJSON = function (json, parent, server) {
    // 用一个像素的图片初始化Texture，避免图片载入前的警告信息。
    var img = ImageUtils.onePixelCanvas();
    var obj = parent === undefined ? new THREE.Texture(img) : parent;

    obj.anisotropy = json.anisotropy;
    obj.center.copy(json.center);
    obj.encoding = json.encoding;
    obj.flipY = json.flipY;
    obj.format = json.format;
    obj.generateMipmaps = json.generateMipmaps;

    if (json.image && !Array.isArray(json.image) && json.image.tagName === 'img') { // 图片
        img = document.createElement('img');

        if (!json.image.src.startsWith('blob:http://')) { // 这种类型不能被反序列化，例如：blob:http://localhost:2000/d6590b48-8b50-44d0-a3a7-248a8047bc89
            if (json.image.src && json.image.src.startsWith('/')) {
                img.src = server + json.image.src;
            } else {
                img.src = json.image.src;
            }
        }

        img.width = json.image.width;
        img.height = json.image.height;
        img.onload = function () {
            obj.image = img;
            obj.needsUpdate = true;
        };
    } else if (json.image && !Array.isArray(obj.image) && json.image.tagName === 'canvas') { // 画布
        var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        var ctx = canvas.getContext('2d');

        img = document.createElement('img');

        if (json.image.src && json.image.src.startsWith('/')) {
            img.src = server + json.image.src;
        } else {
            img.src = json.image.src;
        }

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