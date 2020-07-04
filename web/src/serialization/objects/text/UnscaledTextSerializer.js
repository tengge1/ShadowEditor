/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseSerializer from '../../BaseSerializer';
import Object3DSerializer from '../../core/Object3DSerializer';
import UnscaledText from '../../../object/text/UnscaledText';

/**
 * UnscaledTextSerializer
 * @author tengge / https://github.com/tengge1
 */
function UnscaledTextSerializer() {
    BaseSerializer.call(this);
}

UnscaledTextSerializer.prototype = Object.create(BaseSerializer.prototype);
UnscaledTextSerializer.prototype.constructor = UnscaledTextSerializer;

UnscaledTextSerializer.prototype.toJSON = function (obj) {
    return Object3DSerializer.prototype.toJSON.call(this, obj);
};

UnscaledTextSerializer.prototype.fromJSON = function (json, parent, options) {
    var obj = new UnscaledText(json.userData.text, {
        domWidth: options.domWidth,
        domHeight: options.domHeight
    });

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default UnscaledTextSerializer;