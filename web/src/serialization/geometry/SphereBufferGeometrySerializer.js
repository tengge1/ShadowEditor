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
 * SphereBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function SphereBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

SphereBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
SphereBufferGeometrySerializer.prototype.constructor = SphereBufferGeometrySerializer;

SphereBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

SphereBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.SphereBufferGeometry(
        json.parameters.radius,
        json.parameters.widthSegments,
        json.parameters.heightSegments,
        json.parameters.phiStart,
        json.parameters.phiLength,
        json.parameters.thetaStart,
        json.parameters.thetaLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default SphereBufferGeometrySerializer;