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
import EllipseCurve from '../../object/line/EllipseCurve';

/**
 * EllipseCurveSerializer
 * @author tengge / https://github.com/tengge1
 */
function EllipseCurveSerializer() {
    BaseSerializer.call(this);
}

EllipseCurveSerializer.prototype = Object.create(BaseSerializer.prototype);
EllipseCurveSerializer.prototype.constructor = EllipseCurveSerializer;

EllipseCurveSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    return json;
};

EllipseCurveSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent || new EllipseCurve(json.userData);

    MeshSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default EllipseCurveSerializer;