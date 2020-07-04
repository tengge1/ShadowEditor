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
import PerlinTerrain from '../../object/terrain/PerlinTerrain';

/**
 * PerlinTerrainSerializer
 * @author tengge / https://github.com/tengge1
 */
function PerlinTerrainSerializer() {
    BaseSerializer.call(this);
}

PerlinTerrainSerializer.prototype = Object.create(BaseSerializer.prototype);
PerlinTerrainSerializer.prototype.constructor = PerlinTerrainSerializer;

PerlinTerrainSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    return json;
};

PerlinTerrainSerializer.prototype.fromJSON = function (json, parent) { // eslint-disable-line
    var terrain = new PerlinTerrain(
        json.userData.width,
        json.userData.depth,
        json.userData.widthSegments,
        json.userData.depthSegments,
        json.userData.quality
    );

    Object3DSerializer.prototype.fromJSON.call(this, json, terrain);

    return terrain;
};

export default PerlinTerrainSerializer;