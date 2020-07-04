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
 * ExtrudeBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function ExtrudeBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

ExtrudeBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
ExtrudeBufferGeometrySerializer.prototype.constructor = ExtrudeBufferGeometrySerializer;

ExtrudeBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

ExtrudeBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    // TODO

    var obj = parent === undefined ? new THREE.ExtrudeBufferGeometry(
        json.parameters.shapes,
        json.parameters.options
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default ExtrudeBufferGeometrySerializer;