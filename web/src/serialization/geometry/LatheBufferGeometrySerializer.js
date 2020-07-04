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
 * LatheBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function LatheBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

LatheBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
LatheBufferGeometrySerializer.prototype.constructor = LatheBufferGeometrySerializer;

LatheBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

LatheBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.LatheBufferGeometry(
        json.parameters.points,
        json.parameters.segments,
        json.parameters.phiStart,
        json.parameters.phiLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default LatheBufferGeometrySerializer;