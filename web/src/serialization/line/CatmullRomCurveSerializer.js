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
import CatmullRomCurve from '../../object/line/CatmullRomCurve';

/**
 * CatmullRomCurveSerializer
 * @author tengge / https://github.com/tengge1
 */
function CatmullRomCurveSerializer() {
    BaseSerializer.call(this);
}

CatmullRomCurveSerializer.prototype = Object.create(BaseSerializer.prototype);
CatmullRomCurveSerializer.prototype.constructor = CatmullRomCurveSerializer;

CatmullRomCurveSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    return json;
};

CatmullRomCurveSerializer.prototype.fromJSON = function (json, parent) {
    json.userData.points = json.userData.points.map(n => {
        return new THREE.Vector3().copy(n);
    });

    var obj = parent || new CatmullRomCurve(json.userData);

    MeshSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default CatmullRomCurveSerializer;