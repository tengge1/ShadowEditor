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
    var jsons = [];

    list.forEach(n => {
        var json = BaseSerializer.prototype.toJSON.call(this, n);
        Object.assign(json, n);
        jsons.push(json);
    });

    return jsons;
};

AnimationSerializer.prototype.fromJSON = function (jsons) {
    var list = [];

    jsons.forEach(n => {
        var obj = Object.assign({}, n);
        delete obj.metadata;
        list.push(obj);
    });

    return list;
};

export default AnimationSerializer;