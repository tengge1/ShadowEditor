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
 * @exports BingTiledImageLayer
 */
import Angle from '../geom/Angle';
import Color from '../util/Color';
import Location from '../geom/Location';
import Offset from '../util/Offset';
import ScreenImage from '../shapes/ScreenImage';
import Sector from '../geom/Sector';
import MercatorTiledImageLayer from '../layer/MercatorTiledImageLayer';
        

        /**
         * Constructs a base Bing layer. This constructor is meant to be called only by subclasses.
         * @alias BingTiledImageLayer
         * @constructor
         * @augments MercatorTiledImageLayer
         * @classdesc Provides an abstract base layer for Bing imagery. This class is not intended to be constructed
         * independently but as a base layer for subclasses.
         * See {@link BingAerialLayer}, {@link BingAerialWithLabelsLayer} and {@link BingRoadsLayer}.
         *
         * @param {String} displayName This layer's display name.
         */
        var BingTiledImageLayer = function (displayName) {
            this.imageSize = 256;

            MercatorTiledImageLayer.call(this,
                new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), 23, "image/jpeg", displayName,
                this.imageSize, this.imageSize);

            this.displayName = displayName;

            // TODO: Picking is enabled as a temporary measure for screen credit hyperlinks to work (see Layer.render)
            this.pickEnabled = true;

            this.detectBlankImages = true;
        };

        // Internal use only. Intentionally not documented.
        BingTiledImageLayer.logoImage = null;

        // Internal use only. Intentionally not documented.
        BingTiledImageLayer.logoLastFrameTime = 0;

        BingTiledImageLayer.prototype = Object.create(MercatorTiledImageLayer.prototype);

        BingTiledImageLayer.prototype.doRender = function (dc) {
            MercatorTiledImageLayer.prototype.doRender.call(this, dc);

            if (this.inCurrentFrame) {
                this.renderLogo(dc);
            }
        };

        // Overridden from TiledImageLayer.
        BingTiledImageLayer.prototype.createTopLevelTiles = function (dc) {
            this.topLevelTiles = [];

            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 1));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 1));
        };

        BingTiledImageLayer.prototype.renderLogo = function (dc) {
            if (!BingTiledImageLayer.logoImage) {
                BingTiledImageLayer.logoImage = new ScreenImage(WorldWind.configuration.bingLogoPlacement,
                    WorldWind.configuration.baseUrl + "images/powered-by-bing.png");
                BingTiledImageLayer.logoImage.imageColor = new Color(1, 1, 1, 0.5); // Make Bing logo semi transparent.
            }

            if (BingTiledImageLayer.logoLastFrameTime !== dc.timestamp) {
                BingTiledImageLayer.logoImage.screenOffset = WorldWind.configuration.bingLogoPlacement;
                BingTiledImageLayer.logoImage.imageOffset = WorldWind.configuration.bingLogoAlignment;
                BingTiledImageLayer.logoImage.render(dc);
                BingTiledImageLayer.logoLastFrameTime = dc.timestamp;
            }
        };

        // Determines the Bing map size for a specified level number.
        BingTiledImageLayer.prototype.mapSizeForLevel = function (levelNumber) {
            return 256 << (levelNumber + 1);
        };

        export default BingTiledImageLayer;
    
