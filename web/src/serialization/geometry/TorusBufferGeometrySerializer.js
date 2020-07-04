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
 * TorusBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function TorusBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

TorusBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TorusBufferGeometrySerializer.prototype.constructor = TorusBufferGeometrySerializer;

TorusBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TorusBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TorusBufferGeometry(
        json.parameters.radius,
        json.parameters.tube,
        json.parameters.radialSegments,
        json.parameters.tubularSegments,
        json.parameters.arc
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default TorusBufferGeometrySerializer;