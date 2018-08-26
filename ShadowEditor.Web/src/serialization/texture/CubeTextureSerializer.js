import BaseSerializer from '../BaseSerializer';
import TextureSerializer from './TextureSerializer';

/**
 * CubeTextureSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function CubeTextureSerializer(app) {
    BaseSerializer.call(this, app);
}

CubeTextureSerializer.prototype = Object.create(BaseSerializer.prototype);
CubeTextureSerializer.prototype.constructor = CubeTextureSerializer;

CubeTextureSerializer.prototype.toJSON = function (obj) {
    var json = TextureSerializer.prototype.toJSON.call(this, obj);

    json.image = [];

    obj.image.forEach(n => {
        json.image.push({
            tagName: 'img',
            src: n.src,
            width: n.width,
            height: n.height
        });
    });

    return json;
};

CubeTextureSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.CubeTexture() : parent;

    TextureSerializer.prototype.fromJSON.call(this, json, obj);

    if (Array.isArray(json.image)) {
        var promises = json.image.map(n => {
            return new Promise(resolve => {
                var img = document.createElement('img');
                img.src = n.src;
                img.width = n.width;
                img.height = n.height;
                img.onload = () => {
                    resolve(img);
                };
                obj.image.push(img);
            });
        });
        Promise.all(promises).then(n => {
            obj.needsUpdate = true;
        });
    }

    return obj;
};

export default CubeTextureSerializer;