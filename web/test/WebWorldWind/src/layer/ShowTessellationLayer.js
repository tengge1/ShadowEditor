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
 * @exports ShowTessellationLayer
 */
import BasicProgram from '../shaders/BasicProgram';
import Layer from '../layer/Layer';
        

        /* INTENTIONALLY NOT DOCUMENTED. FOR DIAGNOSTIC USE ONLY.
         * Constructs a layer that displays a globe's tessellated geometry.
         * @alias ShowTessellationLayer
         * @constructor
         * @augments Layer
         * @classdesc Displays a globe's tessellated geometry.
         */
        var ShowTessellationLayer = function () {
            Layer.call(this, "Show Tessellation");

            /**
             * Indicates whether to display terrain geometry.
             * @type {Boolean}
             * @default true
             */
            this.enableTerrainGeometry = true;

            /**
             * Indicates whether to display terrain geometry extent.
             * @type {Boolean}
             * @default false
             */
            this.enableTerrainExtent = false;
        };

        ShowTessellationLayer.prototype = Object.create(Layer.prototype);

        ShowTessellationLayer.prototype.doRender = function (dc) {
            try {
                this.beginRendering(dc);

                if (this.enableTerrainGeometry) {
                    this.drawTerrainGeometry(dc);
                }

                if (this.enableTerrainExtent) {
                    this.drawTerrainExtent(dc);
                }
            } finally {
                this.endRendering(dc)
            }
        };

        ShowTessellationLayer.prototype.beginRendering = function (dc) {
            var gl = dc.currentGlContext;
            gl.depthMask(false); // Disable depth buffer writes. Diagnostics should not occlude any other objects.
        };

        ShowTessellationLayer.prototype.endRendering = function (dc) {
            var gl = dc.currentGlContext;
            gl.depthMask(true); // re-enable depth buffer writes that were disabled in beginRendering.
        };

        ShowTessellationLayer.prototype.drawTerrainGeometry = function (dc) {
            if (!dc.terrain || !dc.terrain.tessellator)
                return;

            var gl = dc.currentGlContext,
                terrain = dc.terrain,
                tessellator = terrain.tessellator,
                surfaceGeometry = terrain.surfaceGeometry,
                program,
                terrainTile;

            try {
                program = dc.findAndBindProgram(BasicProgram);
                tessellator.beginRendering(dc);

                for (var i = 0, len = surfaceGeometry.length; i < len; i++) {
                    terrainTile = surfaceGeometry[i];
                    tessellator.beginRenderingTile(dc, terrainTile);
                    program.loadColorComponents(gl, 1, 1, 1, 0.3);
                    tessellator.renderWireframeTile(dc, terrainTile);
                    program.loadColorComponents(gl, 1, 0, 0, 0.6);
                    tessellator.renderTileOutline(dc, terrainTile);
                    tessellator.endRenderingTile(dc, terrainTile);
                }

            } finally {
                tessellator.endRendering(dc);
            }
        };

        ShowTessellationLayer.prototype.drawTerrainExtent = function (dc) {
            var surfaceGeometry = dc.terrain.surfaceGeometry,
                terrainTile;

            for (var i = 0, len = surfaceGeometry.length; i < len; i++) {
                terrainTile = surfaceGeometry[i];
                terrainTile.extent.render(dc);
            }
        };

        export default ShowTessellationLayer;
    