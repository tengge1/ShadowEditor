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

import LineBasicMaterialSerializer from './LineBasicMaterialSerializer';
import LineDashedMaterialSerializer from './LineDashedMaterialSerializer';
import MeshBasicMaterialSerializer from './MeshBasicMaterialSerializer';
import MeshDepthMaterialSerializer from './MeshDepthMaterialSerializer';
import MeshDistanceMaterialSerializer from './MeshDistanceMaterialSerializer';
import MeshFaceMaterialSerializer from './MeshFaceMaterialSerializer';
import MeshLambertMaterialSerializer from './MeshLambertMaterialSerializer';
import MeshNormalMaterialSerializer from './MeshNormalMaterialSerializer';
import MeshPhongMaterialSerializer from './MeshPhongMaterialSerializer';
import MeshPhysicalMaterialSerializer from './MeshPhysicalMaterialSerializer';
import MeshStandardMaterialSerializer from './MeshStandardMaterialSerializer';
import MeshToonMaterialSerializer from './MeshToonMaterialSerializer';
import MultiMaterialSerializer from './MultiMaterialSerializer';
import ParticleBasicMaterialSerializer from './ParticleBasicMaterialSerializer';
import ParticleSystemMaterialSerializer from './ParticleSystemMaterialSerializer';
import PointCloudMaterialSerializer from './PointCloudMaterialSerializer';
import PointsMaterialSerializer from './PointsMaterialSerializer';
import RawShaderMaterialSerializer from './RawShaderMaterialSerializer';
import ShaderMaterialSerializer from './ShaderMaterialSerializer';
import ShadowMaterialSerializer from './ShadowMaterialSerializer';
import SpriteCanvasMaterialSerializer from './SpriteCanvasMaterialSerializer';
import SpriteMaterialSerializer from './SpriteMaterialSerializer';

var Serializers = {
    'LineBasicMaterial': LineBasicMaterialSerializer,
    'LineDashedMaterial': LineDashedMaterialSerializer,
    'MeshBasicMaterial': MeshBasicMaterialSerializer,
    'MeshDepthMaterial': MeshDepthMaterialSerializer,
    'MeshDistanceMaterial': MeshDistanceMaterialSerializer,
    'MeshFaceMaterial': MeshFaceMaterialSerializer,
    'MeshLambertMaterial': MeshLambertMaterialSerializer,
    'MeshNormalMaterial': MeshNormalMaterialSerializer,
    'MeshPhongMaterial': MeshPhongMaterialSerializer,
    'MeshPhysicalMaterial': MeshPhysicalMaterialSerializer,
    'MeshStandardMaterial': MeshStandardMaterialSerializer,
    'MeshToonMaterial': MeshToonMaterialSerializer,
    'MultiMaterial': MultiMaterialSerializer,
    'ParticleBasicMaterial': ParticleBasicMaterialSerializer,
    'ParticleSystemMaterial': ParticleSystemMaterialSerializer,
    'PointCloudMaterial': PointCloudMaterialSerializer,
    'PointsMaterial': PointsMaterialSerializer,
    'RawShaderMaterial': RawShaderMaterialSerializer,
    'ShaderMaterial': ShaderMaterialSerializer,
    'ShadowMaterial': ShadowMaterialSerializer,
    'SpriteCanvasMaterial': SpriteCanvasMaterialSerializer,
    'SpriteMaterial': SpriteMaterialSerializer
};

/**
 * MaterialsSerializer
 * @author tengge / https://github.com/tengge1
 */
function MaterialsSerializer() {
    BaseSerializer.call(this);
}

MaterialsSerializer.prototype = Object.create(BaseSerializer.prototype);
MaterialsSerializer.prototype.constructor = MaterialsSerializer;

MaterialsSerializer.prototype.toJSON = function (obj) {
    if (Array.isArray(obj)) { // 多材质
        var list = [];

        obj.forEach(n => {
            var serializer = Serializers[n.type];

            if (serializer === undefined) {
                console.warn(`MaterialsSerializer: No serializer with ${n.type}.`);
                return;
            }

            list.push(new serializer().toJSON(n));
        });

        return list;
    } else { // 单材质
        var serializer = Serializers[obj.type];

        if (serializer === undefined) {
            console.warn(`MaterialsSerializer: No serializer with ${obj.type}.`);
            return null;
        }

        return new serializer().toJSON(obj);
    }
};

MaterialsSerializer.prototype.fromJSON = function (json, parent, server) {
    if (Array.isArray(json)) { // 多材质
        var list = [];

        json.forEach(n => {
            var generator = n.metadata.generator;

            var serializer = Serializers[generator.replace('Serializer', '')];

            if (serializer === undefined) {
                console.warn(`MaterialsSerializer: No deserializer with ${generator}.`);
                return null;
            }

            list.push(new serializer().fromJSON(n, parent, server));
        });

        return list;
    } else { // 单材质
        var generator = json.metadata.generator;

        var serializer = Serializers[generator.replace('Serializer', '')];

        if (serializer === undefined) {
            console.warn(`MaterialsSerializer: No deserializer with ${generator}.`);
            return null;
        }

        return new serializer().fromJSON(json, parent, server);
    }
};

export default MaterialsSerializer;