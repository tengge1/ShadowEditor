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
import Object3DSerializer from './Object3DSerializer';

import MaterialsSerializer from '../material/MaterialsSerializer';

/**
 * SpriteSerializer
 * @author tengge / https://github.com/tengge1
 */
function SpriteSerializer() {
    BaseSerializer.call(this);
}

SpriteSerializer.prototype = Object.create(BaseSerializer.prototype);
SpriteSerializer.prototype.constructor = SpriteSerializer;

SpriteSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.center = obj.center;
    json.material = new MaterialsSerializer().toJSON(obj.material);
    json.z = obj.z;
    json.isSprite = obj.isSprite;

    return json;
};

SpriteSerializer.prototype.fromJSON = function (json, parent, server) {
    var material;

    if (parent === undefined) {
        if (!json.material) {
            console.warn(`SpriteSerializer: ${json.name} json.material is not defined.`);
            return null;
        }
        material = new MaterialsSerializer().fromJSON(json.material, undefined, server);
    }

    var obj = parent === undefined ? new THREE.Sprite(material) : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.center.copy(json.center);
    obj.z = json.z;

    return obj;
};

export default SpriteSerializer;