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

    this.tiles = [];

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            var tile = new Tile(i, j, 1);
            tile.material = new TiledMaterial(i, j, 1);
            this.tiles.push(tile);
        }
    }
}

SphereTileCreator.prototype = Object.create(TileCreator.prototype);
SphereTileCreator.prototype.constructor = SphereTileCreator;

SphereTileCreator.prototype.get = function (lon, lat, alt) {
    //var zoom = MathUtils.altToZoom(alt);

    // var tiles = [];

    // this.fork(0, 0, 0, tiles);

    return this.tiles;
};

SphereTileCreator.prototype.fork = function (x, y, z, tiles) {

};

export default SphereTileCreator;