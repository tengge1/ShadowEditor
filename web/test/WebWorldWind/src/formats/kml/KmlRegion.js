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
import BoundingBox from '../../geom/BoundingBox';
import Color from '../../util/Color';
import KmlElements from './KmlElements';
import KmlLatLonAltBox from './KmlLatLonAltBox';
import KmlLod from './KmlLod';
import KmlObject from './KmlObject';
import KmlStyle from './styles/KmlStyle';
import NodeTransformers from './util/KmlNodeTransformers';
import Sector from '../../geom/Sector';
    

    /**
     * Constructs an KmlRegion. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlRegion
     * @classdesc Contains the data associated with Region node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing region in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#region
     */
    var KmlRegion = function (options) {
        KmlObject.call(this, options);
    };

    KmlRegion.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlRegion.prototype, {
        /**
         * A bounding box that describes an area of interest defined by geographic coordinates and altitudes.
         * Default values and required fields are as follows:
         * @memberof KmlRegion.prototype
         * @readonly
         * @type {KmlLatLonBox}
         */
        kmlLatLonAltBox: {
            get: function () {
                return this._factory.specific(this, {
                    name: KmlLatLonAltBox.prototype.getTagNames(),
                    transformer: NodeTransformers.kmlObject
                });
            }
        },

        /**
         * Lod is an abbreviation for Level of Detail. &lt;Lod&gt; describes the size of the projected region on the
         * screen that is required in order for the region to be considered "active." Also specifies the size of
         * the pixel ramp used for fading in (from transparent to opaque) and fading out (from opaque to
         * transparent). See diagram below for a visual representation of these parameters.
         * @memberof KmlRegion.prototype
         * @readonly
         * @type {KmlLod}
         */
        kmlLod: {
            get: function () {
                return this._factory.specific(this, {
                    name: KmlLod.prototype.getTagNames(),
                    transformer: NodeTransformers.kmlObject
                });
            }
        }
    });

    /**
     * It tests whether the region intersects the visible area.
     * @param dc {DrawContext} Frustum to test for intersection.
     */
    KmlRegion.prototype.intersectsVisible = function (dc) {
        var box = this.kmlLatLonAltBox;

        var boundingBoxForRegion = new BoundingBox();
        boundingBoxForRegion.setToSector(new Sector(box.kmlSouth, box.kmlNorth, box.kmlWest, box.kmlEast), dc.globe, box.kmlMinAltitude, box.kmlMaxAltitude);

        return boundingBoxForRegion.intersectsFrustum(dc.frustumInModelCoordinates) &&
            (!box.kmlMinAltitude || dc.eyePosition.altitude > box.kmlMinAltitude) &&
            (!box.kmlMaxAltitude || dc.eyePosition.altitude < box.kmlMaxAltitude);
    };

    /**
     * @inheritDoc
     */
    KmlRegion.prototype.getTagNames = function () {
        return ['Region'];
    };

    KmlElements.addKey(KmlRegion.prototype.getTagNames()[0], KmlRegion);

    export default KmlRegion;
