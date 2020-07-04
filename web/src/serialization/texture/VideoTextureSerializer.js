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