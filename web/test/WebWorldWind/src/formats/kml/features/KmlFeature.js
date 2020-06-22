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
import KmlObject from './../KmlObject';
import KmlAbstractView from '../KmlAbstractView';
import KmlFile from '../KmlFile';
import KmlStyleMap from '../styles/KmlStyleMap';
import KmlStyleSelector from '../styles/KmlStyleSelector';
import KmlRegion from '../KmlRegion';
import KmlTimePrimitive from '../KmlTimePrimitive';
import NodeTransformers from '../util/KmlNodeTransformers';
import Promise from '../../../util/Promise';
    
    /**
     * Constructs an KmlFeature. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read
     * @alias KmlFeature
     * @classdesc Contains the data associated with KmlFeature.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Feature
     * @constructor
     * @throws {ArgumentError} If the node is null.
     * @see https://developers.google.com/kml/documentation/kmlreference#feature
     * @augments KmlObject
     */
    var KmlFeature = function (options) {
        //noinspection JSUndefinedPropertyAssignment
        this.isFeature = options.isFeature = true;

        KmlObject.call(this, options);

        this._pStyle = null;
        this.controlledVisibility = null;
    };

    KmlFeature.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlFeature.prototype, {
		/**
         * Style of this feature. Every feature should have a style. If there is no Style, null is returned.
         */
        style: {
            get: function() {
                return this._pStyle;
            }
        },

        /**
         * Name of this feature. Every feature should have name.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlName: {
            get: function () {
                return this._factory.specific(this, {name: 'name', transformer: NodeTransformers.string});
            }
        },

        /**
         * Visibility of current feature. It is possible for some features to be invisible.
         * @memberof KmlFeature.prototype
         * @type {Boolean}
         * @readonly
         */
        kmlVisibility: {
            get: function () {
                return this._factory.specific(this, {name: 'visibility', transformer: NodeTransformers.boolean});
            }
        },

        /**
         * It is applied only to Document, Folder and NetworkLink and represents whether they should be rendered
         * collapsed or expanded.
         * @memberof KmlFeature.prototype
         * @type {Boolean}
         * @readonly
         */
        kmlOpen: {
            get: function () {
                return this._factory.specific(this, {name: 'open', transformer: NodeTransformers.boolean});
            }
        },

        /**
         * It represents unstructured address associated with the Feature.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlAddress: {
            get: function () {
                return this._factory.specific(this, {name: 'address', transformer: NodeTransformers.string});
            }
        },

        /**
         * It represents phone number associated with current feature. Quite probably irrelevant information.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlPhoneNumber: {
            get: function () {
                return this._factory.specific(this, {name: 'phoneNumber', transformer: NodeTransformers.string});
            }
        },

        /**
         * It represents description of this feature. It can be displayed as a part of the feature.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlDescription: {
            get: function () {
                return this._factory.specific(this, {name: 'description', transformer: NodeTransformers.string});
            }
        },

        /**
         * URL of a &lt;Style&gt; or &lt;StyleMap&gt; defined in a Document. If the style is in the same file, use
         * a # reference. If the style is defined in an external file, use a full URL along with # referencing. If
         * it references remote URL, this server must support CORS for us to be able to download it.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlStyleUrl: {
            get: function () {
                return this._factory.specific(this, {name: 'styleUrl', transformer: NodeTransformers.string});
            }
        },

        /**
         * A short description of the feature. In Google Earth, this description is displayed in the Places panel
         * under the name of the feature. If a Snippet is not supplied, the first two lines of the
         * &lt;description&gt; are used. In Google Earth, if a Placemark contains both a description and a Snippet,
         * the &lt;Snippet&gt; appears beneath the Placemark in the Places panel, and the &lt;description&gt;
         * appears in the Placemark's description balloon. This tag does not support HTML markup. &lt;Snippet&gt;
         * has a maxLines attribute, an integer that specifies the maximum number of lines to display.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlSnippet: {
            get: function () {
                return this._factory.specific(this, {name: 'Snippet', transformer: NodeTransformers.string});
            }
        },

        /**
         * It represents one of the AbstractViews associated with current Feature. Specific implementation of
         * AbstractView will be returned.
         * @memberof KmlFeature.prototype
         * @type {KmlAbstractView}
         * @readonly
         */
        kmlAbstractView: {
            get: function () {
                return this._factory.any(this, {name: KmlAbstractView.prototype.getTagNames()});
            }
        },

        /**
         * It represents one of the TimePrimitives associated with current Feature. Specific implementation of
         * TimePrimitive will be returned.
         * @memberof KmlFeature.prototype
         * @type {KmlTimePrimitive}
         * @readonly
         */
        kmlTimePrimitive: {
            get: function () {
                return this._factory.any(this, {
                    name: KmlTimePrimitive.prototype.getTagNames()
                });
            }
        },

        /**
         * One style element per Feature, with possible children of different substyles.
         * @memberof KmlFeature.prototype
         * @type {KmlStyle}
         * @readonly
         */
        kmlStyleSelector: {
            get: function () {
                return this._factory.any(this, {
                    name: KmlStyleSelector.prototype.getTagNames()
                });
            }
        },

        /**
         * Features and geometry associated with a Region are drawn only when the Region is active. See
         * &lt;Region&gt;.
         * @memberof KmlFeature.prototype
         * @type {KmlRegion}
         * @readonly
         */
        kmlRegion: {
            get: function () {
                return this._factory.any(this, {
                    name: KmlRegion.prototype.getTagNames()
                });
            }
        }
    });

	/**
	 * @inheritDoc
     */
    KmlFeature.prototype.render = function(dc, kmlOptions) {
        KmlObject.prototype.render.call(this, dc, kmlOptions);

        this.solveStyle(dc, kmlOptions);
        this.solveVisibility(dc, kmlOptions);
    };

	/**
     * Internal use only
     * It solves style which should be applied to current feature.
     * @param dc {DrawContext} DrawContext associated with current processing.
     * @param kmlOptions {Object}
     * @param kmlOptions.lastStyle {KmlStyle} Style representing the one to apply to current information.
     */
    KmlFeature.prototype.solveStyle = function(dc, kmlOptions) {
        this.getStyle(dc, kmlOptions);
        if(this.style != null) {
            kmlOptions.lastStyle = this.style;
        }
    };

	/**
     * Internal use only
     * It solves whether the feature should be visible based on the Region.
     * @param dc {DrawContext} Draw context associated with current processing.
     * @returns {boolean} true if there is no region or the feature is in the region.
     */
    KmlFeature.prototype.solveRegion = function(dc) {
        if(this.kmlRegion) {
            return this.kmlRegion.intersectsVisible(dc);
        } else {
            return true;
        }
    };

	/**
     * Internal use only
     * It solves whether current feature should be visible. It takes into account the visibility of parent elements, Time constraints, region, visibility.
     * @param dc {DrawContext} Draw context associated with current processing.
     * @param kmlOptions {Object}
     */
    KmlFeature.prototype.solveVisibility = function(dc, kmlOptions) {
        var parentVisibility = kmlOptions.lastVisibility !== false;
        var timeBasedVisibility = this.solveTimeVisibility(dc);
        var regionVisibility = this.solveRegion(dc);
        var myVisibility = this.kmlVisibility !== false;

        if(this.controlledVisibility === true) {
            this.enabled = true;
        } else if(this.controlledVisibility === false) {
            this.enabled = false;
        } else {
            this.enabled = parentVisibility && timeBasedVisibility && regionVisibility && myVisibility;
        }

        kmlOptions.lastVisibility = this.enabled;
        if(this._renderable) {
            this._renderable.enabled = this.enabled;
        }
    };

    /**
     * Internal function for solving the time visibility. The element is visible when its whole range is inside the
     * time range chosen by user.
     */
    KmlFeature.prototype.solveTimeVisibility = function (dc) {
        var timeRangeOfFeature = this.kmlTimePrimitive && this.kmlTimePrimitive.timeRange();

        if (dc.currentLayer.currentTimeInterval && timeRangeOfFeature) {
            var from = dc.currentLayer.currentTimeInterval[0];
            var to = dc.currentLayer.currentTimeInterval[1];

            if (
                timeRangeOfFeature &&
                (
                    timeRangeOfFeature.from < from ||
                    timeRangeOfFeature.from > to ||
                    timeRangeOfFeature.to > to
                )
            ) {
                return false;
            }
        }

        return true;
    };

    /**
     * It retrieves the style for current element, regardless of whether it is local or remote.
     * @params dc {DrawContext} All contextual information for rendering.
     * @params kmlOptions {Object}
     * @params kmlOptions.styleResolver {StyleResolver} Instance of StyleResolver used in this file.
     * @return {Promise|undefined} Promise of the file to deliver
     */
    KmlFeature.prototype.getStyle = function (dc, kmlOptions) {
        if (this._pStyle) {
            return;
        }

        var self = this;
        return kmlOptions.styleResolver.handleRemoteStyle(self.kmlStyleUrl, self.kmlStyleSelector).then(function(styles){
            self._pStyle = styles;
            dc.redrawRequested = true;
        });
    };

    /**
     * @inheritDoc
     */
    KmlFeature.prototype.getTagNames = function () {
        return ['NetworkLink', 'Placemark', 'PhotoOverlay', 'ScreenOverlay', 'GroundOverlay', 'Folder',
            'Document'];
    };

    export default KmlFeature;
