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
 * @exports ElevationImage
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import WWMath from '../util/WWMath';


/**
 * Constructs an elevation image.
 * @alias ElevationImage
 * @constructor
 * @classdesc Holds elevation values for an elevation tile.
 * This class is typically not used directly by applications.
 * @param {Sector} sector The sector spanned by this elevation image.
 * @param {Number} imageWidth The number of longitudinal sample points in this elevation image.
 * @param {Number} imageHeight The number of latitudinal sample points in this elevation image.
 * @throws {ArgumentError} If the sector is null or undefined
 */
function ElevationImage(sector, imageWidth, imageHeight) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationImage", "constructor", "missingSector"));
    }

    /**
     * The sector spanned by this elevation image.
     * @type {Sector}
     * @readonly
     */
    this.sector = sector;

    /**
     * The number of longitudinal sample points in this elevation image.
     * @type {Number}
     * @readonly
     */
    this.imageWidth = imageWidth;

    /**
     * The number of latitudinal sample points in this elevation image.
     * @type {Number}
     * @readonly
     */
    this.imageHeight = imageHeight;

    /**
     * The size in bytes of this elevation image.
     * @type {number}
     * @readonly
     */
    this.size = this.imageWidth * this.imageHeight;

    /**
     * Internal use only
     * false if the entire image consists of NO_DATA values, true otherwise.
     * @ignore
     */
    this.hasData = true;

    /**
     * Internal use only
     * true if any pixel in the image has a NO_DATA value, false otherwise.
     * @ignore
     */
    this.hasMissingData = false;
}

/**
 * Internal use only
 * The value that indicates a pixel contains no data.
 * TODO: This will eventually need to become an instance property
 * @ignore
 */
ElevationImage.NO_DATA = 0;

/**
 * Internal use only
 * Returns true if a set of elevation pixels represents the NO_DATA value.
 * @ignore
 */
ElevationImage.isNoData = function (x0y0, x1y0, x0y1, x1y1) {
    // TODO: Change this logic once proper NO_DATA value handling is in place.
    var v = ElevationImage.NO_DATA;
    return x0y0 === v &&
        x1y0 === v &&
        x0y1 === v &&
        x1y1 === v;
};

/**
 * Returns the pixel value at a specified coordinate in this elevation image. The coordinate origin is the
 * image's lower left corner, so (0, 0) indicates the lower left pixel and (imageWidth-1, imageHeight-1)
 * indicates the upper right pixel. This returns 0 if the coordinate indicates a pixel outside of this elevation
 * image.
 * @param x The pixel's X coordinate.
 * @param y The pixel's Y coordinate.
 * @returns {Number} The pixel value at the specified coordinate in this elevation image.
 * Returns 0 if the coordinate indicates a pixel outside of this elevation image.
 */
ElevationImage.prototype.pixel = function (x, y) {
    if (x < 0 || x >= this.imageWidth) {
        return 0;
    }

    if (y < 0 || y >= this.imageHeight) {
        return 0;
    }

    y = this.imageHeight - y - 1; // flip the y coordinate origin to the lower left corner
    return this.imageData[x + y * this.imageWidth];
};

/**
 * Returns the elevation at a specified geographic location.
 * @param {Number} latitude The location's latitude.
 * @param {Number} longitude The location's longitude.
 * @returns {Number} The elevation at the specified location.
 */
ElevationImage.prototype.elevationAtLocation = function (latitude, longitude) {
    var maxLat = this.sector.maxLatitude,
        minLon = this.sector.minLongitude,
        deltaLat = this.sector.deltaLatitude(),
        deltaLon = this.sector.deltaLongitude(),
        x = (this.imageWidth - 1) * (longitude - minLon) / deltaLon,
        y = (this.imageHeight - 1) * (maxLat - latitude) / deltaLat,
        x0 = Math.floor(WWMath.clamp(x, 0, this.imageWidth - 1)),
        x1 = Math.floor(WWMath.clamp(x0 + 1, 0, this.imageWidth - 1)),
        y0 = Math.floor(WWMath.clamp(y, 0, this.imageHeight - 1)),
        y1 = Math.floor(WWMath.clamp(y0 + 1, 0, this.imageHeight - 1)),
        pixels = this.imageData,
        x0y0 = pixels[x0 + y0 * this.imageWidth],
        x1y0 = pixels[x1 + y0 * this.imageWidth],
        x0y1 = pixels[x0 + y1 * this.imageWidth],
        x1y1 = pixels[x1 + y1 * this.imageWidth],
        xf = x - x0,
        yf = y - y0;

    if (ElevationImage.isNoData(x0y0, x1y0, x0y1, x1y1)) {
        return NaN;
    }

    return (1 - xf) * (1 - yf) * x0y0 +
        xf * (1 - yf) * x1y0 +
        (1 - xf) * yf * x0y1 +
        xf * yf * x1y1;
};

/**
 * Returns elevations for a specified sector.
 * @param {Sector} sector The sector for which to return the elevations.
 * @param {Number} numLat The number of sample points in the longitudinal direction.
 * @param {Number} numLon The number of sample points in the latitudinal direction.
 * @param {Number[]} result An array in which to return the computed elevations.
 * @throws {ArgumentError} If either the specified sector or result argument is null or undefined, or if the
 * specified number of sample points in either direction is less than 1.
 */
ElevationImage.prototype.elevationsForGrid = function (sector, numLat, numLon, result) {
    if (!sector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationImage", "elevationsForGrid", "missingSector"));
    }

    if (numLat < 1 || numLon < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationImage", "elevationsForGrid",
                "The specified number of sample points is less than 1."));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationImage", "elevationsForGrid", "missingResult"));
    }

    var minLatSelf = this.sector.minLatitude,
        maxLatSelf = this.sector.maxLatitude,
        minLonSelf = this.sector.minLongitude,
        maxLonSelf = this.sector.maxLongitude,
        deltaLatSelf = maxLatSelf - minLatSelf,
        deltaLonSelf = maxLonSelf - minLonSelf,
        minLat = sector.minLatitude,
        maxLat = sector.maxLatitude,
        minLon = sector.minLongitude,
        maxLon = sector.maxLongitude,
        deltaLat = (maxLat - minLat) / (numLat > 1 ? numLat - 1 : 1),
        deltaLon = (maxLon - minLon) / (numLon > 1 ? numLon - 1 : 1),
        lat, lon,
        i, j, index = 0,
        pixels = this.imageData;

    for (j = 0, lat = minLat; j < numLat; j += 1, lat += deltaLat) {
        if (j === numLat - 1) {
            lat = maxLat; // explicitly set the last lat to the max latitude to ensure alignment
        }

        if (lat >= minLatSelf && lat <= maxLatSelf) {
            // Image y-coordinate of the specified location, given an image origin in the top-left corner.
            var y = (this.imageHeight - 1) * (maxLatSelf - lat) / deltaLatSelf,
                y0 = Math.floor(WWMath.clamp(y, 0, this.imageHeight - 1)),
                y1 = Math.floor(WWMath.clamp(y0 + 1, 0, this.imageHeight - 1)),
                yf = y - y0;

            for (i = 0, lon = minLon; i < numLon; i += 1, lon += deltaLon) {
                if (i === numLon - 1) {
                    lon = maxLon; // explicitly set the last lon to the max longitude to ensure alignment
                }

                if (lon >= minLonSelf && lon <= maxLonSelf && isNaN(result[index])) {
                    // Image x-coordinate of the specified location, given an image origin in the top-left corner.
                    var x = (this.imageWidth - 1) * (lon - minLonSelf) / deltaLonSelf,
                        x0 = Math.floor(WWMath.clamp(x, 0, this.imageWidth - 1)),
                        x1 = Math.floor(WWMath.clamp(x0 + 1, 0, this.imageWidth - 1)),
                        xf = x - x0;

                    var x0y0 = pixels[x0 + y0 * this.imageWidth],
                        x1y0 = pixels[x1 + y0 * this.imageWidth],
                        x0y1 = pixels[x0 + y1 * this.imageWidth],
                        x1y1 = pixels[x1 + y1 * this.imageWidth];

                    if (ElevationImage.isNoData(x0y0, x1y0, x0y1, x1y1)) {
                        result[index] = NaN;
                    }
                    else {
                        result[index] = (1 - xf) * (1 - yf) * x0y0 +
                            xf * (1 - yf) * x1y0 +
                            (1 - xf) * yf * x0y1 +
                            xf * yf * x1y1;
                    }
                }

                index++;
            }
        } else {
            index += numLon; // skip this row
        }
    }
};

/**
 * Returns the minimum and maximum elevations within a specified sector.
 * @param {Sector} sector The sector of interest. If null or undefined, the minimum and maximum elevations
 * for the sector associated with this tile are returned.
 * @returns {Number[]} An array containing the minimum and maximum elevations within the specified sector,
 * or null if the specified sector does not include this elevation image's coverage sector or the image is filled with
 * NO_DATA values.
 */
ElevationImage.prototype.minAndMaxElevationsForSector = function (sector) {
    if (!this.hasData) {
        return null;
    }

    var result = [];
    if (!sector) { // the sector is this sector
        result[0] = this.minElevation;
        result[1] = this.maxElevation;
    } else if (sector.contains(this.sector)) { // The specified sector completely contains this image; return the image min and max.
        if (result[0] > this.minElevation) {
            result[0] = this.minElevation;
        }

        if (result[1] < this.maxElevation) {
            result[1] = this.maxElevation;
        }
    } else { // The specified sector intersects a portion of this image; compute the min and max from intersecting pixels.
        var maxLatSelf = this.sector.maxLatitude,
            minLonSelf = this.sector.minLongitude,
            deltaLatSelf = this.sector.deltaLatitude(),
            deltaLonSelf = this.sector.deltaLongitude(),
            minLatOther = sector.minLatitude,
            maxLatOther = sector.maxLatitude,
            minLonOther = sector.minLongitude,
            maxLonOther = sector.maxLongitude;

        // Image coordinates of the specified sector, given an image origin in the top-left corner. We take the floor and
        // ceiling of the min and max coordinates, respectively, in order to capture all pixels that would contribute to
        // elevations computed for the specified sector in a call to elevationsForSector.
        var minY = Math.floor((this.imageHeight - 1) * (maxLatSelf - maxLatOther) / deltaLatSelf),
            maxY = Math.ceil((this.imageHeight - 1) * (maxLatSelf - minLatOther) / deltaLatSelf),
            minX = Math.floor((this.imageWidth - 1) * (minLonOther - minLonSelf) / deltaLonSelf),
            maxX = Math.ceil((this.imageWidth - 1) * (maxLonOther - minLonSelf) / deltaLonSelf);

        minY = WWMath.clamp(minY, 0, this.imageHeight - 1);
        maxY = WWMath.clamp(maxY, 0, this.imageHeight - 1);
        minX = WWMath.clamp(minX, 0, this.imageWidth - 1);
        maxX = WWMath.clamp(maxX, 0, this.imageWidth - 1);

        var pixels = this.imageData,
            min = Number.MAX_VALUE,
            max = -min;

        for (var y = minY; y <= maxY; y++) {
            for (var x = minX; x <= maxX; x++) {
                var p = pixels[Math.floor(x + y * this.imageWidth)];
                if (min > p) {
                    min = p;
                }

                if (max < p) {
                    max = p;
                }
            }
        }

        if (result[0] > min) {
            result[0] = min;
        }

        if (result[1] < max) {
            result[1] = max;
        }
    }

    return result;
};

/**
 * Determines the minimum and maximum elevations within this elevation image and stores those values within
 * this object. See [minAndMaxElevationsForSector]{@link ElevationImage#minAndMaxElevationsForSector}
 */
ElevationImage.prototype.findMinAndMaxElevation = function () {
    this.hasData = false;
    this.hasMissingData = false;

    if (this.imageData && this.imageData.length > 0) {
        this.minElevation = Number.MAX_VALUE;
        this.maxElevation = -Number.MAX_VALUE;

        var pixels = this.imageData,
            pixelCount = this.imageWidth * this.imageHeight;

        for (var i = 0; i < pixelCount; i++) {
            var p = pixels[i];
            if (p !== ElevationImage.NO_DATA) {
                this.hasData = true;
                if (this.minElevation > p) {
                    this.minElevation = p;
                }

                if (this.maxElevation < p) {
                    this.maxElevation = p;
                }
            } else {
                this.hasMissingData = true;
            }
        }
    }

    if (!this.hasData) {
        this.minElevation = 0;
        this.maxElevation = 0;
    }
};

export default ElevationImage;
