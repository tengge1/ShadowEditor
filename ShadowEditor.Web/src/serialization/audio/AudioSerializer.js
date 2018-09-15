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

AudioSerializer.prototype.fromJSON = function (json, parent) {
    var listener = new THREE.AudioListener();
    var obj = parent === undefined ? new THREE.Audio(listener) : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.autoplay = json.autoplay;
    obj.setLoop(json.loop);
    obj.setVolume(json.volume);

    return obj;
};

export default AudioSerializer;