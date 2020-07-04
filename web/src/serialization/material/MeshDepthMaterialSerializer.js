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
 * MeshDepthMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function MeshDepthMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshDepthMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshDepthMaterialSerializer.prototype.constructor = MeshDepthMaterialSerializer;

MeshDepthMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshDepthMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.MeshDepthMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default MeshDepthMaterialSerializer;