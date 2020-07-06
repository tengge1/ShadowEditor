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
 * @exports WcsEarthElevationCoverage
 */
import Location from '../geom/Location';
import Sector from '../geom/Sector';
import TiledElevationCoverage from '../globe/TiledElevationCoverage';
import WcsTileUrlBuilder from '../util/WcsTileUrlBuilder';


/**
 * Constructs an Earth elevation model.
 * @alias WcsEarthElevationCoverage
 * @constructor
 * @augments TiledElevationCoverage
 * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
 * @deprecated
 */
function WcsEarthElevationCoverage() {
    TiledElevationCoverage.call(this, {
        coverageSector: Sector.FULL_SPHERE,
        resolution: 0.008333333333333,
        retrievalImageFormat: "image/tiff",
        minElevation: -11000,
        maxElevation: 8850,
        urlBuilder: new WcsTileUrlBuilder("https://worldwind26.arc.nasa.gov/wms2",
            "NASA_SRTM30_900m_Tiled", "1.0.0")
    });

    this.displayName = "WCS Earth Elevation Coverage";
}

WcsEarthElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

export default WcsEarthElevationCoverage;
