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

import LightShadowSerializer from './LightShadowSerializer';
import DirectionalLightShadowSerializer from './DirectionalLightShadowSerializer';
import SpotLightShadowSerializer from './SpotLightShadowSerializer';

const Serializers = {
    'LightShadow': LightShadowSerializer,
    'DirectionalLightShadow': DirectionalLightShadowSerializer,
    'SpotLightShadow': SpotLightShadowSerializer
};

/**
 * LightShadowsSerializer
 * @author tengge / https://github.com/tengge1
 */
class LightShadowsSerializer extends BaseSerializer {
    toJSON(obj) {
        var serializer = Serializers[obj.constructor.name];

        if (serializer === undefined) {
            console.warn(`LightShadowsSerializer: No serializer with  ${obj.constructor.name}.`);
            return null;
        }

        return new serializer().toJSON(obj);
    }

    fromJSON(json) {
        var generator = json.metadata.generator;

        var serializer = Serializers[generator.replace('Serializer', '')];

        if (serializer === undefined) {
            console.warn(`LightShadowsSerializer: No deserializer with ${generator}.`);
            return null;
        }

        return new serializer().fromJSON(json);
    }
}

export default LightShadowsSerializer;