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
 * OctahedronBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function OctahedronBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

OctahedronBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
OctahedronBufferGeometrySerializer.prototype.constructor = OctahedronBufferGeometrySerializer;

OctahedronBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

OctahedronBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.OctahedronBufferGeometry(
        json.parameters.radius,
        json.parameters.detail
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default OctahedronBufferGeometrySerializer;