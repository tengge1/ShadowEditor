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
 * @exports OpenStreetMapImageLayer
 */
import Color from '../util/Color';
import Layer from '../layer/Layer';
import Logger from '../util/Logger';
import WmtsCapabilities from '../ogc/wmts/WmtsCapabilities';
import WmtsLayer from '../layer/WmtsLayer';
        

        /**
         * Constructs an Open Street Map layer.
         * @alias OpenStreetMapImageLayer
         * @constructor
         * @augments WmtsLayer
         * @classdesc Provides a layer that shows Open Street Map imagery.
         *
         * @param {String} displayName This layer's display name. "Open Street Map" if this parameter is
         * null or undefined.
         */
        var OpenStreetMapImageLayer = function (displayName) {

            Layer.call(this, this.displayName);

            this.displayName = displayName || "Open Street Map";

            this.layer = null;

            this.xhr = null;

            // TODO: Picking is enabled as a temporary measure for screen credit hyperlinks to work (see Layer.render)
            this.pickEnabled = true;
        };

        OpenStreetMapImageLayer.prototype = Object.create(Layer.prototype);

        OpenStreetMapImageLayer.prototype.doRender = function (dc) {

            this.configureLayer(dc);

            if (this.layer) {
                this.layer.opacity = this.opacity;
                this.layer.doRender(dc);
                this.inCurrentFrame = this.layer.inCurrentFrame;

                // Add a screen credit to attribute the data source to OSM and EOX
                // The pattern for this attribute is described in the WMTS Capabilities document and demonstrated at EOX
                // Maps site: http://maps.eox.at/
                if (this.inCurrentFrame) {
                    dc.screenCreditController.addCredit("OpenStreetMap ©", Color.DARK_GRAY);
                    dc.screenCreditController.addCredit("EOX.at ©", Color.DARK_GRAY);
                }
            }
        };

        OpenStreetMapImageLayer.prototype.configureLayer = function (dc) {
            if (!this.xhr) {
                var self = this;
                var canvas = dc.currentGlContext.canvas;
                this.xhr = new XMLHttpRequest();
                this.xhr.open("GET", "https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml", true);
                this.xhr.onreadystatechange = function () {
                    if (self.xhr.readyState === 4) {
                        if (self.xhr.status === 200) {
                            // Create a layer from the WMTS capabilities.
                            var wmtsCapabilities = new WmtsCapabilities(self.xhr.responseXML);
                            var wmtsLayerCapabilities = wmtsCapabilities.getLayer("osm");
                            var wmtsConfig = WmtsLayer.formLayerConfiguration(wmtsLayerCapabilities);
                            wmtsConfig.title = self.displayName;
                            self.layer = new WmtsLayer(wmtsConfig);
                            // Send an event to request a redraw.
                            var e = document.createEvent('Event');
                            e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                            canvas.dispatchEvent(e);
                        } else {
                            Logger.log(Logger.LEVEL_WARNING,
                                "OSM retrieval failed (" + xhr.statusText + "): " + url);
                        }
                    }
                };

                this.xhr.onerror = function () {
                    Logger.log(Logger.LEVEL_WARNING, "OSM retrieval failed: " + url);
                };

                this.xhr.ontimeout = function () {
                    Logger.log(Logger.LEVEL_WARNING, "OSM retrieval timed out: " + url);
                };

                this.xhr.send(null);
            }

        };

        export default OpenStreetMapImageLayer;
    
