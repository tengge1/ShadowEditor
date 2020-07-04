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
import MaterialSerializer from './MaterialSerializer';
import UniformsSerializer from './UniformsSerializer';

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
    json.uniforms = new UniformsSerializer().toJSON(obj.uniforms);
    json.vertexShader = obj.vertexShader;
    json.fragmentShader = obj.fragmentShader;

    json.extensions = obj.extensions;

    return json;
};

ShaderMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.ShaderMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    obj.defines = json.defines;
    obj.uniforms = new UniformsSerializer().fromJSON(json.uniforms, undefined, server);
    obj.vertexShader = json.vertexShader;
    obj.fragmentShader = json.fragmentShader;

    obj.extensions = json.extensions;

    return obj;
};

export default ShaderMaterialSerializer;