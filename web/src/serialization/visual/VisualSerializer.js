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

/**
 * VisualSerializer
 * @author tengge / https://github.com/tengge1
 */
function VisualSerializer() {
    BaseSerializer.call(this);
}

VisualSerializer.prototype = Object.create(BaseSerializer.prototype);
VisualSerializer.prototype.constructor = VisualSerializer;

VisualSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);
    json.data = obj.toJSON();
    return json;
};

VisualSerializer.prototype.fromJSON = function (json) {
    return json.data ? json.data : null;
};

export default VisualSerializer;