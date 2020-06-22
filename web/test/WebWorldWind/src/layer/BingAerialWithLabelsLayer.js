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
 * @exports BingAerialWithLabelsLayer
 */
import Location from '../geom/Location';
import Sector from '../geom/Sector';
import BingTiledImageLayer from '../layer/BingTiledImageLayer';
import BingImageryUrlBuilder from '../util/BingImageryUrlBuilder';
        

        /**
         * Constructs a Bing Aerial with Labels layer.
         * @alias BingAerialWithLabelsLayer
         * @constructor
         * @augments BingTiledImageLayer
         * @classdesc Displays a Bing Aerial layer with roads and labels.
         * See also {@link BingAerialLayer} and {@link BingRoadsLayer}.
         *
         * @param {String} bingMapsKey The Bing Maps key to use for the image requests. If null or undefined, the key at
         * WorldWind.BingMapsKey is used. If that is null or undefined, the default WorldWind Bing Maps key is used,
         * but this fallback is provided only for non-production use. If you are using Web WorldWind in an app or a
         * web page, you must obtain your own key from the
         * [Bing Maps Portal]{@link https://www.microsoft.com/maps/choose-your-bing-maps-API.aspx}
         * and either pass it as a parameter to this constructor or specify it as the property WorldWind.BingMapsKey.
         */
        var BingAerialWithLabelsLayer = function (bingMapsKey) {
            BingTiledImageLayer.call(this, "Bing Aerial with Labels");

            this.urlBuilder = new BingImageryUrlBuilder("AerialWithLabels", bingMapsKey);
        };

        BingAerialWithLabelsLayer.prototype = Object.create(BingTiledImageLayer.prototype);

        export default BingAerialWithLabelsLayer;
    