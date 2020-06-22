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
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import WktTokens from './WktTokens';
    /**
     * Wkt is capable of parsing the text representation of the WKT objects. The explanation of what all is
     * supported is to be found in the README.MD in this directory.<br/>
     * <br/>
     * The simplest possible usage is:<br/>
     * var layer = new WorldWind.RenderableLayer();<br/>
     * var parser = new Wkt('POINT (19 23)');<br/>
     * parser.load(null, null, layer);<br/>
     * wwd.addLayer(layer);<br/>
     * This example adds the WKT into the map<br/>
     *
     * The more complex usage allows you to do whatever you want with the parsed objects. For example you can make
     * sure that only points are displayed<br/>
     * var layer = new WorldWind.RenderableLayer();<br/>
     * var parser = new Wkt('POINT (19 23)');<br/>
     * parser.load(function(wkt, objects){<br/>
     *   var shapes = []; <br/>
     *   objects.forEach(function(object){<br/>
     *     if(object.type == WorldWind.WktType.SupportedGeometries.POINT) { <br/>
     *       shapes.push.apply(shapes, object.shapes());<br/>
     *     } <br/>
     *   }); <br/>
     *   <br/>
     *   if(wkt.layer) {<br/>
     *     wkt.layer.addRenderables(shapes);<br/>
     *   }<br/>
     * }, null, layer);<br/>
     * wwd.addLayer(layer);<br/>
     *
     * The most complex usage is when you want to supply different configuration for object before it is added to the layer.<br/>
     * var layer = new WorldWind.RenderableLayer();<br/>
     * var parser = new Wkt('POINT (19 23)');<br/>
     * parser.load(null, function(shape) {<br/>
     *   if(shape.type == WktType.SupportedGeometries.POINT) {<br/>
     *     var shapeAttributes = new ShapeAttributes(null);<br/>
     *     shapeAttributes.fontColor = Color.RED;<br/>
     *     return {<br/>
     *         attributes: shapeAttributes<br/>
     *     };<br/>
     *   }<br/>
     * }, layer);<br/>
     * wwd.addLayer(layer);<br/>
     *
     * @param textRepresentation {String} Text representation of WKT objects.
     * @constructor
     * @alias Wkt
     */
    var Wkt = function (textRepresentation) {
        this.textRepresentation = textRepresentation;

        this._parserCompletionCallback = this.defaultParserCompletionCallback;
        this._shapeConfigurationCallback = this.defaultShapeConfigurationCallback;

        this._layer = null;
    };

    Object.defineProperties(Wkt.prototype, {
        /**
         * The completion callback specified to [load]{@link Wkt#load}. This function is called when
         * wkt parsing is done but before creating shapes for the wkt. It's single argument is
         * the WKT string.
         * @memberof Wkt.prototype
         * @type {Function}
         * @default [defaultParserCompletionCallback]{@link Wkt#defaultParserCompletionCallback}
         * @readonly
         */
        parserCompletionCallback: {
            get: function () {
                return this._parserCompletionCallback;
            }
        },

        /**
         * The attribute callback specified to [load]{@link Wkt#load}.
         * See that method's description for details.
         * @memberof Wkt.prototype
         * @type {Function}
         * @default [defaultShapeConfigurationCallback]{@link Wkt#defaultShapeConfigurationCallback}
         * @readonly
         */
        shapeConfigurationCallback: {
            get: function () {
                return this._shapeConfigurationCallback;
            }
        },

        /**
         * The layer containing the shapes representing the records in this wkt, as specified to this
         * wkt's constructor.
         * @memberof Wkt.prototype
         * @type {RenderableLayer}
         * @readonly
         */
        layer: {
            get: function() {
                return this._layer;
            }
        }
    });

    /**
     * It parses the received string and create the Objects, which then can be rendered.
     * @param parserCompletionCallback {Function} An optional function called when the WKT loading is
     *   complete and all the shapes have been added to the layer.
     * @param shapeConfigurationCallback {Function} This function  is called whenever new shape is created. It provides
     *   the current shape as the first argument. In this way it is possible to modify the shape even provide another one.
     *   If any shape is returned it is used in place of the previous one. This function should be synchronous and if
     *   you want to provide custom shape, it has to be synchronous.
     * @param layer {RenderableLayer} Layer to use for adding all the parsed shapes. It is optional. It is possible to
     *   use this class as only a parser by providing custom parser completion callback.
     */
    Wkt.prototype.load = function (parserCompletionCallback, shapeConfigurationCallback, layer) {
        if(layer) {
            this._layer = layer;
        }

        if (parserCompletionCallback) {
            this._parserCompletionCallback = parserCompletionCallback;
        }

        if (shapeConfigurationCallback) {
            this._shapeConfigurationCallback = shapeConfigurationCallback;
        }

        this.parserCompletionCallback(
            this,
            new WktTokens(this.textRepresentation).objects()
        );
    };

    /**
     * It is the default implementation of the shape configuration callback. It is called for every generated shape.
     * @param shape {Renderable} It is a renderable for which you can provide custom attributes.
     * @returns {Object} This object can contain attributes to be used for the shape, highlight attributes to be used
     *   for the shape, pickDelegate to be used and userProperties. All these properties are applied to the shape.
     */
    Wkt.prototype.defaultShapeConfigurationCallback = function(shape) {
        // The default implementation doesn't change the defaults for the Shapes.
    };

    /**
     * It is the default implementation of the parser completion callback. It is called with all parsed objects and
     * the default one then calls shape configuration callback for each of them and then add the shapes into
     * the provided layer if such is provided.
     * @param objects {WktObject[]} Array of the Renderables to be displayed. This is the last time to modify them.
     * @param wkt {Wkt} Object representing the Wkt. It is used to retrieve layer, shape configuration callback.
     */
    Wkt.prototype.defaultParserCompletionCallback = function(wkt, objects) {
        // The default implementation doesn't change the defaults for the Shapes.
        var shapeConfigurationCallback = wkt.shapeConfigurationCallback;
        var shapes = [];
        objects.forEach(function(object){
            object.shapes().forEach(function(shape){
                var configuration = shapeConfigurationCallback(object);
                if(configuration && configuration.attributes) {
                    shape.attributes = configuration.attributes;
                }
                if(configuration && configuration.highlightAttributes) {
                    shape.highlightAttributes = configuration.highlightAttributes;
                }
                if(configuration && configuration.pickDelegate) {
                    shape.pickDelegate = configuration.pickDelegate;
                }
                if(configuration && configuration.userProperties) {
                    shape.userProperties = configuration.userProperties;
                }
                shapes.push(shape);
            });
        });

        if(wkt.layer) {
            wkt.layer.addRenderables(shapes);
        }
    };

    export default Wkt;
