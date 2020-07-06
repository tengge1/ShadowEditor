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
 * @exports WmsUrlBuilder
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';


/**
 * Constructs a WMS URL builder.
 * @alias WmsUrlBuilder
 * @constructor
 * @classdesc Provides a factory to create URLs for WMS Get Map requests.
 * @param {String} serviceAddress The address of the WMS server.
 * @param {String} layerNames The comma-separated list of names of the layers to retrieve.
 * @param {String} styleNames The comma-separated list of names of the styles to retrieve. May be null.
 * @param {String} wmsVersion The version of the WMS server. May be null, in which case version 1.3.0 is
 * assumed.
 * @param {String} timeString The time parameter included in GetMap requests.
 * May be null, in which case no time parameter is included in the request.
 * @throws {ArgumentError} If the service address or layer names are null or empty.
 *
 */
function WmsUrlBuilder(serviceAddress, layerNames, styleNames, wmsVersion, timeString) {
    if (!serviceAddress || serviceAddress.length === 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "constructor",
                "The WMS service address is missing."));
    }

    if (!layerNames || layerNames.length === 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "constructor",
                "The WMS layer names are not specified."));
    }

    /**
     * The address of the WMS server.
     * @type {String}
     */
    this.serviceAddress = serviceAddress;

    /**
     * The comma-separated list of layer names to retrieve.
     * @type {String}
     */
    this.layerNames = layerNames;

    /**
     * The comma-separated list of style names to retrieve.
     * @type {String}
     */
    this.styleNames = styleNames ? styleNames : "";

    /**
     * Indicates whether the layer should be requested with transparency.
     * @type {Boolean}
     * @default true
     */
    this.transparent = true;

    /**
     * The WMS version to specify when requesting resources.
     * @type {String}
     * @default 1.3.0
     */
    this.wmsVersion = wmsVersion && wmsVersion.length > 0 ? wmsVersion : "1.3.0";
    this.isWms130OrGreater = this.wmsVersion >= "1.3.0";

    /**
     * The coordinate reference system to use when requesting layers.
     * @type {String}
     * @default EPSG:4326
     */
    this.crs = "EPSG:4326";

    /**
     * The time parameter included in GetMap requests. If null, no time parameter is included in the requests.
     * @type {String}
     */
    this.timeString = timeString;
}

/**
 * Creates the URL string for a WMS Get Map request.
 * @param {Tile} tile The tile for which to create the URL.
 * @param {String} imageFormat The image format to request.
 * @throws {ArgumentError} If the specified tile or image format are null or undefined.
 */
WmsUrlBuilder.prototype.urlForTile = function (tile, imageFormat) {
    if (!tile) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "urlForTile", "missingTile"));
    }

    if (!imageFormat) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "urlForTile",
                "The image format is null or undefined."));
    }

    var sector = tile.sector;

    var sb = WmsUrlBuilder.fixGetMapString(this.serviceAddress);

    if (sb.search(/service=wms/i) < 0) {
        sb = sb + "service=WMS";
    }

    sb = sb + "&request=GetMap";
    sb = sb + "&version=" + this.wmsVersion;
    sb = sb + "&transparent=" + (this.transparent ? "TRUE" : "FALSE");
    sb = sb + "&layers=" + this.layerNames;
    sb = sb + "&styles=" + this.styleNames;
    sb = sb + "&format=" + imageFormat;
    sb = sb + "&width=" + tile.tileWidth;
    sb = sb + "&height=" + tile.tileHeight;

    if (this.timeString) {
        sb = sb + "&time=" + this.timeString;
    }

    if (this.isWms130OrGreater) {
        sb = sb + "&crs=" + this.crs;
        sb = sb + "&bbox=";
        if (this.crs === "CRS:84") {
            sb = sb + sector.minLongitude + "," + sector.minLatitude + ",";
            sb = sb + sector.maxLongitude + "," + sector.maxLatitude;
        } else {
            sb = sb + sector.minLatitude + "," + sector.minLongitude + ",";
            sb = sb + sector.maxLatitude + "," + sector.maxLongitude;
        }
    } else {
        sb = sb + "&srs=" + this.crs;
        sb = sb + "&bbox=";
        sb = sb + sector.minLongitude + "," + sector.minLatitude + ",";
        sb = sb + sector.maxLongitude + "," + sector.maxLatitude;
    }

    sb = sb.replace(" ", "%20");

    return sb;
};

// Intentionally not documented.
WmsUrlBuilder.fixGetMapString = function (serviceAddress) {
    if (!serviceAddress) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "fixGetMapString",
                "The specified service address is null or undefined."));
    }

    var index = serviceAddress.indexOf("?");

    if (index < 0) { // if string contains no question mark
        serviceAddress = serviceAddress + "?"; // add one
    } else if (index !== serviceAddress.length - 1) { // else if question mark not at end of string
        index = serviceAddress.search(/&$/);
        if (index < 0) {
            serviceAddress = serviceAddress + "&"; // add a parameter separator
        }
    }

    return serviceAddress;
};

export default WmsUrlBuilder;
