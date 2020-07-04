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
 * AnimationSerializer
 * @author tengge / https://github.com/tengge1
 */
function AnimationSerializer() {
    BaseSerializer.call(this);
}

AnimationSerializer.prototype = Object.create(BaseSerializer.prototype);
AnimationSerializer.prototype.constructor = AnimationSerializer;

AnimationSerializer.prototype.toJSON = function (list) {
    var jsons = [];

    list.forEach(n => {
        var json = BaseSerializer.prototype.toJSON.call(this, n);
        Object.assign(json, n);
        jsons.push(json);
    });

    return jsons;
};

AnimationSerializer.prototype.fromJSON = function (jsons) {
    var list = [];

    jsons.forEach(n => {
        var obj = Object.assign({}, n);
        delete obj.metadata;
        list.push(obj);
    });

    return list;
};

export default AnimationSerializer;