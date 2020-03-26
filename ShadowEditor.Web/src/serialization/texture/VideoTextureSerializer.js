import BaseSerializer from '../BaseSerializer';
import TextureSerializer from './TextureSerializer';

/**
 * VideoTextureSerializer
 * @author tengge / https://github.com/tengge1
 */
function VideoTextureSerializer() {
    BaseSerializer.call(this);
}

VideoTextureSerializer.prototype = Object.create(BaseSerializer.prototype);
VideoTextureSerializer.prototype.constructor = VideoTextureSerializer;

VideoTextureSerializer.prototype.toJSON = function (obj) {
    var json = TextureSerializer.prototype.toJSON.call(this, obj);

    json.image = {
        tagName: 'video',
        src: obj.image.src.replace(location.href, '/')
    };

    return json;
};

VideoTextureSerializer.prototype.fromJSON = function (json, parent, server) {
    let video = document.createElement('video');
    video.setAttribute('src', server + json.image.src);
    video.setAttribute('autoplay', 'autoplay');
    video.setAttribute('loop', 'loop');
    video.setAttribute('crossorigin', 'anonymous');

    var obj = parent === undefined ? new THREE.VideoTexture(video) : parent;

    TextureSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default VideoTextureSerializer;