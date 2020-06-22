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
import KmlElements from './../KmlElements';
import KmlFeature from './KmlFeature';
import KmlFile from '../KmlFile';
import KmlLink from '../KmlLink';
import NodeTransformers from '../util/KmlNodeTransformers';
import RefreshListener from '../util/KmlRefreshListener';
    

    var REFRESH_NETWORK_LINK_EVENT = "refreshNetworkLinkEvent";

    /**
     * Constructs an KmlNetworkLink. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlNetworkLink
     * @classdesc Contains the data associated with NetworkLink node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing NetworkLink
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#networklink
     * @augments KmlFeature
     */
    var KmlNetworkLink = function (options) {
        KmlFeature.call(this, options);

        this.isFeature = true;

        this.resolvedFile = null;
        this.displayed = false;
        this.isDownloading = false;
    };

    KmlNetworkLink.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlNetworkLink.prototype, {
        /**
         * Boolean value. A value of 0 leaves the visibility of features within the control of the Google Earth
         * user. Set the value to 1 to reset the visibility of features each time the NetworkLink is refreshed. For
         * example, suppose a Placemark within the linked KML file has &lt;visibility&gt; set to 1 and the NetworkLink
         * has
         * &lt;refreshVisibility&gt; set to 1. When the file is first loaded into Google Earth, the user can clear the
         * check box next to the item to turn off display in the 3D viewer. However, when the NetworkLink is
         * refreshed, the Placemark will be made visible again, since its original visibility state was TRUE.
         * @memberof KmlNetworkLink.prototype
         * @readonly
         * @type {Boolean}
         */
        kmlRefreshVisibility: {
            get: function () {
                return this._factory.specific(this, {name: 'refreshVisibility', transformer: NodeTransformers.boolean});
            }
        },

        /**
         * Boolean value. A value of 1 causes Google Earth to fly to the view of the LookAt or Camera in the
         * NetworkLinkControl (if it exists). If the NetworkLinkControl does not contain an AbstractView element,
         * Google Earth flies to the LookAt or Camera element in the Feature child within the &lt;kml&gt; element in the
         * refreshed file. If the &lt;kml&gt; element does not have a LookAt or Camera specified, the view is unchanged.
         * For example, Google Earth would fly to the &lt;LookAt&gt; view of the parent Document, not the &lt;LookAt&gt;
         * of the Placemarks contained within the Document.
         * @memberof KmlNetworkLink.prototype
         * @readonly
         * @type {Boolean}
         */
        kmlFlyToView: {
            get: function () {
                return this._factory.specific(this, {name: 'flyToView', transformer: NodeTransformers.boolean});
            }
        },

        /**
         * @memberof KmlNetworkLink.prototype
         * @readonly
         * @type {KmlLink}
         * @see {KmlLink}
         */
        kmlLink: {
            get: function () {
                return this._factory.any(this, {
                    name: KmlLink.prototype.getTagNames()
                });
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlNetworkLink.prototype.getTagNames = function () {
        return ['NetworkLink'];
    };

	/**
     * @inheritDoc
     */
    KmlNetworkLink.prototype.render = function(dc, kmlOptions) {
        KmlFeature.prototype.render.call(this, dc, kmlOptions);

        // Not visible and wasn't displayed yet.
        if(!kmlOptions.lastVisibility && !this.displayed) {
            return;
        }

        if(!this.isDownloading && !this.resolvedFile) {
            this.isDownloading = true;
            var self = this;

            new KmlFile(self.buildUrl(kmlOptions.fileCache)).then(function (kmlFile) {
                self.resolvedFile = kmlFile;
                self.isDownloading = false;

                self.fireEvent(kmlOptions);
            });
        }


        if(this.resolvedFile && !this.displayed) {
            this.resolvedFile.render(dc, kmlOptions);

            this.handleRefresh(kmlOptions); // This one happens always
        }
    };

    KmlNetworkLink.prototype.buildUrl = function(fileCache) {
        return this.kmlLink.kmlHref(fileCache);
    };

	/**
     * It handles refreshing strategy of the NetworkLink.
     * @param kmlOptions {Object}
     * @param kmlOptions.activeEvents {RefreshListener.Event[]} Events which should be processed in this round of render.
     */
    KmlNetworkLink.prototype.handleRefresh = function(kmlOptions) {
        var activeEvents = kmlOptions.activeEvents;
        activeEvents = activeEvents.filter(function(event){
            return event.type == REFRESH_NETWORK_LINK_EVENT;
        });
        if(activeEvents.length > 0) {
            var self = this;
            new KmlFile(self.buildUrl(kmlOptions.fileCache)).then(function (kmlFile) {
                self.resolvedFile = kmlFile;

                self.fireEvent(kmlOptions);
            });
        }
    };

	/**
     * It fires event when the kmlLink refreshMode contains refreshMode.
     * @param kmlOptions {Object}
     * @param kmlOptions.listener {RefreshListener} Object which allows you to schedule events, which will be triggered
     *   at some point in future. It doesn't have to be exactly that time.
     */
    KmlNetworkLink.prototype.fireEvent = function(kmlOptions) {
        var time = 0;
        if(this.kmlLink.kmlRefreshMode == "onInterval") {
            time = this.kmlLink.kmlRefreshInterval * 1000;
        } else if(this.kmlLink.kmlRefreshMode == "onExpire") {
            // Test whether the file is expired
            if(!this.resolvedFile) {
                return;
            } else {
                time = this.resolvedFile.getExpired();
            }
        } else {
            // No refresh mode was selected, therefore ignore this method;
            return;
        }

        kmlOptions.listener.addEvent(new RefreshListener.Event(REFRESH_NETWORK_LINK_EVENT, time, null));
    };

    KmlElements.addKey(KmlNetworkLink.prototype.getTagNames()[0], KmlNetworkLink);

    export default KmlNetworkLink;
