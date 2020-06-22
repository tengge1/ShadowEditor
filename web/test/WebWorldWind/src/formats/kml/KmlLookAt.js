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
import KmlAbstractView from './KmlAbstractView';
import KmlElements from './KmlElements';
import NodeTransformers from './util/KmlNodeTransformers';
import Position from '../../geom/Position';
    

    /**
     * Constructs an KmlLookAt. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLookAt
     * @classdesc Contains the data associated with LookAt node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing looking at something in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#lookat
     * @augments KmlAbstractView
     */
    var KmlLookAt = function (options) {
        KmlAbstractView.call(this, options);
    };

    KmlLookAt.prototype = Object.create(KmlAbstractView.prototype);

    Object.defineProperties(KmlLookAt.prototype, {
        /**
         * Longitude of the point the camera is looking at. Angular distance in degrees, relative to the Prime
         * Meridian. Values west of the Meridian range from -180 to 0 degrees. Values east of the Meridian range
         * from 0 to 180 degrees.
         * @memberof KmlLookAt.prototype
         * @readonly
         * @type {Number}
         */
        kmlLongitude: {
            get: function () {
                return this._factory.specific(this, {name: 'longitude', transformer: NodeTransformers.number});
            }
        },

        /**
         * Latitude of the point the camera is looking at. Degrees north or south of the Equator (0 degrees). Values
         * range from -90 degrees to 90 degrees.
         * @memberof KmlLookAt.prototype
         * @readonly
         * @type {Number}
         */
        kmlLatitude: {
            get: function () {
                return this._factory.specific(this, {name: 'latitude', transformer: NodeTransformers.number});
            }
        },

        /**
         * Distance from the earth's surface, in meters. Interpreted according to the LookAt's altitude mode.
         * @memberof KmlLookAt.prototype
         * @readonly
         * @type {Number}
         */
        kmlAltitude: {
            get: function () {
                return this._factory.specific(this, {name: 'altitude', transformer: NodeTransformers.number});
            }
        },

        /**
         * Direction (that is, North, South, East, West), in degrees. Default=0 (North). (See diagram below.) Values
         * range from 0 to 360 degrees.
         * @memberof KmlLookAt.prototype
         * @readonly
         * @type {Number}
         */
        kmlHeading: {
            get: function () {
                return this._factory.specific(this, {name: 'heading', transformer: NodeTransformers.number});
            }
        },

        /**
         * Angle between the direction of the LookAt position and the normal to the surface of the earth. (See
         * diagram below.) Values range from 0 to 90 degrees. Values for &lt;tilt&gt; cannot be negative. A &lt;tilt&gt; value
         * of 0 degrees indicates viewing from directly above. A &lt;tilt&gt; value of 90 degrees indicates viewing along
         * the horizon.
         * @memberof KmlLookAt.prototype
         * @readonly
         * @type {Number}
         */
        kmlTilt: {
            get: function () {
                return this._factory.specific(this, {name: 'tilt', transformer: NodeTransformers.number});
            }
        },

        /**
         * Distance in meters from the point specified by &lt;longitude&gt;, &lt;latitude&gt;, and &lt;altitude&gt; to the LookAt
         * position. (See diagram below.)
         * @memberof KmlLookAt.prototype
         * @readonly
         * @type {Number}
         */
        kmlRange: {
            get: function () {
                return this._factory.specific(this, {name: 'range', transformer: NodeTransformers.number});
            }
        },

        /**
         * Specifies how the &lt;altitude&gt; specified for the LookAt point is interpreted. Possible values are as
         * follows: clampToGround - (default) Indicates to ignore the &lt;altitude&gt; specification and place the LookAt
         * position on the ground. relativeToGround - Interprets the &lt;altitude&gt; as a value in meters above the
         * ground. absolute - Interprets the &lt;altitude&gt; as a value in meters above sea level.
         * @memberof KmlLookAt.prototype
         * @readonly
         * @type {String}
         */
        kmlAltitudeMode: {
            get: function () {
                return this._factory.specific(this, {name: 'altitudeMode', transformer: NodeTransformers.string});
            }
        }
    });

    /**
     * Go to the look at location.
     */
    KmlLookAt.prototype.update = function(options) {
        if(options.wwd) {
            var altitude = this.kmlAltitude || 4000;
            // TODO: Respect altitude mode.
            options.wwd.goTo(new Position(this.kmlLatitude, this.kmlLongitude, altitude));
        }
    };

    /**
     * @inheritDoc
     */
    KmlLookAt.prototype.getTagNames = function () {
        return ['LookAt'];
    };

    KmlElements.addKey(KmlLookAt.prototype.getTagNames()[0], KmlLookAt);

    export default KmlLookAt;
