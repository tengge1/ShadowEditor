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
 * TorusKnotBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function TorusKnotBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

TorusKnotBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TorusKnotBufferGeometrySerializer.prototype.constructor = TorusKnotBufferGeometrySerializer;

TorusKnotBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TorusKnotBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TorusKnotBufferGeometry(
        json.parameters.radius,
        json.parameters.tube,
        json.parameters.tubularSegments,
        json.parameters.radialSegments,
        json.parameters.p,
        json.parameters.q
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default TorusKnotBufferGeometrySerializer;