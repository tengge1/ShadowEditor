import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * ShaderMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function ShaderMaterialSerializer() {
    BaseSerializer.call(this);
}

ShaderMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
ShaderMaterialSerializer.prototype.constructor = ShaderMaterialSerializer;

ShaderMaterialSerializer.prototype.toJSON = function (obj) {
    var json = MaterialSerializer.prototype.toJSON.call(this, obj);

    json.defines = obj.defines;
    json.uniforms = obj.uniforms;
    json.vertexShader = obj.vertexShader;
    json.fragmentShader = obj.fragmentShader;

    return json;
};

ShaderMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ShaderMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    obj.defines = json.defines;
    obj.uniforms = json.uniforms;
    obj.vertexShader = json.vertexShader;
    obj.fragmentShader = json.fragmentShader;

    return obj;
};

export default ShaderMaterialSerializer;