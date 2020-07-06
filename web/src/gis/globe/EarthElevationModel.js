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
 * @exports EarthElevationModel
 */
import AsterV2ElevationCoverage from '../globe/AsterV2ElevationCoverage';
import ElevationModel from '../globe/ElevationModel';
import GebcoElevationCoverage from '../globe/GebcoElevationCoverage';
import UsgsNedElevationCoverage from '../globe/UsgsNedElevationCoverage';
import UsgsNedHiElevationCoverage from '../globe/UsgsNedHiElevationCoverage';


/**
 * Constructs an EarthElevationModel consisting of three elevation coverages GEBCO, Aster V2, and USGS NED.
 * @alias EarthElevationModel
 * @constructor
 */
function EarthElevationModel() {
    ElevationModel.call(this);

    this.addCoverage(new GebcoElevationCoverage());
    this.addCoverage(new AsterV2ElevationCoverage());
    this.addCoverage(new UsgsNedElevationCoverage());
    this.addCoverage(new UsgsNedHiElevationCoverage());
}

EarthElevationModel.prototype = Object.create(ElevationModel.prototype);

export default EarthElevationModel;
