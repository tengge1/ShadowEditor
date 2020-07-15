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

        this.worker.postMessage({
            tileKey: tile.tileKey,
            column: tile.column,
            row: tile.row,
            levelNumber: tile.level.levelNumber
        });

        this.currentRetrievals.push(tile.tileKey);
    }
};

ArcgisElevationCoverage.prototype.handleMessage = function (e) {
    let xhr = new XMLHttpRequest(),
        elevationCoverage = this;

    xhr.open("GET", url + `&x=${x}&y=${y}&z=${z}`, true);
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            elevationCoverage.removeFromCurrentRetrievals(tile.tileKey);

            var contentType = xhr.getResponseHeader("content-type");

            if (xhr.status === 200) {
                if (contentType === elevationCoverage.retrievalImageFormat
                    || contentType === "text/plain"
                    || contentType === "application/octet-stream") {
                    Logger.log(Logger.LEVEL_INFO, "Elevations retrieval succeeded: " + url);
                    elevationCoverage.loadElevationImage(tile, xhr);
                    elevationCoverage.absentResourceList.unmarkResourceAbsent(tile.tileKey);

                    // Send an event to request a redraw.
                    var e = document.createEvent('Event');
                    e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                    window.dispatchEvent(e);
                } else if (contentType === "text/xml") {
                    elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
                    Logger.log(Logger.LEVEL_WARNING,
                        "Elevations retrieval failed (" + xhr.statusText + "): " + url + ".\n "
                        + String.fromCharCode.apply(null, new Uint8Array(xhr.response)));
                } else {
                    elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
                    Logger.log(Logger.LEVEL_WARNING,
                        "Elevations retrieval failed: " + url + ". " + "Unexpected content type "
                        + contentType);
                }
            } else {
                elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
                Logger.log(Logger.LEVEL_WARNING,
                    "Elevations retrieval failed (" + xhr.statusText + "): " + url);
            }
        }
    };

    xhr.onerror = function () {
        elevationCoverage.removeFromCurrentRetrievals(tile.tileKey);
        elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
        Logger.log(Logger.LEVEL_WARNING, "Elevations retrieval failed: " + url);
    };

    xhr.ontimeout = function () {
        elevationCoverage.removeFromCurrentRetrievals(tile.tileKey);
        elevationCoverage.absentResourceList.markResourceAbsent(tile.tileKey);
        Logger.log(Logger.LEVEL_WARNING, "Elevations retrieval timed out: " + url);
    };

    xhr.send(null);
};

// Intentionally not documented.
ArcgisElevationCoverage.prototype.loadElevationImage = function (tile, xhr) {
    var elevationImage = new ElevationImage(tile.sector, tile.tileWidth, tile.tileHeight),
        geoTiff;

    if (this.retrievalImageFormat === "application/bil16") {
        elevationImage.imageData = new Int16Array(xhr.response);
        elevationImage.size = elevationImage.imageData.length * 2;
    } else if (this.retrievalImageFormat === "application/bil32") {
        elevationImage.imageData = new Float32Array(xhr.response);
        elevationImage.size = elevationImage.imageData.length * 4;
    }

    if (elevationImage.imageData) {
        elevationImage.findMinAndMaxElevation();
        this.imageCache.putEntry(tile.tileKey, elevationImage, elevationImage.size);
        this.timestamp = Date.now();
    }
};

export default ArcgisElevationCoverage;
