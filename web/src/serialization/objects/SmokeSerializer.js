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
import MeshSerializer from '../core/MeshSerializer';
import Smoke from '../../object/component/Smoke';

/**
 * SmokeSerializer
 * @author tengge / https://github.com/tengge1
 */
function SmokeSerializer() {
    BaseSerializer.call(this);
}

SmokeSerializer.prototype = Object.create(BaseSerializer.prototype);
SmokeSerializer.prototype.constructor = SmokeSerializer;

SmokeSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    return json;
};

SmokeSerializer.prototype.fromJSON = function (json, parent, camera, renderer) {
    var obj = parent || new Smoke(camera, renderer, json.userData);

    MeshSerializer.prototype.fromJSON.call(this, json, obj);

    obj.update(0);

    return obj;
};

export default SmokeSerializer;