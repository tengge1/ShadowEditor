import BaseSerializer from '../BaseSerializer';
import TexturesSerializer from '../texture/TexturesSerializer';

/**
 * WebGLRenderTargetSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function WebGLRenderTargetSerializer(app) {
    BaseSerializer.call(this, app);
}

WebGLRenderTargetSerializer.prototype = Object.create(BaseSerializer.prototype);
WebGLRenderTargetSerializer.prototype.constructor = WebGLRenderTargetSerializer;

WebGLRenderTargetSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.depthBuffer = obj.depthBuffer;
    json.depthTexture = obj.depthTexture == null ? null : (new TexturesSerializer(this.app)).toJSON(obj.depthTexture);
    json.height = obj.height;
    json.scissor = obj.scissor;
    json.scissorTest = obj.scissorTest;
    json.stencilBuffer = obj.stencilBuffer;
    json.texture = obj.texture == null ? null : (new TexturesSerializer(this.app)).toJSON(obj.texture);
    json.viewport = obj.viewport;
    json.width = obj.width;
    json.isWebGLRenderTarget = obj.isWebGLRenderTarget;

    return json;
};

WebGLRenderTargetSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.WebGLRenderTarget(json.width, json.height) : parent;

    obj.depthBuffer = json.depthBuffer;
    obj.depthTexture = json.depthTexture == null ? null : (new TexturesSerializer(this.app)).fromJSON(json.depthTexture);
    obj.height = json.height;
    obj.scissor.copy(json.scissor);
    obj.scissorTest = json.scissorTest;
    obj.stencilBuffer = json.stencilBuffer;
    obj.texture = json.texture == null ? null : (new TexturesSerializer(this.app)).fromJSON(json.texture);
    obj.viewport.copy(json.viewport);
    obj.width = json.width;
    obj.isWebGLRenderTarget = json.isWebGLRenderTarget;

    return obj;
};

export default WebGLRenderTargetSerializer;