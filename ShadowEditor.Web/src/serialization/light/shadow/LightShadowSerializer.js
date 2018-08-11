import BaseSerializer from '../../BaseSerializer';
import CamerasSerializer from '../../camera/CamerasSerializer';
import WebGLRenderTargetSerializer from '../../core/WebGLRenderTargetSerializer';

/**
 * LightShadowSerializer
 * @param {*} app 
 */
function LightShadowSerializer(app) {
    BaseSerializer.call(this, app);
}

LightShadowSerializer.prototype = Object.create(BaseSerializer.prototype);
LightShadowSerializer.prototype.constructor = LightShadowSerializer;

LightShadowSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);

    json.bias = obj.bias;
    json.camera = (new CamerasSerializer(this.app)).toJSON(obj.camera);
    json.map = obj.map == null ? null : (new WebGLRenderTargetSerializer(this.app)).toJSON(obj.map);
    json.mapSize = obj.mapSize;
    json.matrix = obj.matrix;
    json.radius = obj.radius;

    return json;
};

LightShadowSerializer.prototype.fromJSON = function (json, parent) {
    var camera;

    if (parent === undefined) {
        camera = (new CamerasSerializer(this.app)).fromJSON(json.camera);
    }

    var obj = parent === undefined ? new THREE.LightShadow(camera) : parent;

    obj.bias = json.bias;
    // 纹理时自动生成的，不要反序列化
    // obj.map = json.map == null ? null : (new WebGLRenderTargetSerializer()).fromJSON(json.map);
    obj.mapSize.copy(json.mapSize);
    obj.matrix.copy(json.matrix);
    obj.radius = json.radius;

    return obj;
};

export default LightShadowSerializer;