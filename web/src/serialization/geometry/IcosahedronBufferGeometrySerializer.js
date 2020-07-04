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
 * IcosahedronBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function IcosahedronBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

IcosahedronBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
IcosahedronBufferGeometrySerializer.prototype.constructor = IcosahedronBufferGeometrySerializer;

IcosahedronBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

IcosahedronBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.IcosahedronBufferGeometry(
        json.parameters.radius,
        json.parameters.detail
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default IcosahedronBufferGeometrySerializer;