//------------------------------------------------------------------------------
// <copyright company="Microsoft">
//     Copyright (c) 2006-2009 Microsoft Corporation.  All rights reserved.
// </copyright>
//------------------------------------------------------------------------------

// https://docs.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system

const EarthRadius = 6378137;
const MinLatitude = -85.05112878;
const MaxLatitude = 85.05112878;
const MinLongitude = -180;
const MaxLongitude = 180;

class BingTileSystem {
    /// <summary>
    /// Clips a number to the specified minimum and maximum values.
    /// </summary>
    /// <param name="n">The number to clip.</param>
    /// <param name="minValue">Minimum allowable value.</param>
    /// <param name="maxValue">Maximum allowable value.</param>
    /// <returns>The clipped value.</returns>
    clip(n, minValue, maxValue) {
        return Math.min(Math.max(n, minValue), maxValue);
    }

    /// <summary>
    /// Determines the map width and height (in pixels) at a specified level
    /// of detail.
    /// </summary>
    /// <param name="levelOfDetail">Level of detail, from 1 (lowest detail)
    /// to 23 (highest detail).</param>
    /// <returns>The map width and height in pixels.</returns>
    mapSize(levelOfDetail) {
        return parseInt(256 << levelOfDetail);
    }

    /// <summary>
    /// Determines the ground resolution (in meters per pixel) at a specified
    /// latitude and level of detail.
    /// </summary>
    /// <param name="latitude">Latitude (in degrees) at which to measure the
    /// ground resolution.</param>
    /// <param name="levelOfDetail">Level of detail, from 1 (lowest detail)
    /// to 23 (highest detail).</param>
    /// <returns>The ground resolution, in meters per pixel.</returns>
    groundResolution(latitude, levelOfDetail) {
        latitude = this.clip(latitude, MinLatitude, MaxLatitude);
        return Math.cos(latitude * Math.PI / 180) * 2 * Math.PI * EarthRadius / this.mapSize(levelOfDetail);
    }

    /// <summary>
    /// Determines the map scale at a specified latitude, level of detail,
    /// and screen resolution.
    /// </summary>
    /// <param name="latitude">Latitude (in degrees) at which to measure the
    /// map scale.</param>
    /// <param name="levelOfDetail">Level of detail, from 1 (lowest detail)
    /// to 23 (highest detail).</param>
    /// <param name="screenDpi">Resolution of the screen, in dots per inch.</param>
    /// <returns>The map scale, expressed as the denominator N of the ratio 1 : N.</returns>
    mapScale(latitude, levelOfDetail, screenDpi) {
        return GroundResolution(latitude, levelOfDetail) * screenDpi / 0.0254;
    }

    /// <summary>
    /// Converts a point from latitude/longitude WGS-84 coordinates (in degrees)
    /// into pixel XY coordinates at a specified level of detail.
    /// </summary>
    /// <param name="longitude">Longitude of the point, in degrees.</param>
    /// <param name="latitude">Latitude of the point, in degrees.</param>
    /// <param name="levelOfDetail">Level of detail, from 1 (lowest detail)
    /// to 23 (highest detail).</param>
    /// <returns>the [X,Y] coordinate in pixels.</returns>
    longLatToPixelXY(longitude, latitude, levelOfDetail) {
        latitude = this.clip(latitude, MinLatitude, MaxLatitude);
        longitude = this.clip(longitude, MinLongitude, MaxLongitude);

        let x = (longitude + 180) / 360;
        let sinLatitude = Math.sin(latitude * Math.PI / 180);
        let y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);

        let mapSize = this.mapSize(levelOfDetail);
        let pixelX = parseInt(this.clip(x * mapSize + 0.5, 0, mapSize - 1));
        let pixelY = parseInt(this.clip(y * mapSize + 0.5, 0, mapSize - 1));
        return [pixelX, pixelY];
    }

    /// <summary>
    /// Converts a pixel from pixel XY coordinates at a specified level of detail
    /// into latitude/longitude WGS-84 coordinates (in degrees).
    /// </summary>
    /// <param name="pixelX">X coordinate of the point, in pixels.</param>
    /// <param name="pixelY">Y coordinates of the point, in pixels.</param>
    /// <param name="levelOfDetail">Level of detail, from 1 (lowest detail)
    /// to 23 (highest detail).</param>
    /// <returns>the [latitude,longitude] in degrees.</returns>
    pixelXYToLongLat(pixelX, pixelY, levelOfDetail) {
        let mapSize = this.mapSize(levelOfDetail);
        let x = (this.clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
        let y = 0.5 - (this.clip(pixelY, 0, mapSize - 1) / mapSize);

        let latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
        let longitude = 360 * x;
        return [longitude, latitude];
    }

    /// <summary>
    /// Converts pixel XY coordinates into tile XY coordinates of the tile containing
    /// the specified pixel.
    /// </summary>
    /// <param name="pixelX">Pixel X coordinate.</param>
    /// <param name="pixelY">Pixel Y coordinate.</param>
    /// <returns>the tile [X,Y] coordinate.</returns>
    pixelXYToTileXY(pixelX, pixelY) {
        let tileX = pixelX / 256;
        let tileY = pixelY / 256;
        return [tileX, tileY];
    }

    /// <summary>
    /// Converts tile XY coordinates into pixel XY coordinates of the upper-left pixel
    /// of the specified tile.
    /// </summary>
    /// <param name="tileX">Tile X coordinate.</param>
    /// <param name="tileY">Tile Y coordinate.</param>
    /// <returns>the pixel [X,Y] coordinate.</returns>
    tileXYToPixelXY(tileX, tileY) {
        let pixelX = tileX * 256;
        let pixelY = tileY * 256;
        return [pixelX, pixelY];
    }

    /// <summary>
    /// Converts tile XY coordinates into a QuadKey at a specified level of detail.
    /// </summary>
    /// <param name="tileX">Tile X coordinate.</param>
    /// <param name="tileY">Tile Y coordinate.</param>
    /// <param name="levelOfDetail">Level of detail, from 1 (lowest detail)
    /// to 23 (highest detail).</param>
    /// <returns>A string containing the QuadKey.</returns>
    tileXYToQuadKey(tileX, tileY, levelOfDetail) {
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
    }

    /// <summary>
    /// Converts a QuadKey into tile XY coordinates.
    /// </summary>
    /// <param name="quadKey">QuadKey of the tile.</param>
    /// <returns>the tile X coordinate,the tile Y coordinate, the level of detail.</returns>
    quadKeyToTileXY(quadKey) {
        let tileX = tileY = 0;
        let levelOfDetail = quadKey.Length;
        for (i = levelOfDetail; i > 0; i--) {
            mask = 1 << (i - 1);
            switch (quadKey[levelOfDetail - i]) {
                case '0':
                    break;
                case '1':
                    tileX |= mask;
                    break;
                case '2':
                    tileY |= mask;
                    break;
                case '3':
                    tileX |= mask;
                    tileY |= mask;
                    break;
                default:
                    throw new ArgumentException("Invalid QuadKey digit sequence.");
            }
        }
        return [tileX, tileY, levelOfDetail];
    }

    /// <summary>
    /// Converts tile XY coordinates to url.
    /// </summary>
    /// <param name="tileX">Tile X coordinate.</param>
    /// <param name="tileY">Tile Y coordinate.</param>
    /// <param name="levelOfDetail">Level of detail, from 1 (lowest detail)
    /// to 23 (highest detail).</param>
    /// <returns>url of the tile</returns>
    tileXYToUrl(tileX, tileY, levelOfDetail) {
        let key = this.tileXYToQuadKey(tileX, tileY, parseInt(levelOfDetail));
        return `http://t0.ssl.ak.tiles.virtualearth.net/tiles/a${key}.jpeg?g=5793`;
    }
}

export default BingTileSystem;