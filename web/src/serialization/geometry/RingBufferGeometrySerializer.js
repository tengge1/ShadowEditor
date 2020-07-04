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
 * RingBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function RingBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

RingBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
RingBufferGeometrySerializer.prototype.constructor = RingBufferGeometrySerializer;

RingBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

RingBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.RingBufferGeometry(
        json.parameters.innerRadius,
        json.parameters.outerRadius,
        json.parameters.thetaSegments,
        json.parameters.phiSegments,
        json.parameters.thetaStart,
        json.parameters.thetaLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default RingBufferGeometrySerializer;