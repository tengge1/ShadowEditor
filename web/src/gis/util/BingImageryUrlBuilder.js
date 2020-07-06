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
 * @exports BingImageryUrlBuilder
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import WWUtil from '../util/WWUtil';


/**
 * Constructs a URL builder for Bing imagery.
 * @alias BingImageryUrlBuilder
 * @constructor
 * @classdesc Provides a factory to create URLs for Bing image requests.
 * @param {String} imagerySet The name of the imagery set to display.
 * @param {String} bingMapsKey The Bing Maps key to use for the image requests. If null or undefined, the key at
 * [WorldWind.BingMapsKey]{@link WorldWind#BingMapsKey} is used. If that is null or undefined, the default
 * WorldWind Bing Maps key is used,
 * but this fallback is provided only for non-production use. If you are using Web WorldWind in an app or a
 * web page, you must obtain your own key from the
 * [Bing Maps Portal]{@link https://www.microsoft.com/maps/choose-your-bing-maps-API.aspx}
 * and either pass it as a parameter to this constructor or specify it as the property
 * [WorldWind.BingMapsKey]{@link WorldWind#BingMapsKey}.
 */
function BingImageryUrlBuilder(imagerySet, bingMapsKey) {
    var wwBingMapsKey = "AkttWCS8p6qzxvx5RH3qUcCPgwG9nRJ7IwlpFGb14B0rBorB5DvmXr2Y_eCUNIxH";

    // Use key specified for this layer
    this.bingMapsKey = bingMapsKey;

    // If none, fallback to key specified globally
    if (!this.bingMapsKey) {
        this.bingMapsKey = WorldWind.BingMapsKey;
    }

    // If none, fallback to default demo key
    if (!this.bingMapsKey) {
        this.bingMapsKey = wwBingMapsKey;
    }

    // If using WorldWind Bing Maps demo key, show warning
    if (this.bingMapsKey === wwBingMapsKey) {
        BingImageryUrlBuilder.showBingMapsKeyWarning();
    }

    this.imagerySet = imagerySet;
}

// Intentionally not documented.
BingImageryUrlBuilder.showBingMapsKeyWarning = function () {
    if (!BingImageryUrlBuilder.keyMessagePrinted) {
        BingImageryUrlBuilder.keyMessagePrinted = true;

        Logger.log(Logger.LEVEL_WARNING, "WARNING: You are using a limited use, non-production Bing Maps key.\n" +
            "If you are developing an app or a web page this violates the Bing Terms of Use.\n" +
            "Please visit https://www.microsoft.com/en-us/maps/create-a-bing-maps-key to obtain your own key for your application.\n" +
            "Specify that key to WorldWind by setting the WorldWind.BingMapsKey property to your key " +
            "prior to creating any Bing Maps layers.\n");
    }
};

BingImageryUrlBuilder.prototype.requestMetadata = function () {
    // Retrieve the metadata for the imagery set.

    if (!this.metadataRetrievalInProcess) {
        this.metadataRetrievalInProcess = true;

        var url = "https://dev.virtualearth.net/REST/V1/Imagery/Metadata/" + this.imagerySet + "/0,0?zl=1&uriScheme=https&key="
            + this.bingMapsKey;

        // Use JSONP to request the metadata. Can't use XmlHTTPRequest because the virtual earth server doesn't
        // allow cross-origin requests for metadata retrieval.

        var thisObject = this;
        WWUtil.jsonp(url, "jsonp", function (jsonData) {
            thisObject.imageUrl = jsonData.resourceSets[0].resources[0].imageUrl;

            // Send an event to request a redraw.
            var e = document.createEvent('Event');
            e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
            window.dispatchEvent(e);

            thisObject.metadataRetrievalInProcess = false;
        });

    }
};

/**
 * Creates the URL string for a Bing Maps request.
 * @param {Tile} tile The tile for which to create the URL.
 * @param {String} imageFormat This argument is not used.
 * @return {String} The URL for the specified tile.
 * @throws {ArgumentError} If the specified tile is null or undefined.
 */
BingImageryUrlBuilder.prototype.urlForTile = function (tile, imageFormat) {
    if (!tile) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "BingImageryUrlBuilder", "urlForTile", "missingTile"));
    }

    if (!this.imageUrl) {
        // Can't do anything until we get the metadata back from the server.
        this.requestMetadata();
        return null;
    }

    // The quad key identifies the specific image tile for the requested tile.
    var quadKey = this.quadKeyFromLevelRowColumn(tile.level.levelNumber, tile.row, tile.column),
        url;

    // Modify the original image URL to request the tile.
    if (this.imagerySet === "Aerial") {
        url = this.imageUrl.replace(/a3/, "a" + quadKey);
    } else if (this.imagerySet === "AerialWithLabels") {
        url = this.imageUrl.replace(/h3/, "h" + quadKey);
    } else if (this.imagerySet === "Road") {
        url = this.imageUrl.replace(/r3/, "r" + quadKey);
    }

    return url;
};

// Intentionally not documented.
BingImageryUrlBuilder.prototype.quadKeyFromLevelRowColumn = function (levelNumber, row, column) {
    var digit, mask, key = "";

    for (var i = levelNumber + 1; i > 0; i--) {
        digit = 0;
        mask = 1 << i - 1;

        if ((column & mask) != 0) {
            digit += 1;
        }

        if ((row & mask) != 0) {
            digit += 2;
        }

        key += digit.toString();
    }

    return key;
};

export default BingImageryUrlBuilder;

