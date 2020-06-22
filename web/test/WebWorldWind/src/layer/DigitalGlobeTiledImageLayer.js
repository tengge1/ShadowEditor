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
 * @exports DigitalGlobeTiledImageLayer
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import Color from '../util/Color';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import Sector from '../geom/Sector';
import MercatorTiledImageLayer from '../layer/MercatorTiledImageLayer';
        

        /**
         * Constructs Digital Globe tiled image layer for a specified dataset distributed by Digital Globe.
         * @alias DigitalGlobeTiledImageLayer
         * @constructor
         * @augments MercatorTiledImageLayer
         * @classdesc Provides a layer that shows Digital Globe imagery.
         *
         * @param {String} displayName This layer's display name. "Digital Globe" if this parameter is
         * null or undefined.
         * @param {String} mapId The map ID for the dataset to display.
         * @param {String} accessToken The access token to use when retrieving metadata and imagery. This code is
         * issued by Digital Globe.
         * @throws {ArgumentError} If the specified map ID or access token is null or undefined.
         */
        var DigitalGlobeTiledImageLayer = function (displayName, mapId, accessToken) {
            if (!mapId) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "DigitalGlobeTiledImageLayer", "constructor",
                        "The map ID is null or undefined."));
            }

            if (!accessToken) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "DigitalGlobeTiledImageLayer", "constructor",
                        "The access token is null or undefined."));
            }

            this.imageSize = 256;
            displayName = displayName || "Digital Globe";

            MercatorTiledImageLayer.call(this,
                new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), 19, "image/jpeg", displayName,
                this.imageSize, this.imageSize);

            /**
             * The map ID identifying the dataset displayed by this layer.
             * @type {String}
             * @readonly
             */
            this.mapId = mapId;

            /**
             * The access token used when requesting imagery from Digital Globe.
             * @type {String}
             */
            this.accessToken = accessToken;
            //"pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6IjljZjQwNmEyMTNhOWUyMWM5NWUzYWIwOGNhYTY2ZDViIn0.Ju3tOUUUc0C_gcCSAVpFIA";

            this.displayName = displayName;
            // TODO: Picking is enabled as a temporary measure for screen credit hyperlinks to work (see Layer.render)
            this.pickEnabled = true;

            // Create a canvas we can use when unprojecting retrieved images.
            this.destCanvas = document.createElement("canvas");
            this.destContext = this.destCanvas.getContext("2d");

            this.requestMetadata();

            var self = this;
            this.urlBuilder = {
                urlForTile: function (tile, imageFormat) {
                    if (!self.metadataRetrievalInProcess) {
                        return self.urlTemplate.replace(
                            "{z}",
                            (tile.level.levelNumber + 1)).replace("{x}",
                            tile.column).replace("{y}",
                            tile.row
                        );
                    } else {
                        return null;
                    }
                }
            };
        };

        DigitalGlobeTiledImageLayer.prototype = Object.create(MercatorTiledImageLayer.prototype);

        DigitalGlobeTiledImageLayer.prototype.requestMetadata = function () {
            if (!this.metadataRetrievalInProcess) {
                this.metadataRetrievalInProcess = true;

                var url = "https://api.mapbox.com/v4/" + this.mapId + ".json?secure&access_token=" + this.accessToken;

                var xhr = new XMLHttpRequest();
                var self = this;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var json = JSON.parse(xhr.responseText);
                        self.urlTemplate = json.tiles[0];

                        // Send an event to request a redraw.
                        var e = document.createEvent('Event');
                        e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                        window.dispatchEvent(e);

                        self.metadataRetrievalInProcess = false;
                    }
                };
                xhr.open("GET", url, true);
                xhr.send();
            }
        };

        DigitalGlobeTiledImageLayer.prototype.doRender = function (dc) {
            MercatorTiledImageLayer.prototype.doRender.call(this, dc);
            if (this.inCurrentFrame) {
                dc.screenCreditController.addCredit("\u00A9 Digital Globe", Color.DARK_GRAY);
            }
        };

        // Overridden from TiledImageLayer.
        DigitalGlobeTiledImageLayer.prototype.createTopLevelTiles = function (dc) {
            this.topLevelTiles = [];

            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 1));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 1));
        };

        // Determines the Bing map size for a specified level number.
        DigitalGlobeTiledImageLayer.prototype.mapSizeForLevel = function (levelNumber) {
            return 256 << (levelNumber + 1);
        };

        export default DigitalGlobeTiledImageLayer;
    