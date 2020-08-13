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
 * @exports UsgsNedElevationCoverage
 */
import Sector from '../geom/Sector';
import TiledElevationCoverage from '../globe/TiledElevationCoverage';
import WmsUrlBuilder from '../util/WmsUrlBuilder';


/**
 * Constructs an Earth elevation coverage using USGS NED data.
 * @alias UsgsNedElevationCoverage
 * @constructor
 * @augments TiledElevationCoverage
 * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
 */
function UsgsNedElevationCoverage() {
    // CONUS Extent: (-124.848974, 24.396308) - (-66.885444, 49.384358)
    // TODO: Expand this extent to cover HI when the server NO_DATA value issue is resolved.
    TiledElevationCoverage.call(this, {
        coverageSector: new Sector(24.396308, 49.384358, -124.848974, -66.885444),
        resolution: 0.000092592592593,
        retrievalImageFormat: "application/bil16",
        minElevation: -11000,
        maxElevation: 8850,
        urlBuilder: new WmsUrlBuilder("https://worldwind26.arc.nasa.gov/elev", "USGS-NED", "", "1.3.0")
    });

    this.displayName = "USGS NED Earth Elevation Coverage";
}

UsgsNedElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

export default UsgsNedElevationCoverage;
