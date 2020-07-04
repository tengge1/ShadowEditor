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
 * LineDashedMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function LineDashedMaterialSerializer() {
    BaseSerializer.call(this);
}

LineDashedMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
LineDashedMaterialSerializer.prototype.constructor = LineDashedMaterialSerializer;

LineDashedMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

LineDashedMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.LineDashedMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default LineDashedMaterialSerializer;