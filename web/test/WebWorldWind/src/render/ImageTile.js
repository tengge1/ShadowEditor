/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports ImageTile
 */
import TextureTile from '../render/TextureTile';


/**
 * Constructs an image tile.
 * @alias ImageTile
 * @constructor
 * @classdesc Represents an image applied to a portion of a globe's terrain. Applications typically do not
 * interact with this class.
 * @augments TextureTile
 * @param {Sector} sector The sector this tile covers.
 * @param {Level} level The level this tile is associated with.
 * @param {Number} row This tile's row in the associated level.
 * @param {Number} column This tile's column in the associated level.
 *
 */
function ImageTile(sector, level, row, column) {
    TextureTile.call(this, sector, level, row, column);

    this.fallbackTile = null;
    this.texture = null;
}

ImageTile.prototype = Object.create(TextureTile.prototype);

ImageTile.prototype.size = function () {
    return 0;
};

/**
 * Causes this tile's texture to be active. Implements [SurfaceTile.bind]{@link SurfaceTile#bind}.
 * @param {DrawContext} dc The current draw context.
 * @returns {Boolean} true if the texture was bound successfully, otherwise false.
 */
ImageTile.prototype.bind = function (dc) {
    if (this.texture) {
        this.texture.bind(dc);
        return true;
    }
    // Attempt to bind in TextureTile first.
    var isBound = this.__proto__.__proto__.bind.call(this, dc);
    if (isBound) {
        return true;
    }

    if (this.fallbackTile) {
        return this.fallbackTile.bind(dc);
    }

    return false;
};

/**
 * If this tile's fallback texture is used, applies the appropriate texture transform to a specified matrix.
 * @param {DrawContext} dc The current draw context.
 * @param {THREE.Matrix4} matrix The matrix to apply the transform to.
 */
ImageTile.prototype.applyInternalTransform = function (dc, matrix) {
    if (!this.texture) {
        this.applyFallbackTransform(matrix);
    }
};

// Intentionally not documented.
ImageTile.prototype.applyFallbackTransform = function () {
    var temp = new THREE.Matrix4();
    return function (matrix) {
        var deltaLevel = this.level.levelNumber - this.fallbackTile.level.levelNumber;
        if (deltaLevel <= 0)
            return;

        var fbTileDeltaLat = this.fallbackTile.sector.deltaLatitude(),
            fbTileDeltaLon = this.fallbackTile.sector.deltaLongitude(),
            sx = this.sector.deltaLongitude() / fbTileDeltaLon,
            sy = this.sector.deltaLatitude() / fbTileDeltaLat,
            tx = (this.sector.minLongitude - this.fallbackTile.sector.minLongitude) / fbTileDeltaLon,
            ty = (this.sector.minLatitude - this.fallbackTile.sector.minLatitude) / fbTileDeltaLat;

        // Apply a transform to the matrix that maps texture coordinates for this tile to texture coordinates for the
        // fallback tile. Rather than perform the full set of matrix operations, a single multiply is performed with the
        // precomputed non-zero values:
        //
        // Matrix trans = THREE.Matrix4.fromTranslation(tx, ty, 0);
        // Matrix scale = Matrix.fromScale(sxy, sxy, 1);
        // matrix.multiply(trans);
        // matrix.multiply(scale);

        temp.set(
            sx, 0, 0, tx,
            0, sy, 0, ty,
            0, 0, 1, 0,
            0, 0, 0, 1
        );

        matrix.multiply(temp);
    };
}();

export default ImageTile;
