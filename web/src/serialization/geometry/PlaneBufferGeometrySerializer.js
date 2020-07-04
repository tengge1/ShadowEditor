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
 * PlaneBufferGeometrySerializer
 * @author tengge / https://github.com/tengge1
 */
function PlaneBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

PlaneBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
PlaneBufferGeometrySerializer.prototype.constructor = PlaneBufferGeometrySerializer;

PlaneBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

PlaneBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.PlaneBufferGeometry(
        json.parameters.width,
        json.parameters.height,
        json.parameters.widthSegments,
        json.parameters.heightSegments
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default PlaneBufferGeometrySerializer;