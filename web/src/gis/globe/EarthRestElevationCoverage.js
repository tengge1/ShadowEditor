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
 * @exports EarthRestElevationCoverage
 */
import LevelSet from '../util/LevelSet';
import Location from '../geom/Location';
import Sector from '../geom/Sector';
import LevelRowColumnUrlBuilder from '../util/LevelRowColumnUrlBuilder';
import TiledElevationCoverage from '../globe/TiledElevationCoverage';


/**
 * Constructs an elevation coverage for Earth using a REST interface to retrieve the elevations from the server.
 * @alias EarthRestElevationCoverage
 * @constructor
 * @classdesc Represents an Earth elevation coverage spanning the globe and using a REST interface to retrieve
 * the elevations from the server.
 * See [LevelRowColumnUrlBuilder]{@link LevelRowColumnUrlBuilder} for a description of the REST interface.
 * @param {String} serverAddress The server address of the tile service. May be null, in which case the
 * current origin is used (see <code>window.location</code>.
 * @param {String} pathToData The path to the data directory relative to the specified server address.
 * May be null, in which case the server address is assumed to be the full path to the data directory.
 * @param {String} displayName The display name to associate with this elevation coverage.
 */
function EarthRestElevationCoverage(serverAddress, pathToData, displayName) {
    TiledElevationCoverage.call(this, {
        coverageSector: Sector.FULL_SPHERE,
        resolution: 0.00732421875,
        retrievalImageFormat: "application/bil16",
        minElevation: -11000,
        maxElevation: 8850,
        urlBuilder: new LevelRowColumnUrlBuilder(serverAddress, pathToData)
    });

    this.displayName = displayName || "Earth Elevations";

    // Override the default computed LevelSet. EarthRestElevationCoverage accesses a fixed set of tiles with
    // a 60x60 top level tile delta, 5 levels, and tile dimensions of 512x512 pixels.
    this.levels = new LevelSet(Sector.FULL_SPHERE, new Location(60, 60), 5, 512, 512);
}

EarthRestElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

export default EarthRestElevationCoverage;
