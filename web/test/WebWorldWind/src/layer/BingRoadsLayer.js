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
 * @exports BingRoadsLayer
 */
import Location from '../geom/Location';
import Sector from '../geom/Sector';
import BingTiledImageLayer from '../layer/BingTiledImageLayer';
import BingImageryUrlBuilder from '../util/BingImageryUrlBuilder';
        

        /**
         * Constructs a Bing Roads layer.
         * @alias BingRoadsLayer
         * @constructor
         * @augments BingTiledImageLayer
         * @classdesc Displays a Bing Roads layer.
         * See also {@link BingAerialLayer} and {@link BingAerialWithLabelsLayer}.
         *
         * @param {String} bingMapsKey The Bing Maps key to use for the image requests. If null or undefined, the key at
         * WorldWind.BingMapsKey is used. If that is null or undefined, the default WorldWind Bing Maps key is used,
         * but this fallback is provided only for non-production use. If you are using Web WorldWind in an app or a
         * web page, you must obtain your own key from the
         * [Bing Maps Portal]{@link https://www.microsoft.com/maps/choose-your-bing-maps-API.aspx}
         * and either pass it as a parameter to this constructor or specify it as the property WorldWind.BingMapsKey.
         */
        var BingRoadsLayer = function (bingMapsKey) {
            BingTiledImageLayer.call(this, "Bing Roads");

            this.urlBuilder = new BingImageryUrlBuilder("Road", bingMapsKey);

            // Disable blank-image detection.
            this.detectBlankImages = false;
        };

        BingRoadsLayer.prototype = Object.create(BingTiledImageLayer.prototype);

        export default BingRoadsLayer;
    