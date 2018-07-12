import BaseSerializer from '../BaseSerializer';

/**
 * Geometry序列化器
 */
function GeometrySerializer() {
    BaseSerializer.call(this);
}

GeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
GeometrySerializer.prototype.constructor = GeometrySerializer;

GeometrySerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON(obj);

    json.name = geometry.name;
    json.type = geometry.type;
    json.userData = geometry.userData;
    json.uuid = geometry.uuid;

    return json;
};

GeometrySerializer.prototype.fromJSON = function (json) {

};

export default GeometrySerializer;