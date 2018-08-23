import BaseSerializer from '../BaseSerializer';
import TextureSerializer from './TextureSerializer';

/**
 * CanvasTextureSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function CanvasTextureSerializer(app) {
    BaseSerializer.call(this, app);
}

CanvasTextureSerializer.prototype = Object.create(BaseSerializer.prototype);
CanvasTextureSerializer.prototype.constructor = CanvasTextureSerializer;

CanvasTextureSerializer.prototype.toJSON = function (obj) {
    return TextureSerializer.prototype.toJSON.call(this, obj);
};

CanvasTextureSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.CanvasTexture() : parent;

    TextureSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default CanvasTextureSerializer;