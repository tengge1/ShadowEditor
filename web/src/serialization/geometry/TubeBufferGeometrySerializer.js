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
 * TubeBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function TubeBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

TubeBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TubeBufferGeometrySerializer.prototype.constructor = TubeBufferGeometrySerializer;

TubeBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TubeBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TubeBufferGeometry(
        json.parameters.path,
        json.parameters.tubularSegments,
        json.parameters.radius,
        json.parameters.radialSegments,
        json.parameters.closed
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default TubeBufferGeometrySerializer;