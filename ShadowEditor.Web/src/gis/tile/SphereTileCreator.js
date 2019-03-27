import TileCreator from './TileCreator';
import Tile from './Tile';
import TiledMaterial from '../render/material/TiledMaterial';
import MathUtils from '../utils/MathUtils';

/**
 * 球形瓦片创建者
 */
function SphereTileCreator() {
    TileCreator.call(this);
    this.tree = rbush();

    this.tile0 = new Tile(0, 0, 0);
    this.tile0.material = new TiledMaterial();
}

SphereTileCreator.prototype = Object.create(TileCreator.prototype);
SphereTileCreator.prototype.constructor = SphereTileCreator;

SphereTileCreator.prototype.get = function (lon, lat, alt) {
    var zoom = MathUtils.altToZoom(alt);

    // var tiles = [];

    // this.fork(0, 0, 0, tiles);

    return [this.tile0];
};

SphereTileCreator.prototype.fork = function (x, y, z, tiles) {

};

export default SphereTileCreator;