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
    json.uniforms = obj.uniforms;
    json.vertexShader = obj.vertexShader;
    json.fragmentShader = obj.fragmentShader;

    return json;
};

RawShaderMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.RawShaderMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    obj.defines = json.defines;
    obj.uniforms = json.uniforms;
    obj.vertexShader = json.vertexShader;
    obj.fragmentShader = json.fragmentShader;

    return obj;
};

export default RawShaderMaterialSerializer;