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
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.boundingBox = obj.boundingBox;
    json.boundingSphere = obj.boundingSphere;
    json.colors = obj.colors;
    json.faces = obj.faces;
    json.faceVertexUvs = obj.faceVertexUvs;
    json.id = obj.id;
    json.isGeometry = obj.isGeometry;
    json.lineDistances = obj.lineDistances;
    json.morphTargets = obj.morphTargets;
    json.morphNormals = obj.morphNormals;
    json.name = geometry.name;
    json.skinWeights = obj.skinWeights;
    json.skinIndices = obj.skinIndices;
    json.uuid = obj.uuid;
    json.vertices = obj.vertices;
    json.verticesNeedUpdate = obj.verticesNeedUpdate;
    json.elementsNeedUpdate = obj.elementsNeedUpdate;
    json.uvsNeedUpdate = obj.uvsNeedUpdate;
    json.normalsNeedUpdate = obj.normalsNeedUpdate;
    json.colorsNeedUpdate = obj.colorsNeedUpdate;
    json.groupsNeedUpdate = obj.groupsNeedUpdate;
    json.lineDistancesNeedUpdate = obj.lineDistancesNeedUpdate;

    json.type = geometry.type;
    json.userData = geometry.userData;

    return json;
};

GeometrySerializer.prototype.fromJSON = function (json, parent) {

};

export default GeometrySerializer;