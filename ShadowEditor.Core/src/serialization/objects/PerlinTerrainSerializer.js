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

PerlinTerrainSerializer.prototype.fromJSON = function (json, parent) {
    var terrain = new PerlinTerrain(
        json.userData.width,
        json.userData.depth,
        json.userData.widthSegments,
        json.userData.depthSegments,
        json.userData.quality,
    );

    Object3DSerializer.prototype.fromJSON.call(this, json, terrain);

    return terrain;
};

export default PerlinTerrainSerializer;