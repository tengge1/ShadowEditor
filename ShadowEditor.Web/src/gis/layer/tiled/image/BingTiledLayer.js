import TiledImageLayer from '../TiledImageLayer';

/**
 * 必应瓦片图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function BingTiledLayer(globe) {
    TiledImageLayer.call(this, globe);

    this.name = 'bing';
}

BingTiledLayer.prototype = Object.create(TiledImageLayer.prototype);
BingTiledLayer.prototype.constructor = BingTiledLayer;

BingTiledLayer.prototype.getUrl = function (x, y, z) {
    return `http://t0.ssl.ak.tiles.virtualearth.net/tiles/a${this.tileXYToQuadKey(x, y, z)}.jpeg?g=5793`;
};

/**
 * Converts tile XY coordinates into a QuadKey at a specified level of detail.
 * @param {*} tileX Tile X coordinate.
 * @param {*} tileY Tile Y coordinate.
 * @param {*} levelOfDetail evel of detail, from 1 (lowest detail) to 23 (highest detail).
 * @see https://docs.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system
 */
BingTiledLayer.prototype.tileXYToQuadKey = function (tileX, tileY, levelOfDetail) {
    let quadKey = '';
    let digit;
    let mask;
    for (let i = levelOfDetail; i > 0; i--) {
        digit = '0';
        mask = 1 << (i - 1);
        if ((tileX & mask) != 0) {
            digit++;
        }
        if ((tileY & mask) != 0) {
            digit++;
            digit++;
        }
        quadKey += digit;
    }
    return quadKey;
};

export default BingTiledLayer;