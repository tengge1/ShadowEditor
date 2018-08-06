import BaseSerializer from '../BaseSerializer';

/**
 * LineBasicMaterialSerializer
 */
function LineBasicMaterialSerializer() {
    BaseSerializer.call(this);
}

LineBasicMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
LineBasicMaterialSerializer.prototype.constructor = LineBasicMaterialSerializer;

LineBasicMaterialSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON(obj);

    json.alphaMap = material.alphaMap;
    json.alphaTest = material.alphaTest;
    json.aoMap = material.aoMap;
    json.aoMapIntensity = material.aoMapIntensity;
    json.blendDst = material.blendDst;
    json.blendDstAlpha = material.blendDstAlpha;
    json.blendEquation = material.blendEquation;
    json.blendEquationAlpha = material.blendEquationAlpha;
    json.blendSrc = material.blendSrc;
    json.blendSrcAlpha = material.blendSrcAlpha;
    json.blending = material.blending;
    json.bumpMap = material.bumpMap;
    json.bumpScale = material.bumpScale;
    json.clipIntersection = material.clipIntersection;
    json.clipShadow = material.clipShadow;
    json.clippingPlanes = material.clippingPlanes;
    json.color = material.color;
    json.colorWrite = material.colorWrite;
    json.depthFunc = material.depthFunc;
    json.depthTest = material.depthTest;
    json.depthWrite = material.depthWrite;
    json.displacementBias = material.displacementBias;
    json.displacementMap = material.displacementMap;
    json.displacementScale = material.displacementScale;
    json.dithering = material.dithering;
    json.emissive = material.emissive;
    json.emissiveIntensity = material.emissiveIntensity;
    json.emissiveMap = material.emissiveMap;
    json.envMap = material.envMap;
    json.envMapIntensity = material.envMapIntensity;
    json.flatShading = material.flatShading;
    json.fog = material.fog;
    json.lightMap = material.lightMap;
    json.lightMapIntensity = material.lightMapIntensity;
    json.lights = material.lights;
    json.linewidth = material.linewidth;
    json.map = material.map;
    json.metalness = material.metalness;
    json.metalnessMap = material.metalnessMap;
    json.morphNormals = material.morphNormals;
    json.morphTargets = material.morphTargets;
    json.name = material.name;
    json.normalMap = material.normalMap;
    json.normalScale = material.normalScale;
    json.opacity = material.opacity;
    json.overdraw = material.overdraw;
    json.polygonOffset = material.polygonOffset;
    json.polygonOffsetFactor = material.polygonOffsetFactor;
    json.polygonOffsetUnits = material.polygonOffsetUnits;
    json.precision = material.precision;
    json.premultipliedAlpha = material.premultipliedAlpha;
    json.refractionRatio = material.refractionRatio;
    json.roughness = material.roughness;
    json.roughnessMap = material.roughnessMap;
    json.shadowSide = material.shadowSide;
    json.side = material.side;
    json.skinning = material.skinning;
    json.transparent = material.transparent;
    json.type = material.type;
    json.userData = material.userData;
    json.uuid = material.uuid;
    json.vertexColors = material.vertexColors;
    json.visible = material.visible;
    json.wireframe = material.wireframe;
    json.wireframeLinecap = material.wireframeLinecap;
    json.wireframeLinejoin = material.wireframeLinejoin;
    json.wireframeLinewidth = material.wireframeLinewidth;

    return json;
};

LineBasicMaterialSerializer.prototype.fromJSON = function (json) {

};

export default LineBasicMaterialSerializer;