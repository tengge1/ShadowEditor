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
 * @exports BMNGOneImageLayer
 */
import RenderableLayer from '../layer/RenderableLayer';
import Sector from '../geom/Sector';
import SurfaceImage from '../shapes/SurfaceImage';
import WWUtil from '../util/WWUtil';
        

        /**
         * Constructs a Blue Marble image layer that spans the entire globe.
         * @alias BMNGOneImageLayer
         * @constructor
         * @augments RenderableLayer
         * @classdesc Displays a Blue Marble image layer that spans the entire globe with a single image.
         */
        var BMNGOneImageLayer = function () {
            RenderableLayer.call(this, "Blue Marble Image");

            var surfaceImage = new SurfaceImage(Sector.FULL_SPHERE,
                WorldWind.configuration.baseUrl + "images/BMNG_world.topo.bathy.200405.3.2048x1024.jpg");

            this.addRenderable(surfaceImage);

            this.pickEnabled = false;
            this.minActiveAltitude = 3e6;
        };

        BMNGOneImageLayer.prototype = Object.create(RenderableLayer.prototype);

        export default BMNGOneImageLayer;
    