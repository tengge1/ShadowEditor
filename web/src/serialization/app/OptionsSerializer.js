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
 * OptionsSerializer
 * @author tengge / https://github.com/tengge1
 */
function OptionsSerializer() {
    BaseSerializer.call(this);
}

OptionsSerializer.prototype = Object.create(BaseSerializer.prototype);
OptionsSerializer.prototype.constructor = OptionsSerializer;

OptionsSerializer.prototype.toJSON = function (obj) {
    var json = BaseSerializer.prototype.toJSON.call(this, obj);
    Object.assign(json, obj);
    return json;
};

OptionsSerializer.prototype.fromJSON = function (json) {
    var obj = {};

    Object.keys(json).forEach(n => {
        if (n === '_id' || n === 'metadata' || n === 'server') { // 由于不同服务器的服务端不一样，所以不能反序列化server配置
            return;
        }
        obj[n] = json[n];
    });

    return obj;
};

export default OptionsSerializer;