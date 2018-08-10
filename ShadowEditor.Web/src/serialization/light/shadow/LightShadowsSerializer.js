import BaseSerializer from '../../BaseSerializer';

import LightShadowSerializer from './LightShadowSerializer';
import DirectionalLightShadowSerializer from './DirectionalLightShadowSerializer';
import SpotLightShadowSerializer from './SpotLightShadowSerializer';

var Serializers = {
    'LightShadow': LightShadowSerializer,
    'DirectionalLightShadow': DirectionalLightShadowSerializer,
    'SpotLightShadow': SpotLightShadowSerializer
};

/**
 * LightShadowsSerializer
 */
function LightShadowsSerializer() {
    BaseSerializer.call(this);
}

LightShadowsSerializer.prototype = Object.create(BaseSerializer.prototype);
LightShadowsSerializer.prototype.constructor = LightShadowsSerializer;

LightShadowsSerializer.prototype.toJSON = function (obj) {
    var serializer = Serializers[obj.constructor.name];

    if (serializer === undefined) {
        console.warn(`LightShadowsSerializer: 无法序列化${obj.constructor.name}。`);
        return null;
    }

    return (new serializer()).toJSON(obj);
};

LightShadowsSerializer.prototype.fromJSON = function (json) {
    var generator = json.metadata.generator;

    var serializer = Serializers[generator.replace('Serializer', '')];

    if (serializer === undefined) {
        console.warn(`LightShadowsSerializer: 不存在 ${generator} 的反序列化器`);
        return null;
    }

    return (new serializer()).fromJSON(json);
};

export default LightShadowsSerializer;