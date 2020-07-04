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

/**
 * MeshPhongMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function MeshPhongMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshPhongMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshPhongMaterialSerializer.prototype.constructor = MeshPhongMaterialSerializer;

MeshPhongMaterialSerializer.prototype.toJSON = function (obj) {
    let json = MaterialSerializer.prototype.toJSON.call(this, obj);

    json.specular = obj.specular;
    json.shininess = obj.shininess;

    return json;
};

MeshPhongMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.MeshPhongMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    obj.specular = new THREE.Color(json.specular);
    obj.shininess = json.shininess;

    return obj;
};

export default MeshPhongMaterialSerializer;