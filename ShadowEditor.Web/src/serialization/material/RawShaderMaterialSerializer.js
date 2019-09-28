import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * RawShaderMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function RawShaderMaterialSerializer() {
    BaseSerializer.call(this);
}

RawShaderMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
RawShaderMaterialSerializer.prototype.constructor = RawShaderMaterialSerializer;

RawShaderMaterialSerializer.prototype.toJSON = function (obj) {
    var json = MaterialSerializer.prototype.toJSON.call(this, obj);

    json.defines = obj.defines;

    json.uniforms = {};

    // TODO: 着色器材质uniforms序列化有很多bug。
    for (var i in obj.uniforms) {
        var uniform = obj.uniforms[i];
        if (uniform.value instanceof THREE.Color) {
            json.uniforms[i] = {
                type: 'color',
                value: uniform.value
            };
        } else {
            json.uniforms[i] = {
                value: uniform.value
            };
        }
    }

    json.vertexShader = obj.vertexShader;
    json.fragmentShader = obj.fragmentShader;

    return json;
};

RawShaderMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.RawShaderMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    obj.defines = json.defines;

    obj.uniforms = {};

    // TODO: 着色器材质uniforms反序列化有很多bug。
    for (var i in json.uniforms) {
        var uniform = json.uniforms[i];
        if (uniform.type === 'color') {
            obj.uniforms[i] = {
                value: new THREE.Color(uniform.value)
            };
        } else {
            obj.uniforms[i] = {
                value: uniform.value
            };
        }
    }

    obj.vertexShader = json.vertexShader;
    obj.fragmentShader = json.fragmentShader;

    return obj;
};

export default RawShaderMaterialSerializer;