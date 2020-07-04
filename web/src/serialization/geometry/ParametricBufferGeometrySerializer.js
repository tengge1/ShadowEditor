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
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * ParametricBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function ParametricBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

ParametricBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
ParametricBufferGeometrySerializer.prototype.constructor = ParametricBufferGeometrySerializer;

ParametricBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

ParametricBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.ParametricBufferGeometry(
        json.parameters.func,
        json.parameters.slices,
        json.parameters.stacks
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ParametricBufferGeometrySerializer;