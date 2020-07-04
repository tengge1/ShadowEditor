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
 * CylinderBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function CylinderBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

CylinderBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
CylinderBufferGeometrySerializer.prototype.constructor = CylinderBufferGeometrySerializer;

CylinderBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

CylinderBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.CylinderBufferGeometry(
        json.parameters.radiusTop,
        json.parameters.radiusBottom,
        json.parameters.height,
        json.parameters.radialSegments,
        json.parameters.heightSegments,
        json.parameters.openEnded,
        json.parameters.thetaStart,
        json.parameters.thetaLength
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default CylinderBufferGeometrySerializer;