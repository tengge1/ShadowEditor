import BaseSerializer from '../BaseSerializer';

/**
 * VisualSerializer
 * @author tengge / https://github.com/tengge1
 */
function VisualSerializer() {
    BaseSerializer.call(this);
}

VisualSerializer.prototype = Object.create(BaseSerializer.prototype);
VisualSerializer.prototype.constructor = VisualSerializer;

VisualSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);
    json.data = obj.toJSON()
    return json;
};

VisualSerializer.prototype.fromJSON = function (json) {
    return json.data ? json.data : null;
};

export default VisualSerializer;