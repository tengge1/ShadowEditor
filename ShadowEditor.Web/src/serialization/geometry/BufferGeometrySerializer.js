import BaseSerializer from '../BaseSerializer';

/**
 * BufferGeometry序列化器
 */
function BufferGeometrySerializer() {
    BaseSerializer.call(this);
}

BufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
BufferGeometrySerializer.prototype.constructor = BufferGeometrySerializer;

BufferGeometrySerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.attributes = obj.attributes;
    json.boundingBox = obj.boundingBox;
    json.boundingSphere = obj.boundingSphere;
    json.drawRange = obj.drawRange;
    json.groups = obj.groups;
    json.index = obj.index;
    json.morphAttributes = obj.morphAttributes;
    json.name = obj.name;
    json.parameters = obj.parameters;
    json.type = obj.type;
    json.userData = obj.userData;
    json.uuid = obj.uuid;

    return json;
};

BufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.BufferGeometry() : parent;

    BaseSerializer.prototype.fromJSON.call(this, obj);

    obj.attributes = json.attributes;
    obj.boundingBox = json.boundingBox;
    obj.boundingSphere = json.boundingSphere;
    obj.drawRange = json.drawRange;
    obj.groups = json.groups;
    obj.index = json.index;
    obj.morphAttributes = json.morphAttributes;
    obj.name = json.name;
    obj.parameters = json.parameters;
    obj.type = json.type;
    obj.userData = json.userData;
    obj.uuid = json.uuid;

    return obj;
};

export default BufferGeometrySerializer;