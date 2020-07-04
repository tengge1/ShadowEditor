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
 * MeshLambertMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function MeshLambertMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshLambertMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshLambertMaterialSerializer.prototype.constructor = MeshLambertMaterialSerializer;

MeshLambertMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshLambertMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.MeshLambertMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default MeshLambertMaterialSerializer;