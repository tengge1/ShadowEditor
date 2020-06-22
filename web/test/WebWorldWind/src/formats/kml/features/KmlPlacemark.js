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
 * @export KmlPlacemark
 */
import KmlElements from './../KmlElements';
import KmlFeature from './KmlFeature';
import KmlGeometry from '../geom/KmlGeometry';
import KmlStyle from '../styles/KmlStyle';
import KmlTimeSpan from '../KmlTimeSpan';
import KmlTimeStamp from '../KmlTimeStamp';
import PlacemarkAttributes from '../../../shapes/PlacemarkAttributes';
import Placemark from '../../../shapes/Placemark';
import Color from '../../../util/Color';
import ShapeAttributes from '../../../shapes/ShapeAttributes';
import TextAttributes from '../../../shapes/TextAttributes';
import Offset from '../../../util/Offset';
import WWUtil from '../../../util/WWUtil';
    
    /**
     * Constructs an KmlPlacemark. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from Kml file are read
     * @alias KmlPlacemark
     * @classdesc Contains the data associated with KmlPlacemark.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Placemark.
     * @constructor
     * @throws {ArgumentError} If the node is null.
     * @see https://developers.google.com/kml/documentation/kmlreference#placemark
     * @augments KmlFeature
     */
    var KmlPlacemark = function (options) {
        KmlFeature.call(this, options);
    };

    KmlPlacemark.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlPlacemark.prototype, {
        /**
         * It contains geometry associated with this placemark. The geometry is cached.
         * @memberof KmlPlacemark.prototype
         * @type {KmlGeometry}
         * @readonly
         */
        kmlGeometry: {
            get: function () {
                return this._factory.any(this, {
                    name: KmlGeometry.prototype.getTagNames()
                });
            }
        }
    });

    KmlPlacemark.prototype.render = function(dc, kmlOptions) {
        KmlFeature.prototype.render.call(this, dc, kmlOptions);

        kmlOptions = WWUtil.clone(kmlOptions);

        if(kmlOptions.lastStyle && !this._renderable) {
            // TODO: render placemarks without geometry.
            if (this.kmlGeometry) {
                this._renderable = new Placemark(
                    this.kmlGeometry.kmlCenter,
                    false,
                    this.prepareAttributes(kmlOptions.lastStyle.normal, kmlOptions.fileCache)
                );
                if(kmlOptions.lastStyle.highlight) {
                    this._renderable.highlightAttributes = this.prepareAttributes(kmlOptions.lastStyle.highlight, kmlOptions.fileCache);
                }
                this.moveValidProperties();
                dc.redrawRequested = true;
            }
        }
        
        if(this._renderable) {
            if (this.kmlGeometry) {
                this.kmlGeometry.render(dc, kmlOptions);
                this._renderable.render(dc);
            }
        }
    };

    /**
     * Prepare attributes for displaying the Placemark.
     * @param style {KmlStyle} Style altering the defaults.
     * @returns {PlacemarkAttributes} Attributes representing the current Placemark.
     */
    KmlPlacemark.prototype.prepareAttributes = function (style, fileCache) {
        var options = style && style.generate({}, fileCache) || {normal: {}, highlight:{}};
        var placemarkAttributes = new PlacemarkAttributes(KmlStyle.placemarkAttributes(options));

        placemarkAttributes.imageOffset = new Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = Color.WHITE;
        placemarkAttributes.labelAttributes = new TextAttributes(KmlStyle.textAttributes({
            _offset: new Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0),
            _color: Color.YELLOW
        }));
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes = new ShapeAttributes(KmlStyle.shapeAttributes({
            _outlineColor: Color.RED
        }));

        return placemarkAttributes;
    };

    /**
     * It takes properties from the KML definition and move them into the internal objects.
     */
    KmlPlacemark.prototype.moveValidProperties = function () {
        this._renderable.label = this.kmlName || '';
        this._renderable.altitudeMode = this.kmlAltitudeMode || WorldWind.RELATIVE_TO_GROUND;
        this._renderable.enableLeaderLinePicking = true;
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlPlacemark.prototype.getTagNames = function () {
        return ['Placemark'];
    };

    KmlElements.addKey(KmlPlacemark.prototype.getTagNames()[0], KmlPlacemark);

    export default KmlPlacemark;
