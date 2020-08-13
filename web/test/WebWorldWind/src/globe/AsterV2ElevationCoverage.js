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
 * @exports AsterV2ElevationCoverage
 */
import Sector from '../geom/Sector';
import TiledElevationCoverage from '../globe/TiledElevationCoverage';
import WmsUrlBuilder from '../util/WmsUrlBuilder';


/**
 * Constructs an Earth elevation coverage using ASTER V2 data.
 * @alias AsterV2ElevationCoverage
 * @constructor
 * @augments TiledElevationCoverage
 * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
 */
function AsterV2ElevationCoverage() {
    TiledElevationCoverage.call(this, {
        coverageSector: new Sector(-83.0001, 83.0001, -180, 180),
        resolution: 0.000277777777778,
        retrievalImageFormat: "application/bil16",
        minElevation: -11000,
        maxElevation: 8850,
        urlBuilder: new WmsUrlBuilder("https://worldwind26.arc.nasa.gov/elev", "aster_v2", "", "1.3.0")
    });

    this.displayName = "ASTER V2 Earth Elevation Coverage";
}

AsterV2ElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

export default AsterV2ElevationCoverage;
