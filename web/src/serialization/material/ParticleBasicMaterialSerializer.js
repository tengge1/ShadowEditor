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
 * ParticleBasicMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function ParticleBasicMaterialSerializer() {
    BaseSerializer.call(this);
}

ParticleBasicMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
ParticleBasicMaterialSerializer.prototype.constructor = ParticleBasicMaterialSerializer;

ParticleBasicMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

ParticleBasicMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.ParticleBasicMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default ParticleBasicMaterialSerializer;