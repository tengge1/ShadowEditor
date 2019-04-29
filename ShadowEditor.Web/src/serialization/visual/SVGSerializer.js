import BaseSerializer from '../BaseSerializer';

/**
 * SVGSerializer
 * @author tengge / https://github.com/tengge1
 */
function SVGSerializer() {
    BaseSerializer.call(this);
}

SVGSerializer.prototype = Object.create(BaseSerializer.prototype);
SVGSerializer.prototype.constructor = SVGSerializer;

SVGSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);
    Object.assign(json, obj);
    return json;
};

SVGSerializer.prototype.fromJSON = function (json) {
    var obj = {};

    if (json && json.html) {
        obj.html = json.html;
    } else {
        obj.html = '';
    }

    return obj;
};

export default SVGSerializer;