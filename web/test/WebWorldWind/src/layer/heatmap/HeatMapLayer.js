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
import ArgumentError from '../../error/ArgumentError';
import HeatMapColoredTile from './HeatMapColoredTile';
import HeatMapIntervalType from './HeatMapIntervalType';
import HeatMapTile from './HeatMapTile';
import ImageSource from '../../util/ImageSource';
import Location from '../../geom/Location';
import Logger from '../../util/Logger';
import MeasuredLocation from '../../geom/MeasuredLocation';
import TiledImageLayer from '../TiledImageLayer';
import Sector from '../../geom/Sector';
import WWUtil from '../../util/WWUtil';
    

    /**
     * Constructs a HeatMap Layer.
     *
     * The default implementation uses gradient circles to display measured locations. The measure of the locations
     * define the colors of the gradient.
     *
     * @alias HeatMapLayer
     * @constructor
     * @augments TiledImageLayer
     * @classdesc A HeatMap layer for visualising an array of measured locations.
     * @param {String} displayName This layer's display name.
     * @param {MeasuredLocation[]} measuredLocations An array of locations with measures to visualise.
     * @param {Number} numLevels Optional. If provided it specifies the amount of levels that will be generated for
     *  this layer.
     */
    var HeatMapLayer = function (displayName, measuredLocations, numLevels) {
        this.tileWidth = 256;
        this.tileHeight = 256;

        TiledImageLayer.call(this, new Sector(-90, 90, -180, 180), new Location(45, 45), numLevels || 18, 'image/png', 'HeatMap' + WWUtil.guid(), this.tileWidth, this.tileHeight);

        this.displayName = displayName;

        var data = {};
        for (var lat = -90; lat <= 90; lat++) {
            data[lat] = {};
            for (var lon = -180; lon <= 180; lon++) {
                data[lat][lon] = [];
            }
        }

        var latitude, longitude;
        var max = Number.MIN_VALUE;
        measuredLocations.forEach(function (measured) {
            latitude = Math.floor(measured.latitude);
            longitude = Math.floor(measured.longitude);
            data[latitude][longitude].push(measured);
            if(measured.measure > max) {
                max = measured.measure;
            }
        });

        this._data = data;
        this._measuredLocations = measuredLocations;

        this._intervalType = HeatMapIntervalType.CONTINUOUS;
        this._scale = ['blue', 'cyan', 'lime', 'yellow', 'red'];
        this._radius = 12.5;
        this._incrementPerIntensity = 1 / max;

        this.setGradient(measuredLocations);
    };

    HeatMapLayer.prototype = Object.create(TiledImageLayer.prototype);

    Object.defineProperties(HeatMapLayer.prototype, {
        /**
         * Type of interval to apply between the minimum and maximum values in the data. Default value is CONTINUOUS.
         * The supported values are CONTINUOUS and QUANTILES
         * @memberof HeatMapLayer.prototype
         * @type {HeatMapIntervalType}
         */
        intervalType: {
            get: function () {
                return this._intervalType;
            },
            set: function (intervalType) {
                this._intervalType = intervalType;
                this.setGradient();
            }
        },

        /**
         * Array of colors representing the scale used when generating the gradients.
         * The default value is ['blue', 'cyan', 'lime', 'yellow', 'red'].
         * @memberof HeatMapLayer.prototype
         * @type {String[]}
         */
        scale: {
            get: function () {
                return this._scale;
            },
            set: function (scale) {
                this._scale = scale;
                this.setGradient();
            }
        },

        /**
         * Gradient of colours used to draw the points and derived from the scale, intervalType and the data. The colors
         * are stored in an object, which has as keys the percentage from which the given color should be applied.
         * The default object based on the default scale and intervalType (in case of CONTINUOUS the data are irrelevant):
         * {
         *     "0": "blue",
         *     "0.2": "cyan",
         *     "0.4": "lime",
         *     "o.6": "yellow",
         *     "0.8": "red"
         * }
         * @memberOf HeatMapLayer.prototype
         * @type {Object}
         */
        gradient: {
            get: function () {
                return this._gradient;
            }
        },

        /**
         * Radius of a point in pixels. The default value is 12.5.
         * @memberof HeatMapLayer.prototype
         * @type {Number}
         */
        radius: {
            get: function () {
                return this._radius;
            },
            set: function (radius) {
                this._radius = radius;
            }
        }
    });

    /**
     * Returns the relevant points for the visualisation for current sector. To retrieve the relevant points, the data
     * are stored in the two dimensional array representation of the geographic locations. The first index represents
     * latitude from -90 to 90. The second index represents longitude from -180 to 180.
     * For the sector pieces outside of the bounds of valid latitude and longitude, the array behaves as if it was
     * continuous in the longitudinal space of <-180,180> and clamped to the min, max value in case of latitudinal space.
     * @private
     * @param data {MeasuredLocation[][]} Two dimensional array covering the whole globe in WGS84 coordinates.
     * @param sector {Sector} Visible sector limiting the data to retrieve.
     * @returns {MeasuredLocation[]} Array of the Measured Locations relevant for given sector.
     */
    HeatMapLayer.prototype.filterGeographically = function (data, sector) {
        var minLatitude = Math.floor(sector.minLatitude);
        var maxLatitude = Math.floor(sector.maxLatitude);
        var minLongitude = Math.floor(sector.minLongitude);
        var maxLongitude = Math.floor(sector.maxLongitude);

        var extraLongitudeBefore = 0, extraLongitudeAfter = 0;

        // Clamp the latitude to <-90,90>
        if (minLatitude <= -90) {
            minLatitude = -90;
        }
        if (maxLatitude >= 90) {
            maxLatitude = 90;
        }

        // Handle continuousness of the longitudinal space.
        if (minLongitude <= -180) {
            extraLongitudeBefore = Math.abs(minLongitude - (-180));
            minLongitude = -180;
        }
        if (maxLongitude >= 180) {
            extraLongitudeAfter = Math.abs(maxLongitude - 180);
            maxLongitude = 180;
        }

        var result = [];
        this.gatherGeographical(data, result, sector, minLatitude, maxLatitude, minLongitude, maxLongitude);

        if (extraLongitudeBefore !== 0) {
            var beforeSector = new Sector(minLatitude, maxLatitude, 180 - extraLongitudeBefore, 180);
            this.gatherGeographical(data, result, beforeSector, minLatitude, maxLatitude, 180 - extraLongitudeBefore, 180, -360);
        }

        if (extraLongitudeAfter !== 0) {
            var afterSector = new Sector(minLatitude, maxLatitude, -180, -180 + extraLongitudeAfter);
            this.gatherGeographical(data, result, afterSector, minLatitude, maxLatitude, -180, -180 + extraLongitudeAfter, 360);
        }

        return result;
    };

    /**
     * Internal method to gather the geographical data for given sector and bounding box. The data are in the two dimensional
     * array structure. Therefore the method goes through the slice of the array limited by the bounding box. The
     * elements in given 1 * 1 degree space are then filtered based on their exact location and the exact limitation of
     * the sector.
     * @private
     * @param data {MeasuredLocation[][]} Two dimensional array covering the whole globe in WGS84 coordinates. The globe
     *  is split into the grid of 1 * 1 degrees.
     * @param result {MeasuredLocation[]} Array of the Locations that are valid within given area.
     * @param sector {Sector} The sector representing the detailed area relevant for given
     * @param minLatitude {Number} The integer bound of the sector relevant for the filtering.
     * @param maxLatitude {Number} The integer bound of the sector relevant for the filtering.
     * @param minLongitude {Number} The integer bound of the sector relevant for the filtering.
     * @param maxLongitude {Number} The integer bound of the sector relevant for the filtering.
     * @param adaptLongitude {Number} Optional. If this is supplied, then the result contains new measured locations
     *  with the longitude adapted by adding this number.
     */
    HeatMapLayer.prototype.gatherGeographical = function (data, result, sector, minLatitude, maxLatitude, minLongitude,
                                                          maxLongitude, adaptLongitude) {
        var lat, lon;
        for (lat = minLatitude; lat <= maxLatitude; lat++) {
            for (lon = minLongitude; lon <= maxLongitude; lon++) {
                data[lat][lon].forEach(function (element) {
                    if (sector.containsLocation(element.latitude, element.longitude)) {
                        if(!adaptLongitude) {
                            result.push(element);
                        } else {
                            result.push(new MeasuredLocation(element.latitude, adaptLongitude + element.longitude, element.measure));
                        }
                    }
                });
            }
        }
    };

    /**
     * Sets gradient based on the Scale and IntervalType. It supports CONTINUOUS and QUANTILES types of the interval.
     * The CONTINUOUS simply distribute the colors equally among the percentage.
     * The QUNATILES distribution takes into account the underlying data. The data are sorted based on the measures.
     * The amount of colors in the scale decides how many of the intervals will be in the resulting gradient. The value
     * used as the key for the resulting gradient is taken from element on the position represented by the percentage
     * counted via following formula:
     *  gradientIndex = (data[Math.floor((1 / scale.length) * data.length)].measure) / max;
     * @private
     */
    HeatMapLayer.prototype.setGradient = function () {
        var intervalType = this.intervalType;
        var scale = this.scale;

        var gradient = {};
        if (intervalType === HeatMapIntervalType.CONTINUOUS) {
            scale.forEach(function (color, index) {
                gradient[index / scale.length] = color;
            });
        } else if (intervalType === HeatMapIntervalType.QUANTILES) {
            var data = this._measuredLocations;
            // Equal amount of pieces in each group.
            data.sort(function (item1, item2) {
                if (item1.measure < item2.measure) {
                    return -1;
                } else if (item1.measure > item2.measure) {
                    return 1;
                } else {
                    return 0;
                }
            });
            var max = data[data.length - 1].measure;
            if (data.length >= scale.length) {
                scale.forEach(function (color, index) {
                    if(index === 0) {
                        gradient[0] = color;
                    } else {
                        gradient[
                            data[Math.floor(index / scale.length * data.length)].measure / max
                            ] = color;
                    }
                });
            } else {
                scale.forEach(function (color, index) {
                    gradient[index / scale.length] = color;
                });
            }
        }
        this._gradient = gradient;
    };

    /**
     * The Image for given Tile is generated and drawn on internal Canvas.
     * @inheritDoc
     */
    HeatMapLayer.prototype.retrieveTileImage = function (dc, tile, suppressRedraw) {
        if (this.currentRetrievals.indexOf(tile.imagePath) < 0) {
            if (this.absentResourceList.isResourceAbsent(tile.imagePath)) {
                return;
            }

            var imagePath = tile.imagePath,
                cache = dc.gpuResourceCache,
                layer = this,
                radius = this.radius;

            var extended = this.calculateExtendedSector(tile.sector, 2 * (radius / this.tileWidth), 2 * (radius / this.tileHeight));
            var extendedWidth = Math.ceil(extended.extensionFactorWidth * this.tileWidth);
            var extendedHeight = Math.ceil(extended.extensionFactorHeight * this.tileHeight);

            var data = this.filterGeographically(this._data, extended.sector);

            var canvas = this.createHeatMapTile(data, {
                sector: extended.sector,

                width: this.tileWidth + 2 * extendedWidth,
                height: this.tileHeight + 2 * extendedHeight,
                radius: radius,

                intensityGradient: this.gradient,
                incrementPerIntensity: this._incrementPerIntensity,

                extendedWidth: extendedWidth,
                extendedHeight: extendedHeight
            }).canvas();

            var result = document.createElement('canvas');
            result.height = this.tileHeight;
            result.width = this.tileWidth;
            result.getContext('2d').putImageData(
                canvas.getContext('2d').getImageData(extendedWidth, extendedHeight, this.tileWidth, this.tileHeight),
                0, 0
            );

            var texture = layer.createTexture(dc, tile, result);
            layer.removeFromCurrentRetrievals(imagePath);

            if (texture) {
                cache.putResource(imagePath, texture, texture.size);

                layer.currentTilesInvalid = true;
                layer.absentResourceList.unmarkResourceAbsent(imagePath);

                if (!suppressRedraw) {
                    // Send an event to request a redraw.
                    var e = document.createEvent('Event');
                    e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                    window.dispatchEvent(e);
                }
            }
        }
    };


    /**
     * Calculates the new sector for which the data will be filtered and which will be drawn on the tile.
     * The standard version just applies extension factor to the difference between minimum and maximum. The extension
     * factor may differ between latitude and longitude.
     * @protected
     * @param sector {Sector} Sector to use as basis for the extension.
     * @param extensionFactorWidth {Number} The factor to be applied on the width to get sector representing the right geographical area.
     * @param extensionFactorHeight {Number} The factor to be applied on the height to get sector representing the right geographical area.
     * @return {Object} .sector New extended sector.
     *                  .extensionFactorHeight The factor by which the area is changed on the latitude.
     *                  .extensionFactorWidth The factor by which the area is changed on the longitude.
     */
    HeatMapLayer.prototype.calculateExtendedSector = function (sector, extensionFactorWidth, extensionFactorHeight) {
        var latitudeChange = (sector.maxLatitude - sector.minLatitude) * extensionFactorHeight;
        var longitudeChange = (sector.maxLongitude - sector.minLongitude) * extensionFactorWidth;
        return {
            sector: new Sector(
                sector.minLatitude - latitudeChange,
                sector.maxLatitude + latitudeChange,
                sector.minLongitude - longitudeChange,
                sector.maxLongitude + longitudeChange
            ),
            extensionFactorHeight: extensionFactorHeight,
            extensionFactorWidth: extensionFactorWidth
        };
    };

    /**
     * Overwrite this method if you want to use a custom implementation of tile used for displaying the data. In the
     * default version the tile draws points as blurring circles coloured based on the gradient.
     * @protected
     * @param data {Object[]} Array of information constituting points in the map.
     * @param options {Object}
     * @param options.sector {Sector} Sector with the geographical information for tile representation.
     * @param options.width {Number} Width of the Canvas to be created in pixels.
     * @param options.height {Number} Height of the Canvas to be created in pixels.
     * @param options.radius {Number} Radius of the data point in pixels.
     * @param options.incrementPerIntensity {Number} The ratio representing the 1 / measure for the maximum measure.
     * @param options.intensityGradient {Object} Gradient of colours used to draw the points and derived from the scale,
     *  intervalType and the data.
     * @param options.extendedWidth {Number} Minimal width that needs to be valid in the resulting object.
     * @param options.extendedHeight {Number} Minimal height that needs to be valid in the resulting object.
     *
     * @return {HeatMapTile} Instance of the implementation of the HeatMapTile used for this instance of the layer.
     */
    HeatMapLayer.prototype.createHeatMapTile = function (data, options) {
        return new HeatMapColoredTile(data, options);
    };

    export default HeatMapLayer;
