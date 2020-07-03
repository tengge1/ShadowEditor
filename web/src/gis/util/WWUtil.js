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
import ArgumentError from '../error/ArgumentError';
import Line from '../geom/Line';
import Logger from '../util/Logger';
import Rectangle from '../geom/Rectangle';
import Vec3 from '../geom/Vec3';

/**
 * Provides math constants and functions.
 * @exports WWUtil
 */
var WWUtil = {
    // A regular expression that matches latitude followed by a comma and possible white space followed by
    // longitude. Latitude and longitude ranges are not considered.
    latLonRegex: /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/,

    /**
     * Returns the suffix for a specified mime type.
     * @param {String} mimeType The mime type to determine a suffix for.
     * @returns {String} The suffix for the specified mime type, or null if the mime type is not recognized.
     */
    suffixForMimeType: function (mimeType) {
        if (mimeType === "image/png")
            return "png";

        if (mimeType === "image/jpeg")
            return "jpg";

        if (mimeType === "application/bil16")
            return "bil";

        if (mimeType === "application/bil32")
            return "bil";

        return null;
    },

    /**
     * Returns the current location URL as obtained from window.location with the last path component
     * removed.
     * @returns {String} The current location URL with the last path component removed.
     */
    currentUrlSansFilePart: function () {
        var protocol = window.location.protocol,
            host = window.location.host,
            path = window.location.pathname,
            pathParts = path.split("/"),
            newPath = "";

        for (var i = 0, len = pathParts.length; i < len - 1; i++) {
            if (pathParts[i].length > 0) {
                newPath = newPath + "/" + pathParts[i];
            }
        }

        return protocol + "//" + host + newPath;
    },

    /**
     * Returns the URL of the directory containing the WorldWind library.
     * @returns {String} The URL of the directory containing the WorldWind library, or null if that directory
     * cannot be determined.
     */
    worldwindlibLocation: function () {
        var scripts = document.getElementsByTagName("script"),
            libraryName = "/worldwind.";

        for (var i = 0; i < scripts.length; i++) {
            var index = scripts[i].src.indexOf(libraryName);
            if (index >= 0) {
                return scripts[i].src.substring(0, index) + "/";
            }
        }

        return null;
    },

    /**
     * Returns the path component of a specified URL.
     * @param {String} url The URL from which to determine the path component.
     * @returns {String} The path component, or the empty string if the specified URL is null, undefined
     * or empty.
     */
    urlPath: function (url) {
        if (!url)
            return "";

        var urlParts = url.split("/"),
            newPath = "";

        for (var i = 0, len = urlParts.length; i < len; i++) {
            var part = urlParts[i];

            if (!part || part.length === 0
                || part.indexOf(":") != -1
                || part === "."
                || part === ".."
                || part === "null"
                || part === "undefined") {
                continue;
            }

            if (newPath.length !== 0) {
                newPath = newPath + "/";
            }

            newPath = newPath + part;
        }

        return newPath;
    },

    /**
     * Sets each element of an array to a specified value. This function is intentionally generic, and works
     * with any data structure with a length property whose elements may be referenced using array index syntax.
     * @param array The array to fill.
     * @param {*} value The value to assign to each array element.
     */
    fillArray: function (array, value) {
        if (!array) {
            return;
        }

        for (var i = 0, len = array.length; i < len; i++) {
            array[i] = value;
        }
    },

    /**
     * Multiplies each element of an array by a specified value and assigns each element to the result. This
     * function is intentionally generic, and works with any data structure with a length property whose
     * elements may be referenced using array index syntax.
     * @param array The array to fill.
     * @param {*} value The value to multiply by each array element.
     */
    multiplyArray: function (array, value) {
        if (!array) {
            return;
        }

        for (var i = 0, len = array.length; i < len; i++) {
            array[i] *= value;
        }
    },

    // Used to form unique function names for JSONP callback functions.
    jsonpCounter: 0,

    /**
     * Request a resource using JSONP.
     * @param {String} url The url to receive the request.
     * @param {String} parameterName The JSONP callback function key required by the server. Typically
     * "jsonp" or "callback".
     * @param {Function} callback The function to invoke when the request succeeds. The function receives
     * one argument, the JSON payload of the JSONP request.
     */
    jsonp: function (url, parameterName, callback) {

        // Generate a unique function name for the JSONP callback.
        var functionName = "gov_nasa_worldwind_jsonp_" + WWUtil.jsonpCounter++;

        // Define a JSONP callback function. Assign it to global scope the browser can find it.
        window[functionName] = function (jsonData) {
            // Remove the JSONP callback from global scope.
            delete window[functionName];

            // Call the client's callback function.
            callback(jsonData);
        };

        // Append the callback query parameter to the URL.
        var jsonpUrl = url + (url.indexOf('?') === -1 ? '?' : '&');
        jsonpUrl += parameterName + "=" + functionName;

        // Create a script element for the browser to invoke.
        var script = document.createElement('script');
        script.async = true;
        script.src = jsonpUrl;

        // Prepare to add the script to the document's head.
        var head = document.getElementsByTagName('head')[0];

        // Set up to remove the script element once it's invoked.
        var cleanup = function () {
            script.onload = undefined;
            script.onerror = undefined;
            head.removeChild(script);
        };

        script.onload = cleanup;
        script.onerror = cleanup;

        // Add the script element to the document, causing the browser to invoke it.
        head.appendChild(script);
    },

    arrayEquals: function (array1, array2) {
        return (array1.length == array2.length) && array1.every(function (element, index) {
            return element === array2[index] || element.equals && element.equals(array2[index]);
        });
    },

    /**
     * It transforms given item to the boolean. It respects that 0, "0" and "false" are percieved as false
     * on top of the standard Boolean function.
     * @param item {String} Item to transform
     * @returns {boolean} Value transformed to the boolean.
     */
    transformToBoolean: function (item) {
        if (item == 0 || item == "0" || item == "false") {
            return false;
        } else {
            return Boolean(item);
        }
    },

    /**
     * It clones original object into the new one. It is necessary to retain the options information valid
     * for all nodes.
     * @param original Object to clone
     * @returns {Object} Cloned object
     */
    clone: function (original) {
        var clone = {};
        var i, keys = Object.keys(original);

        for (i = 0; i < keys.length; i++) {
            // copy each property into the clone
            clone[keys[i]] = original[keys[i]];
        }

        return clone;
    },

    /**
     * It returns unique GUID.
     * @returns {string} String representing unique identifier in the application.
     */
    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    /**
     * Transforms item to date. It accepts ISO-8601 format.
     * @param item {String} To transform.
     * @returns {Date} Date extracted from the current information.
     */
    date: function (item) {
        return new Date(item);
    },

    /**
     * Determines whether subjectString begins with the characters of searchString.
     * @param {String} subjectString The string to analyse.
     * @param {String} searchString The characters to be searched for at the start of subjectString.
     * @param {Number} position The position in subjectString at which to begin searching for searchString; defaults to 0.
     * @return {Boolean} true if the given characters are found at the beginning of the string; otherwise, false.
     */
    startsWith: function (subjectString, searchString, position) {
        position = position || 0;
        return subjectString.substr(position, searchString.length) === searchString;
    },

    /**
     * Determines whether subjectString ends with the characters of searchString.
     * @param {String} subjectString The string to analyse.
     * @param {String} searchString The characters to be searched for at the end of subjectString.
     * @param {Number} length Optional. If provided overwrites the considered length of the string to search in. If omitted, the default value is the length of the string.
     * @return {Boolean} true if the given characters are found at the end of the string; otherwise, false.
     */
    endsWith: function (subjectString, searchString, length) {
        if (typeof length !== 'number' || !isFinite(length) || Math.floor(length) !== length || length > subjectString.length) {
            length = subjectString.length;
        }
        length -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, length);
        return lastIndex !== -1 && lastIndex === length;
    }
};

export default WWUtil;
