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
    return TextureSerializer.prototype.toJSON.call(this, obj);
};

CubeTextureSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.CubeTexture() : parent;

    TextureSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default CubeTextureSerializer;