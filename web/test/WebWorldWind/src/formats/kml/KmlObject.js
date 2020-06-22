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
 * @exports KmlObject
 */
import ArgumentError from '../../error/ArgumentError';
import Attribute from './util/KmlAttribute';
import KmlElements from './KmlElements';
import KmlElementsFactoryCached from './util/KmlElementsFactoryCached';
import Logger from '../../util/Logger';
import Promise from '../../util/Promise';
import Renderable from '../../render/Renderable';
    

    /**
     * Constructs an Kml object. Every node in the Kml document is either basic type or Kml object. Applications usually
     * don't call this constructor. It is usually called only by its descendants.
     * It should be treated as mixin.
     * @alias KmlObject
     * @classdesc Contains the data associated with every Kml object.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Kml Object
     * @param options.controls {KmlControls[]} Controls associated with current Node
     * @constructor
     * @throws {ArgumentError} If either node is null or id isn't present on the object.
     * @augments Renderable
     * @see https://developers.google.com/kml/documentation/kmlreference#object
     */
    var KmlObject = function (options) {
        Renderable.call(this);

        options = options || {};
        if (!options.objectNode) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "KmlObject", "constructor", "Passed node isn't defined.")
            );
        }
        this._node = options.objectNode;
        this._cache = {};
        
        this._controls = options.controls || [];
        // It should be possible to keep the context here?
        this._factory = new KmlElementsFactoryCached({controls: this._controls});
        
        this.hook(this._controls, options);
    };

    KmlObject.prototype = Object.create(Renderable.prototype);

    Object.defineProperties(KmlObject.prototype, {
        /**
         * Every object, which is part of the KML document has its identity. We will use it for changes in the
         * document for binding.
         * @memberof KmlObject.prototype
         * @type {String}
         * @readonly
         */
        id: {
            get: function () {
                return new Attribute(this.node, "id").value();
            }
        },

        /**
         * Node of this object. It may be overridden by other users of some functions like parse.
         * @memberof KmlObject.prototype
         * @type {Node}
         * @readonly
         */
        node: {
            get: function () {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this._node;
            }
        }
    });

    /**
     * It calls all controls associated with current KmlFile with the link to this.
     * @param controls {KmlControls[]} Controls associated with current tree.
     * @param options {Object} Options to pass into the controls.
     */
    KmlObject.prototype.hook = function (controls, options) {
        var self = this;
        controls.forEach(function (control) {
            control.hook(self, options);
        });
    };

    /**
     * @inheritDoc
     */
    KmlObject.prototype.render = function (dc) {
    };

    /**
     * Returns tag name of all descendants of abstract node or the tag name for current node.
     * @returns {String[]}
     */
    KmlObject.prototype.getTagNames = function () {
        return [];
    };

    export default KmlObject;
