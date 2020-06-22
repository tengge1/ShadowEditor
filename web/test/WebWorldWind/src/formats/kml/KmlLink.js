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
import HrefResolver from './util/KmlHrefResolver';
import KmlElements from './KmlElements';
import KmlObject from './KmlObject';
import NodeTransformers from './util/KmlNodeTransformers';
    

    /**
     * Constructs an KmlLink. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLink
     * @classdesc Contains the data associated with Link node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing link in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#link
     * @augments KmlObject
     */
    var KmlLink = function (options) {
        KmlObject.call(this, options);

        this.onChangeListeners = [];
    };

    KmlLink.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLink.prototype, {
        /**
         * Specifies a time-based refresh mode, which can be one of the following:
         * onChange - refresh when the file is loaded and whenever the Link parameters change (the default).
         * onInterval - refresh every n seconds (specified in &lt;refreshInterval&gt;).
         * onExpire - refresh the file when the expiration time is reached. If a fetched file has a
         *  NetworkLinkControl, the &lt;expires&gt; time takes precedence over expiration times specified in HTTP
         * headers. If no &lt;expires&gt; time is specified, the HTTP max-age header is used (if present). If max-age is
         * not present, the Expires HTTP header is used (if present). (See Section RFC261b of the Hypertext
         * Transfer Protocol - HTTP 1.1 for details on HTTP header fields.)
         * @memberof KmlLink.prototype
         * @readonly
         * @type {String}
         */
        kmlRefreshMode: {
            get: function () {
                return this._factory.specific(this, {name: 'refreshMode', transformer: NodeTransformers.string});
            }
        },

        /**
         * Indicates to refresh the file every n seconds.
         * @memberof KmlLink.prototype
         * @readonly
         * @type {Number}
         */
        kmlRefreshInterval: {
            get: function () {
                return this._factory.specific(this, {name: 'refreshInterval', transformer: NodeTransformers.number});
            }
        },

        /**
         * Specifies how the link is refreshed when the "camera" changes.
         * Can be one of the following:
         * never (default) - Ignore changes in the view. Also ignore &lt;viewFormat&gt; parameters, if any.
         * onStop - Refresh the file n seconds after movement stops, where n is specified in &lt;viewRefreshTime&gt;.
         * onRequest - Refresh the file only when the user explicitly requests it. (For example, in Google Earth,
         * the user right-clicks and selects Refresh in the Context menu.)
         * onRegion - Refresh the file when the Region becomes active. See &lt;Region&gt;.
         * @memberof KmlLink.prototype
         * @readonly
         * @type {String}
         */
        kmlViewRefreshMode: {
            get: function () {
                return this._factory.specific(this, {name: 'viewRefreshMode', transformer: NodeTransformers.string});
            }
        },

        /**
         * After camera movement stops, specifies the number of seconds to wait before refreshing the view. (See
         * &lt;viewRefreshMode&gt; and onStop above.)
         * @memberof KmlLink.prototype
         * @readonly
         * @type {Number}
         */
        kmlViewRefreshTime: {
            get: function () {
                return this._factory.specific(this, {name: 'viewRefreshTime', transformer: NodeTransformers.number});
            }
        },

        /**
         * Scales the BBOX parameters before sending them to the server. A value less than 1 specifies to use less
         * than the full view (screen). A value greater than 1 specifies to fetch an area that extends beyond the
         * edges of the current view.
         * @memberof KmlLink.prototype
         * @readonly
         * @type {Number}
         */
        kmlViewBoundScale: {
            get: function () {
                return this._factory.specific(this, {name: 'viewBoundScale', transformer: NodeTransformers.number});
            }
        },

        /**
         * Specifies the format of the query string that is appended to the Link's &lt;href&gt; before the file is
         * fetched.(If the &lt;href&gt; specifies a local file, this element is ignored.) If you specify a
         * &lt;viewRefreshMode&gt; of onStop and do not include the &lt;viewFormat&gt; tag in the file, the following
         * information is automatically appended to the query string:
         * BBOX=[bboxWest],[bboxSouth],[bboxEast],[bboxNorth] This information matches the Web Map Service (WMS)
         * bounding box specification. If you specify an empty &lt;viewFormat&gt; tag, no information is appended to the
         * query string. You can also specify a custom set of viewing parameters to add to the query string. If you
         * supply a format string, it is used instead of the BBOX information. If you also want the BBOX
         * information, you need to add those parameters along with the custom parameters. You can use any of the
         * following parameters in your format string (and Google Earth will substitute the appropriate current
         * value at the time it creates the query string):
         * [lookatLon], [lookatLat] - longitude and latitude of the point that &lt;LookAt&gt; is viewing
         * [lookatRange], [lookatTilt], [lookatHeading] - values used by the &lt;LookAt&gt; element (see descriptions of
         *  &lt;range&gt;, &lt;tilt&gt;, and &lt;heading&gt; in &lt;LookAt&gt;)
         * [lookatTerrainLon], [lookatTerrainLat], [lookatTerrainAlt] - point on the terrain in degrees/meters that
         *  &lt;LookAt&gt; is viewing
         * [cameraLon], [cameraLat], [cameraAlt] - degrees/meters of the eyepoint for the camera
         * [horizFov], [vertFov] - horizontal, vertical field of view for the camera
         * [horizPixels], [vertPixels] - size in pixels of the 3D viewer
         * [terrainEnabled] - indicates whether the 3D viewer is showing terrain
         * @memberof KmlLink.prototype
         * @readonly
         * @type {String}
         */
        kmlViewFormat: {
            get: function () {
                return this._factory.specific(this, {name: 'viewFormat', transformer: NodeTransformers.string});
            }
        },

        /**
         * Appends information to the query string, based on the parameters specified. (Google Earth substitutes
         * the
         * appropriate current value at the time it creates the query string.) The following parameters are
         * supported:
         * [clientVersion]
         * [kmlVersion]
         * [clientName]
         * [language]
         * @memberof KmlLink.prototype
         * @readonly
         * @type {String}
         */
        kmlHttpQuery: {
            get: function () {
                return this._factory.specific(this, {name: 'httpQuery', transformer: NodeTransformers.string});
            }
        }
    });

    /**
     * It returns valid URL usable for remote resources.
     * @param fileCache {KmlFileCache} Cache needed to retrieve data urls from remote locations.
     * @returns {String} URL to use
     */
    KmlLink.prototype.kmlHref = function(fileCache){
        return new HrefResolver(
            this._factory.specific(this, {name: 'href', transformer: NodeTransformers.string}), fileCache
        ).url();
    };

    /**
     * @inheritDoc
     */
    KmlLink.prototype.getTagNames = function () {
        return ['Link'];
    };

	KmlElements.addKey(KmlLink.prototype.getTagNames()[0], KmlLink);

    export default KmlLink;
