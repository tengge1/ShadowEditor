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
import Object3DSerializer from '../core/Object3DSerializer';

/**
 * AudioSerializer
 * @author tengge / https://github.com/tengge1
 */
function AudioSerializer() {
    BaseSerializer.call(this);
}

AudioSerializer.prototype = Object.create(BaseSerializer.prototype);
AudioSerializer.prototype.constructor = AudioSerializer;

AudioSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.autoplay = obj.autoplay;
    json.loop = obj.getLoop();
    json.volume = obj.getVolume();

    return json;
};

AudioSerializer.prototype.fromJSON = function (json, parent, audioListener) {
    if (audioListener === undefined) {
        audioListener = new THREE.AudioListener();
    }
    var obj = parent === undefined ? new THREE.Audio(audioListener) : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.autoplay = json.autoplay;
    obj.setLoop(json.loop);
    obj.setVolume(json.volume);

    return obj;
};

export default AudioSerializer;