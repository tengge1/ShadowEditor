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

import TexturesSerializer from '../texture/TexturesSerializer';

/**
 * MaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function MaterialSerializer() {
    BaseSerializer.call(this);
}

MaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MaterialSerializer.prototype.constructor = MaterialSerializer;

MaterialSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.alphaMap = !obj.alphaMap ? null : new TexturesSerializer().toJSON(obj.alphaMap);
    json.alphaTest = obj.alphaTest;
    json.aoMap = !obj.aoMap ? null : new TexturesSerializer().toJSON(obj.aoMap);
    json.aoMapIntensity = obj.aoMapIntensity;
    json.blendDst = obj.blendDst;
    json.blendDstAlpha = obj.blendDstAlpha;
    json.blendEquation = obj.blendEquation;
    json.blendEquationAlpha = obj.blendEquationAlpha;
    json.blendSrc = obj.blendSrc;
    json.blendSrcAlpha = obj.blendSrcAlpha;
    json.blending = obj.blending;
    json.bumpMap = !obj.bumpMap ? null : new TexturesSerializer().toJSON(obj.bumpMap);
    json.bumpScale = obj.bumpScale;
    json.clipIntersection = obj.clipIntersection;
    json.clipShadow = obj.clipShadow;
    json.clippingPlanes = obj.clippingPlanes;
    json.color = obj.color;
    json.colorWrite = obj.colorWrite;
    json.depthFunc = obj.depthFunc;
    json.depthTest = obj.depthTest;
    json.depthWrite = obj.depthWrite;
    json.displacementBias = obj.displacementBias;
    json.displacementMap = !obj.displacementMap ? null : new TexturesSerializer().toJSON(obj.displacementMap);
    json.displacementScale = obj.displacementScale;
    json.dithering = obj.dithering;
    json.emissive = obj.emissive;
    json.emissiveIntensity = obj.emissiveIntensity;
    json.emissiveMap = !obj.emissiveMap ? null : new TexturesSerializer().toJSON(obj.emissiveMap);

    if (obj.specular) {
        json.specular = obj.specular;
    }
    if (obj.specularMap) {
        json.specularMap = new TexturesSerializer().toJSON(obj.specularMap);
    }

    json.envMap = !obj.envMap ? null : new TexturesSerializer().toJSON(obj.envMap);
    json.envMapIntensity = obj.envMapIntensity;
    json.flatShading = obj.flatShading;
    json.fog = obj.fog;
    json.lightMap = !obj.lightMap ? null : new TexturesSerializer().toJSON(obj.lightMap);
    json.lightMapIntensity = obj.lightMapIntensity;
    json.lights = obj.lights;
    json.linewidth = obj.linewidth;
    json.map = !obj.map ? null : new TexturesSerializer().toJSON(obj.map);
    json.metalness = obj.metalness;
    json.metalnessMap = !obj.metalnessMap ? null : new TexturesSerializer().toJSON(obj.metalnessMap);
    json.morphNormals = obj.morphNormals;
    json.morphTargets = obj.morphTargets;
    json.name = obj.name;
    json.normalMap = !obj.normalMap ? null : new TexturesSerializer().toJSON(obj.normalMap);
    json.normalScale = obj.normalScale;
    json.opacity = obj.opacity;
    json.polygonOffset = obj.polygonOffset;
    json.polygonOffsetFactor = obj.polygonOffsetFactor;
    json.polygonOffsetUnits = obj.polygonOffsetUnits;
    json.precision = obj.precision;
    json.premultipliedAlpha = obj.premultipliedAlpha;
    json.refractionRatio = obj.refractionRatio;
    json.roughness = obj.roughness;
    json.roughnessMap = !obj.roughnessMap ? null : new TexturesSerializer().toJSON(obj.roughnessMap);
    json.shadowSide = obj.shadowSide;
    json.side = obj.side;
    json.skinning = obj.skinning;
    json.transparent = obj.transparent;
    json.type = obj.type;
    json.userData = obj.userData;
    json.uuid = obj.uuid;
    json.vertexColors = obj.vertexColors;
    json.visible = obj.visible;
    json.wireframe = obj.wireframe;
    json.wireframeLinecap = obj.wireframeLinecap;
    json.wireframeLinejoin = obj.wireframeLinejoin;
    json.wireframeLinewidth = obj.wireframeLinewidth;

    return json;
};

MaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.Material() : parent;

    obj.alphaMap = !json.alphaMap ? null : new TexturesSerializer().fromJSON(json.alphaMap, undefined, server);
    obj.alphaTest = json.alphaTest;
    obj.aoMap = !json.aoMap ? null : new TexturesSerializer().fromJSON(json.aoMap, undefined, server);
    obj.aoMapIntensity = json.aoMapIntensity;
    obj.blendDst = json.blendDst;
    obj.blendDstAlpha = json.blendDstAlpha;
    obj.blendEquation = json.blendEquation;
    obj.blendEquationAlpha = json.blendEquationAlpha;
    obj.blendSrc = json.blendSrc;
    obj.blendSrcAlpha = json.blendSrcAlpha;
    obj.blending = json.blending;
    obj.bumpMap = !json.bumpMap ? null : new TexturesSerializer().fromJSON(json.bumpMap, undefined, server);
    obj.bumpScale = json.bumpScale;
    obj.clipIntersection = json.clipIntersection;
    obj.clipShadow = json.clipShadow;
    obj.clippingPlanes = json.clippingPlanes;
    obj.color = !json.color ? null : new THREE.Color(json.color);
    obj.colorWrite = json.colorWrite;
    obj.depthFunc = json.depthFunc;
    obj.depthTest = json.depthTest;
    obj.depthWrite = json.depthWrite;
    obj.displacementBias = json.displacementBias;
    obj.displacementMap = !json.displacementMap ? null : new TexturesSerializer().fromJSON(json.displacementMap, undefined, server);
    obj.displacementScale = json.displacementScale;
    obj.dithering = json.dithering;
    obj.emissive = json.emissive === undefined ? undefined : new THREE.Color(json.emissive);
    obj.emissiveIntensity = json.emissiveIntensity;
    obj.emissiveMap = !json.emissiveMap ? null : new TexturesSerializer().fromJSON(json.emissiveMap, undefined, server);

    if (json.specular) {
        // bug: json.specular是颜色值。
        obj.specular = new THREE.Color(json.specular);
    }
    if (json.specularMap) {
        obj.specularMap = new TexturesSerializer().fromJSON(json.specularMap, undefined, server);
    }

    obj.envMap = !json.envMap ? null : new TexturesSerializer().fromJSON(json.envMap, undefined, server);
    obj.envMapIntensity = json.envMapIntensity;
    obj.flatShading = json.flatShading;
    obj.fog = json.fog;
    obj.lightMap = !json.lightMap ? null : new TexturesSerializer().fromJSON(json.lightMap, undefined, server);
    obj.lightMapIntensity = json.lightMapIntensity;
    obj.lights = json.lights;
    obj.linewidth = json.linewidth;
    obj.map = !json.map ? null : new TexturesSerializer().fromJSON(json.map, undefined, server);
    obj.metalness = json.metalness;
    obj.metalnessMap = !json.metalnessMap ? null : new TexturesSerializer().fromJSON(json.metalnessMap, undefined, server);
    obj.morphNormals = json.morphNormals;
    obj.morphTargets = json.morphTargets;
    obj.name = json.name;
    obj.normalMap = !json.normalMap ? null : new TexturesSerializer().fromJSON(json.normalMap, undefined, server);
    obj.normalScale = !json.normalScale ? null : new THREE.Vector2().copy(json.normalScale);
    obj.opacity = json.opacity;
    obj.polygonOffset = json.polygonOffset;
    obj.polygonOffsetFactor = json.polygonOffsetFactor;
    obj.polygonOffsetUnits = json.polygonOffsetUnits;
    obj.precision = json.precision;
    obj.premultipliedAlpha = json.premultipliedAlpha;
    obj.refractionRatio = json.refractionRatio;
    obj.roughness = json.roughness;
    obj.roughnessMap = !json.roughnessMap ? null : new TexturesSerializer().fromJSON(json.roughnessMap, undefined, server);
    obj.shadowSide = json.shadowSide;
    obj.side = json.side;
    obj.skinning = json.skinning;
    obj.transparent = json.transparent;
    obj.type = json.type;
    obj.userData = json.userData;
    obj.uuid = json.uuid;
    obj.vertexColors = json.vertexColors;
    obj.visible = json.visible;
    obj.wireframe = json.wireframe;
    obj.wireframeLinecap = json.wireframeLinecap;
    obj.wireframeLinejoin = json.wireframeLinejoin;
    obj.wireframeLinewidth = json.wireframeLinewidth;

    return obj;
};

export default MaterialSerializer;