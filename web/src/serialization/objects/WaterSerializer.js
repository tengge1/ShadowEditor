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
import Water from '../../object/component/Water';

/**
 * WaterSerializer
 * @author tengge / https://github.com/tengge1
 */
class WaterSerializer extends BaseSerializer {
    toJSON(obj) {
        var json = Object3DSerializer.prototype.toJSON.call(this, obj);
        return json;
    }

    fromJSON(json, parent, renderer) {
        var obj = new Water(renderer);

        Object3DSerializer.prototype.fromJSON.call(this, json, obj);

        obj.update();

        return obj;
    }
}

export default WaterSerializer;