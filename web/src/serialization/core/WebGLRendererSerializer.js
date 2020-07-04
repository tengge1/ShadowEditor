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
import WebGLShadowMapSerializer from './WebGLShadowMapSerializer';

/**
 * WebGLRendererSerializer
 * @author tengge / https://github.com/tengge1
 */
function WebGLRendererSerializer() {
    BaseSerializer.call(this);
}

WebGLRendererSerializer.prototype = Object.create(BaseSerializer.prototype);
WebGLRendererSerializer.prototype.constructor = WebGLRendererSerializer;

WebGLRendererSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.antialias = true;
    json.autoClear = obj.autoClear;
    json.autoClearColor = obj.autoClearColor;
    json.autoClearDepth = obj.autoClearDepth;
    json.autoClearStencil = obj.autoClearStencil;
    json.autoUpdateScene = obj.autoUpdateScene;
    json.clippingPlanes = obj.clippingPlanes;
    json.gammaFactor = obj.gammaFactor;
    // json.gammaInput = obj.gammaInput;
    // json.gammaOutput = obj.gammaOutput;
    json.localClippingEnabled = obj.localClippingEnabled;
    json.physicallyCorrectLights = obj.physicallyCorrectLights;
    json.shadowMap = new WebGLShadowMapSerializer().toJSON(obj.shadowMap);
    json.sortObjects = obj.sortObjects;
    json.toneMapping = obj.toneMapping;
    json.toneMappingExposure = obj.toneMappingExposure;
    json.toneMappingWhitePoint = obj.toneMappingWhitePoint;

    return json;
};

WebGLRendererSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.WebGLRenderer({ antialias: json.antialias }) : parent;

    obj.autoClear = json.autoClear;
    obj.autoClearColor = json.autoClearColor;
    obj.autoClearDepth = json.autoClearDepth;
    obj.autoClearStencil = json.autoClearStencil;
    obj.autoUpdateScene = json.autoUpdateScene;
    obj.clippingPlanes = json.clippingPlanes;
    obj.gammaFactor = json.gammaFactor;
    // obj.gammaInput = json.gammaInput;
    // obj.gammaOutput = json.gammaOutput;
    obj.localClippingEnabled = json.localClippingEnabled;
    obj.physicallyCorrectLights = json.physicallyCorrectLights;
    new WebGLShadowMapSerializer().fromJSON(json.shadowMap, obj.shadowMap);
    obj.sortObjects = json.sortObjects;
    obj.toneMapping = json.toneMapping;
    obj.toneMappingExposure = json.toneMappingExposure;
    obj.toneMappingWhitePoint = json.toneMappingWhitePoint;

    return obj;
};

export default WebGLRendererSerializer;