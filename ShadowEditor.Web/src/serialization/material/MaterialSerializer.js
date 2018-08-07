import BaseSerializer from '../BaseSerializer';

/**
 * Material序列化器
 */
function MaterialSerializer() {
    BaseSerializer.call(this);
}

MaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MaterialSerializer.prototype.constructor = MaterialSerializer;

MaterialSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.alphaMap = obj.alphaMap;
    json.alphaTest = obj.alphaTest;
    json.aoMap = obj.aoMap;
    json.aoMapIntensity = obj.aoMapIntensity;
    json.blendDst = obj.blendDst;
    json.blendDstAlpha = obj.blendDstAlpha;
    json.blendEquation = obj.blendEquation;
    json.blendEquationAlpha = obj.blendEquationAlpha;
    json.blendSrc = obj.blendSrc;
    json.blendSrcAlpha = obj.blendSrcAlpha;
    json.blending = obj.blending;
    json.bumpMap = obj.bumpMap;
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
    json.displacementMap = obj.displacementMap;
    json.displacementScale = obj.displacementScale;
    json.dithering = obj.dithering;
    json.emissive = obj.emissive;
    json.emissiveIntensity = obj.emissiveIntensity;
    json.emissiveMap = obj.emissiveMap;
    json.envMap = obj.envMap;
    json.envMapIntensity = obj.envMapIntensity;
    json.flatShading = obj.flatShading;
    json.fog = obj.fog;
    json.lightMap = obj.lightMap;
    json.lightMapIntensity = obj.lightMapIntensity;
    json.lights = obj.lights;
    json.linewidth = obj.linewidth;
    json.map = obj.map;
    json.metalness = obj.metalness;
    json.metalnessMap = obj.metalnessMap;
    json.morphNormals = obj.morphNormals;
    json.morphTargets = obj.morphTargets;
    json.name = obj.name;
    json.normalMap = obj.normalMap;
    json.normalScale = obj.normalScale;
    json.opacity = obj.opacity;
    json.overdraw = obj.overdraw;
    json.polygonOffset = obj.polygonOffset;
    json.polygonOffsetFactor = obj.polygonOffsetFactor;
    json.polygonOffsetUnits = obj.polygonOffsetUnits;
    json.precision = obj.precision;
    json.premultipliedAlpha = obj.premultipliedAlpha;
    json.refractionRatio = obj.refractionRatio;
    json.roughness = obj.roughness;
    json.roughnessMap = obj.roughnessMap;
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

MaterialSerializer.prototype.fromJSON = function (json, parent) {

};

export default MaterialSerializer;