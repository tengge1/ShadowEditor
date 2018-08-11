import BaseSerializer from '../BaseSerializer';
import TextureSerializer from './TextureSerializer';

/**
 * VideoTextureSerializer
 * @param {*} app 
 */
function VideoTextureSerializer(app) {
    BaseSerializer.call(this, app);
}

VideoTextureSerializer.prototype = Object.create(BaseSerializer.prototype);
VideoTextureSerializer.prototype.constructor = VideoTextureSerializer;

VideoTextureSerializer.prototype.toJSON = function (obj) {
    return TextureSerializer.prototype.toJSON.call(this, obj);
};

VideoTextureSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.VideoTexture() : parent;

    TextureSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default VideoTextureSerializer;