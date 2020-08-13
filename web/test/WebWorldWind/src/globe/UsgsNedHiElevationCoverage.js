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
 * @exports UsgsNedHiElevationCoverage
 */
import Sector from '../geom/Sector';
import TiledElevationCoverage from '../globe/TiledElevationCoverage';
import WmsUrlBuilder from '../util/WmsUrlBuilder';


/**
 * Constructs an Earth elevation coverage using USGS NED data.
 * @alias UsgsNedHiElevationCoverage
 * @constructor
 * @augments TiledElevationCoverage
 * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
 */
function UsgsNedHiElevationCoverage() {
    // Hawaii Extent: (-178.443593, 18.865460) - (-154.755792, 28.517269)
    // TODO: Remove this class when the server NO_DATA value issue is resolved.
    TiledElevationCoverage.call(this, {
        coverageSector: new Sector(18.865460, 28.517269, -178.443593, -154.755792),
        resolution: 0.000092592592593,
        retrievalImageFormat: "application/bil16",
        minElevation: -11000,
        maxElevation: 8850,
        urlBuilder: new WmsUrlBuilder("https://worldwind26.arc.nasa.gov/elev", "USGS-NED", "", "1.3.0")
    });

    this.displayName = "USGS NED Hawaii Elevation Coverage";
}

UsgsNedHiElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

export default UsgsNedHiElevationCoverage;
