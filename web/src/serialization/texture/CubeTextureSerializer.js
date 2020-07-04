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
import ImageUtils from '../../utils/ImageUtils';

/**
 * CubeTextureSerializer
 * @author tengge / https://github.com/tengge1
 */
function CubeTextureSerializer() {
    BaseSerializer.call(this);
}

CubeTextureSerializer.prototype = Object.create(BaseSerializer.prototype);
CubeTextureSerializer.prototype.constructor = CubeTextureSerializer;

CubeTextureSerializer.prototype.toJSON = function (obj) {
    var json = TextureSerializer.prototype.toJSON.call(this, obj);

    json.image = [];

    obj.image.forEach(n => {
        if (n.src.startsWith('data')) { // base64
            json.image.push({
                tagName: 'img',
                src: n.src,
                width: n.width,
                height: n.height
            });
        } else { // url
            json.image.push({
                tagName: 'img',
                src: n.src.replace(location.href, '/'),
                width: n.width,
                height: n.height
            });
        }
    });

    return json;
};

CubeTextureSerializer.prototype.fromJSON = function (json, parent, server) {
    // 用一个像素的图片初始化CubeTexture，避免图片载入前的警告信息。
    var img = ImageUtils.onePixelCanvas();
    var obj = parent === undefined ? new THREE.CubeTexture([img, img, img, img, img, img]) : parent;

    TextureSerializer.prototype.fromJSON.call(this, json, obj, server);

    if (Array.isArray(json.image)) {
        var promises = json.image.map(n => {
            return new Promise(resolve => {
                var img = document.createElement('img');

                if (n.src && n.src.startsWith('/')) {
                    img.src = server + n.src;
                } else {
                    img.src = n.src;
                }

                img.width = n.width;
                img.height = n.height;
                img.onload = () => {
                    resolve(img);
                };
            });
        });
        Promise.all(promises).then(imgs => {
            obj.image = imgs;
            obj.needsUpdate = true;
        });
    }

    return obj;
};

export default CubeTextureSerializer;