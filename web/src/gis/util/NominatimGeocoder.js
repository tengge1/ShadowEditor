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
 * @exports NominatimGeocoder
 */
import Logger from '../util/Logger';


/**
 * Constructs a Nominatim geocoder.
 * @alias NominatimGeocoder
 * @constructor
 * @classdesc Provides a gazetteer that uses Open Street Map Nominatim geocoder at Mapquest.
 */
function NominatimGeocoder() {
    /**
     * The URL of the geocoder service.
     * @type {String}
     * @default http://open.mapquestapi.com/nominatim/v1/search/
     */
    this.service = "https://open.mapquestapi.com/nominatim/v1/search/";
}

/**
 * Queries the geocoder service with a specified query string.
 * @param {String} queryString The query string.
 * @param {Function} callback The function to call when the service returns the query results. This
 * function is passed two arguments: this geocoder and an array containing the query results. See
 * [the OpenStreetMap Nominatim Wiki] {@link http://wiki.openstreetmap.org/wiki/Nominatim} for a description
 * of the results. The result passed to the callback is parsed JSON.
 * @param {String} accessKey The MapQuest API access key to use for the request. See
 * https://developer.mapquest.com/plan_purchase/free/business_edition/business_edition_free
 * to obtain a key.
 */
NominatimGeocoder.prototype.lookup = function (queryString, callback, accessKey) {
    var url = this.service + queryString.replace(" ", "%20") + "?format=json",
        xhr = new XMLHttpRequest(),
        thisGeocoder = this;

    url += "&key=" + (accessKey || "lUvVRchXGGDh5Xwk3oidrXeIDAAevOUS");

    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var results = JSON.parse(xhr.responseText);

            callback(thisGeocoder, results);
        }
    };

    xhr.send(null);
};

export default NominatimGeocoder;
