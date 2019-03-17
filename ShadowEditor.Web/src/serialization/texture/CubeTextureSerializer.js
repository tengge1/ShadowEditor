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
        var url = new URL(n.src); // 修复贴图路径自带服务端路径bug
        json.image.push({
            tagName: 'img',
            src: url.pathname,
            width: n.width,
            height: n.height
        });
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