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
 * @exports LandsatRestLayer
 */
import ArgumentError from '../error/ArgumentError';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import Sector from '../geom/Sector';
import TiledImageLayer from '../layer/TiledImageLayer';
import LevelRowColumnUrlBuilder from '../util/LevelRowColumnUrlBuilder';
import WWUtil from '../util/WWUtil';
        

        /**
         * Constructs a LandSat image layer that uses a REST interface to retrieve its imagery.
         * @alias LandsatRestLayer
         * @constructor
         * @augments TiledImageLayer
         * @classdesc Displays a LandSat image layer that spans the entire globe. The imagery is obtained from a
         * specified REST tile service.
         * See [LevelRowColumnUrlBuilder]{@link LevelRowColumnUrlBuilder} for a description of the REST interface.
         * @param {String} serverAddress The server address of the tile service. May be null, in which case the
         * current origin is used (see window.location).
         * @param {String} pathToData The path to the data directory relative to the specified server address.
         * May be null, in which case the server address is assumed to be the full path to the data directory.
         * @param {String} displayName The display name to associate with this layer.
         */
        var LandsatRestLayer = function (serverAddress, pathToData, displayName) {
            var cachePath = WWUtil.urlPath(serverAddress + "/" + pathToData);

            TiledImageLayer.call(this, Sector.FULL_SPHERE, new Location(36, 36), 10, "image/png", cachePath, 512, 512);

            this.displayName = displayName;
            this.pickEnabled = false;
            this.urlBuilder = new LevelRowColumnUrlBuilder(serverAddress, pathToData);
        };

        LandsatRestLayer.prototype = Object.create(TiledImageLayer.prototype);

        export default LandsatRestLayer;
    