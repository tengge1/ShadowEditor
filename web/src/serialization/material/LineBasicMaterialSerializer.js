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
 * LineBasicMaterialSerializer
 * @author tengge / https://github.com/tengge1
 */
function LineBasicMaterialSerializer() {
    BaseSerializer.call(this);
}

LineBasicMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
LineBasicMaterialSerializer.prototype.constructor = LineBasicMaterialSerializer;

LineBasicMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

LineBasicMaterialSerializer.prototype.fromJSON = function (json, parent, server) {
    var obj = parent === undefined ? new THREE.LineBasicMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj, server);

    return obj;
};

export default LineBasicMaterialSerializer;