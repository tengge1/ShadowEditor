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
 * TeapotBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function TeapotBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

TeapotBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TeapotBufferGeometrySerializer.prototype.constructor = TeapotBufferGeometrySerializer;

TeapotBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TeapotBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TeapotBufferGeometry(
        json.parameters.size,
        json.parameters.segments,
        json.parameters.bottom,
        json.parameters.lid,
        json.parameters.body,
        json.parameters.fitLid,
        json.parameters.blinn
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default TeapotBufferGeometrySerializer;