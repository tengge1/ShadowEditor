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
import Sky from '../../object/component/Sky';

/**
 * SkySerializer
 * @author tengge / https://github.com/tengge1
 */
function SkySerializer() {
    BaseSerializer.call(this);
}

SkySerializer.prototype = Object.create(BaseSerializer.prototype);
SkySerializer.prototype.constructor = SkySerializer;

SkySerializer.prototype.toJSON = function (obj) {
    return Object3DSerializer.prototype.toJSON.call(this, obj);
};

SkySerializer.prototype.fromJSON = function (json, parent, camera) { // eslint-disable-line
    var obj = new Sky(json);

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default SkySerializer;