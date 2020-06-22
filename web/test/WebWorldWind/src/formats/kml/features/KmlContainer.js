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
import KmlFeature from './KmlFeature';
    
    /**
     * Constructs an KmlContainer. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlContainer
     * @classdesc Contains the data associated with Container options.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the container.
     * @constructor
     * @throws {ArgumentError} If the options is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#container
     * @augments KmlFeature
     */
    var KmlContainer = function (options) {
        KmlFeature.call(this, options);
    };

    KmlContainer.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlContainer.prototype, {
        /**
         * Specifies any amount of features, which are part of this document.
         * @memberof KmlDocument.prototype
         * @readonly
         * @type {Node[]}
         * @see {KmlFeature}
         */
        kmlShapes: {
            get: function(){
                var allElements = this._factory.all(this);
                return allElements.filter(function (element) {
                    // For now display only features.
                    return element.isFeature;
                });
            }
        }
    });

	/**
     * @inheritDoc
     */
    KmlContainer.prototype.render = function(dc, kmlOptions) {
        KmlFeature.prototype.render.call(this, dc, kmlOptions);

        var self = this;
        this.kmlShapes.forEach(function(shape) {
            shape.render(dc, {
                lastStyle: kmlOptions.lastStyle,
                lastVisibility: self.enabled,
                currentTimeInterval: kmlOptions.currentTimeInterval,
                regionInvisible: kmlOptions.regionInvisible,
                fileCache: kmlOptions.fileCache,
                styleResolver: kmlOptions.styleResolver,
                listener: kmlOptions.listener,
                activeEvents: kmlOptions.activeEvents
            });
        });
    };


    /**
     * @inheritDoc
     */
    KmlContainer.prototype.getTagNames = function () {
        return ['Folder', 'Document'];
    };

    export default KmlContainer;
