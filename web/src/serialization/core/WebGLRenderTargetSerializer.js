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
 * WebGLRenderTargetSerializer
 * @author tengge / https://github.com/tengge1
 */
function WebGLRenderTargetSerializer() {
    BaseSerializer.call(this);
}

WebGLRenderTargetSerializer.prototype = Object.create(BaseSerializer.prototype);
WebGLRenderTargetSerializer.prototype.constructor = WebGLRenderTargetSerializer;

WebGLRenderTargetSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.depthBuffer = obj.depthBuffer;
    json.depthTexture = !obj.depthTexture ? null : new TexturesSerializer().toJSON(obj.depthTexture);
    json.height = obj.height;
    json.scissor = obj.scissor;
    json.scissorTest = obj.scissorTest;
    json.stencilBuffer = obj.stencilBuffer;
    json.texture = !obj.texture ? null : new TexturesSerializer().toJSON(obj.texture);
    json.viewport = obj.viewport;
    json.width = obj.width;
    json.isWebGLRenderTarget = obj.isWebGLRenderTarget;

    return json;
};

WebGLRenderTargetSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.WebGLRenderTarget(json.width, json.height) : parent;

    obj.depthBuffer = json.depthBuffer;
    obj.depthTexture = !json.depthTexture ? null : new TexturesSerializer().fromJSON(json.depthTexture);
    obj.height = json.height;
    obj.scissor.copy(json.scissor);
    obj.scissorTest = json.scissorTest;
    obj.stencilBuffer = json.stencilBuffer;
    obj.texture = !json.texture ? null : new TexturesSerializer().fromJSON(json.texture);
    obj.viewport.copy(json.viewport);
    obj.width = json.width;
    obj.isWebGLRenderTarget = json.isWebGLRenderTarget;

    return obj;
};

export default WebGLRenderTargetSerializer;