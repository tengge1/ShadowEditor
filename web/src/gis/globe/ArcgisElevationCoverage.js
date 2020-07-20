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
 * @exports ArcgisElevationCoverage
 */
import Sector from '../geom/Sector';
import TiledElevationCoverage from '../globe/TiledElevationCoverage';
import WmsUrlBuilder from '../util/WmsUrlBuilder';
import ElevationImage from './ElevationImage';
import Logger from '../util/Logger';
import ArcgisElevationWorker from 'worker!./ArcgisElevationWorker.js';

/**
 * Constructs an Earth elevation coverage using Arcgis data.
 * @alias ArcgisElevationCoverage
 * @constructor
 * @augments TiledElevationCoverage
 * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
 */
function ArcgisElevationCoverage() {
    TiledElevationCoverage.call(this, {
        coverageSector: new Sector(-83.0001, 83.0001, -180, 180),
        resolution: 0.000277777777778,
        retrievalImageFormat: "application/bil16",
        minElevation: -11000,
        maxElevation: 8850,
        urlBuilder: new WmsUrlBuilder("https://worldwind26.arc.nasa.gov/elev", "aster_v2", "", "1.3.0")
    });

    this.displayName = "Arcgis Elevation Coverage";

    this.worker = new ArcgisElevationWorker();
    this.worker.onmessage = this.handleMessage.bind(this);
}

ArcgisElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

ArcgisElevationCoverage.prototype.retrieveTileImage = function (tile) {
    if (this.currentRetrievals.indexOf(tile.tileKey) < 0) {
        if (this.currentRetrievals.length > this.retrievalQueueSize) {
            return;
        }

        let z = 360 / (tile.sector.maxLongitude - tile.sector.minLongitude);
        let x = (180 + tile.sector.minLongitude) / 360 * Math.pow(2, z);

        if(Math.abs(tile.sector.minLatitude) > 85.01) {
            return;
        }

        let lat = Math.log(Math.tan((Math.PI / 2.0 + tile.sector.minLatitude * Math.PI / 180) / 2.0)) * 180 / Math.PI;
        let y = Math.floor((180 - lat) / 360 * Math.pow(2, z));

        this.worker.postMessage({
            tileKey: tile.tileKey,
            x,
            y,
            z
        });

        this.currentRetrievals.push(tile.tileKey);
    }
};

ArcgisElevationCoverage.prototype.handleMessage = function (evt) {
    let { result, tileKey, url, data, msg } = evt.data;
    let tile = this.tileCache.entryForKey(tileKey);

    if (result === 'success') {
        Logger.log(Logger.LEVEL_INFO, "Elevations retrieval succeeded: " + url);
        this.loadElevationImage(tile, data);
        this.absentResourceList.unmarkResourceAbsent(tileKey);

        // Send an event to request a redraw.
        var e = document.createEvent('Event');
        e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
        window.dispatchEvent(e);
    } else if (result === 'fail') {
        this.absentResourceList.markResourceAbsent(tileKey);
        Logger.log(Logger.LEVEL_WARNING,
            "Elevations retrieval failed (" + msg + "): " + url);
    } else if (result === 'error') {
        this.removeFromCurrentRetrievals(tileKey);
        this.absentResourceList.markResourceAbsent(tileKey);
        Logger.log(Logger.LEVEL_WARNING, "Elevations retrieval failed: " + url);
    } else if (result === 'timeout') {
        this.removeFromCurrentRetrievals(tileKey);
        this.absentResourceList.markResourceAbsent(tileKey);
        Logger.log(Logger.LEVEL_WARNING, "Elevations retrieval timed out: " + url);
    }
};

// Intentionally not documented.
ArcgisElevationCoverage.prototype.loadElevationImage = function (tile, data) {
    var elevationImage = new ElevationImage(tile.sector, data.width, data.height);

    elevationImage.imageData = data.pixelData;
    elevationImage.size = elevationImage.imageData.length * 4;

    if (elevationImage.imageData) {
        elevationImage.findMinAndMaxElevation();
        this.imageCache.putEntry(tile.tileKey, elevationImage, elevationImage.size);
        this.timestamp = Date.now();
    }
};

export default ArcgisElevationCoverage;
