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
 * AudioListenerSerializer
 * @author tengge / https://github.com/tengge1
 */
class AudioListenerSerializer extends BaseSerializer {
    toJSON(obj) {
        var json = Object3DSerializer.prototype.toJSON.call(this, obj);

        json.masterVolume = obj.getMasterVolume();

        return json;
    }

    fromJSON(json, parent) {
        var obj = parent === undefined ? new THREE.AudioListener() : parent;

        Object3DSerializer.prototype.fromJSON.call(this, json, obj);

        obj.setMasterVolume(json.masterVolume);

        return obj;
    }
}

export default AudioListenerSerializer;