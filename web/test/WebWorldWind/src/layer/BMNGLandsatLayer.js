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
 * @exports BMNGLandsatLayer
 */
import Location from '../geom/Location';
import Sector from '../geom/Sector';
import TiledImageLayer from '../layer/TiledImageLayer';
import WmsUrlBuilder from '../util/WmsUrlBuilder';
        

        /**
         * Constructs a combined Blue Marble and Landsat image layer.
         * @alias BMNGLandsatLayer
         * @constructor
         * @augments TiledImageLayer
         * @classdesc Displays a combined Blue Marble and Landsat image layer that spans the entire globe.
         */
        var BMNGLandsatLayer = function () {
            // This LevelSet configuration captures the Landsat resolution of 1.38889E-04 degrees/pixel
            TiledImageLayer.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), 12, "image/jpeg", "BMNGLandsat256", 256, 256);

            this.displayName = "Blue Marble & Landsat";
            this.pickEnabled = false;

            this.urlBuilder = new WmsUrlBuilder("https://worldwind25.arc.nasa.gov/wms",
                "BlueMarble-200405,esat", "", "1.3.0");
        };

        BMNGLandsatLayer.prototype = Object.create(TiledImageLayer.prototype);

        export default BMNGLandsatLayer;
    