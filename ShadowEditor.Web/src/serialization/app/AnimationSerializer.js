import BaseSerializer from '../BaseSerializer';

/**
 * AnimationSerializer
 * @author tengge / https://github.com/tengge1
 */
function AnimationSerializer() {
    BaseSerializer.call(this);
}

AnimationSerializer.prototype = Object.create(BaseSerializer.prototype);
AnimationSerializer.prototype.constructor = AnimationSerializer;

AnimationSerializer.prototype.toJSON = function (list) {
    return list.slice();
};

AnimationSerializer.prototype.fromJSON = function (jsons) {
    return jsons.slice();
};

export default AnimationSerializer;