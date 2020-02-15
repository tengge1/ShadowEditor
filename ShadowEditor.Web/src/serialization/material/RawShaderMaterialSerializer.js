import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';
import UniformsSerializer from './UniformsSerializer';

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
    json.uniforms = new UniformsSerializer().toJSON(obj.uniforms);
    json.vertexShader = obj.vertexShader;
    json.fragmentShader = obj.fragmentShader;

    return json;
};

RawShaderMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.RawShaderMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    obj.defines = json.defines;
    obj.uniforms = new UniformsSerializer().fromJSON(json.uniforms, undefined, server);
    obj.vertexShader = json.vertexShader;
    obj.fragmentShader = json.fragmentShader;

    return obj;
};

export default RawShaderMaterialSerializer;