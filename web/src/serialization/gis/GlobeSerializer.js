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
import Object3DSerializer from '../core/Object3DSerializer';

/**
 * GlobeSerializer
 * @author tengge / https://github.com/tengge1
 */
function GlobeSerializer() {
    BaseSerializer.call(this);
}

GlobeSerializer.prototype = Object.create(BaseSerializer.prototype);
GlobeSerializer.prototype.constructor = GlobeSerializer;

GlobeSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    return json;
};

GlobeSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Bone() : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default GlobeSerializer;