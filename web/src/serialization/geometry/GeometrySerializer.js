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

/**
 * GeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function GeometrySerializer() {
    BaseSerializer.call(this);
}

GeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
GeometrySerializer.prototype.constructor = GeometrySerializer;

GeometrySerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.type = obj.type;
    json.boundingBox = obj.boundingBox;
    json.boundingSphere = obj.boundingSphere;
    json.colors = obj.colors;
    json.colorsNeedUpdate = obj.colorsNeedUpdate;
    json.faces = obj.faces;
    json.faceVertexUvs = obj.faceVertexUvs;
    json.groupsNeedUpdate = obj.groupsNeedUpdate;
    json.isGeometry = obj.isGeometry;
    json.lineDistances = obj.lineDistances;
    json.lineDistancesNeedUpdate = obj.lineDistancesNeedUpdate;
    json.morphTargets = obj.morphTargets;
    json.morphNormals = obj.morphNormals;
    json.name = obj.name;
    json.normalsNeedUpdate = obj.normalsNeedUpdate;
    json.parameters = obj.parameters;
    json.skinWeights = obj.skinWeights;
    json.skinIndices = obj.skinIndices;
    json.uuid = obj.uuid;
    json.vertices = obj.vertices;
    json.verticesNeedUpdate = obj.verticesNeedUpdate;
    json.elementsNeedUpdate = obj.elementsNeedUpdate;
    json.uvsNeedUpdate = obj.uvsNeedUpdate;
    json.normalsNeedUpdate = obj.normalsNeedUpdate;

    return json;
};

GeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Geometry() : parent;

    BaseSerializer.prototype.fromJSON.call(this, obj);

    obj.type = json.type;
    obj.boundingBox = json.boundingBox;
    obj.boundingSphere = json.boundingSphere;
    obj.colors = json.colors;
    obj.colorsNeedUpdate = json.colorsNeedUpdate;
    obj.faces = json.faces;
    obj.faceVertexUvs = json.faceVertexUvs;
    obj.groupsNeedUpdate = json.groupsNeedUpdate;
    obj.isGeometry = json.isGeometry;
    obj.lineDistances = json.lineDistances;
    obj.lineDistancesNeedUpdate = json.lineDistancesNeedUpdate;
    obj.morphTargets = json.morphTargets;
    obj.morphNormals = json.morphNormals;
    obj.name = json.name;
    obj.normalsNeedUpdate = json.normalsNeedUpdate;
    obj.parameters = json.parameters;
    obj.skinWeights = json.skinWeights;
    obj.skinIndices = json.skinIndices;
    obj.uuid = json.uuid;
    obj.vertices = json.vertices;
    obj.verticesNeedUpdate = json.verticesNeedUpdate;
    obj.elementsNeedUpdate = json.elementsNeedUpdate;
    obj.uvsNeedUpdate = json.uvsNeedUpdate;
    obj.normalsNeedUpdate = json.normalsNeedUpdate;

    return obj;
};

export default GeometrySerializer;