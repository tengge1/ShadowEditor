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
 * @exports AtmosphereLayer
 */
import GroundProgram from '../shaders/GroundProgram';
import Layer from '../layer/Layer';
import Matrix3 from '../geom/Matrix3';
import Sector from '../geom/Sector';
import SkyProgram from '../shaders/SkyProgram';
import SunPosition from '../util/SunPosition';
import Vec3 from '../geom/Vec3';
import WWUtil from '../util/WWUtil';


/**
 * Constructs a layer showing the Earth's atmosphere.
 * @alias AtmosphereLayer
 * @constructor
 * @classdesc Provides a layer showing the Earth's atmosphere.
 * @param {URL} nightImageSource optional url for the night texture.
 * @augments Layer
 */
function AtmosphereLayer(nightImageSource) {
    Layer.call(this, "Atmosphere");

    // The atmosphere layer is not pickable.
    this.pickEnabled = false;

    //Documented in defineProperties below.
    this._nightImageSource = nightImageSource ||
        WorldWind.configuration.baseUrl + 'images/dnb_land_ocean_ice_2012.png';

    //Internal use only.
    //The light direction in cartesian space, computed from the layer time or defaults to the eyePoint.
    this._activeLightDirection = new Vec3(0, 0, 0);

    this._fullSphereSector = Sector.FULL_SPHERE;

    //Internal use only. Intentionally not documented.
    this._skyData = {};

    //Internal use only. The number of longitudinal points in the grid for the sky geometry.
    this._skyWidth = 128;

    //Internal use only. The number of latitudinal points in the grid for the sky geometry.
    this._skyHeight = 128;

    //Internal use only. Number of indices for the sky geometry.
    this._numIndices = 0;

    //Internal use only. Texture coordinate matrix used for the night texture.
    this._texMatrix = Matrix3.fromIdentity();

    //Internal use only. The night texture.
    this._activeTexture = null;
}

AtmosphereLayer.prototype = Object.create(Layer.prototype);

Object.defineProperties(AtmosphereLayer.prototype, {

    /**
     * Url for the night texture.
     * @memberof AtmosphereLayer.prototype
     * @type {URL}
     */
    nightImageSource: {
        get: function () {
            return this._nightImageSource;
        },
        set: function (value) {
            this._nightImageSource = value;
        }
    }

});

// Documented in superclass.
AtmosphereLayer.prototype.doRender = function (dc) {
    if (dc.globe.is2D()) {
        return;
    }

    this.determineLightDirection(dc);
    this.drawSky(dc);
    this.drawGround(dc);
};

// Internal. Intentionally not documented.
AtmosphereLayer.prototype.applySkyVertices = function (dc) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram,
        skyData = this._skyData,
        skyPoints, vboId;

    if (!skyData.verticesVboCacheKey) {
        skyData.verticesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
    }

    vboId = dc.gpuResourceCache.resourceForKey(skyData.verticesVboCacheKey);

    if (!vboId) {
        skyPoints = this.assembleVertexPoints(dc, this._skyHeight, this._skyWidth, program.getAltitude());

        vboId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
        gl.bufferData(gl.ARRAY_BUFFER, skyPoints, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        dc.gpuResourceCache.putResource(skyData.verticesVboCacheKey, vboId,
            skyPoints.length * 4);
        dc.frameStatistics.incrementVboLoadCount(1);
    }
    else {
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    }

};

// Internal. Intentionally not documented.
AtmosphereLayer.prototype.applySkyIndices = function (dc) {
    var gl = dc.currentGlContext,
        skyData = this._skyData,
        skyIndices, vboId;

    if (!skyData.indicesVboCacheKey) {
        skyData.indicesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
    }

    vboId = dc.gpuResourceCache.resourceForKey(skyData.indicesVboCacheKey);

    if (!vboId) {
        skyIndices = this.assembleTriStripIndices(this._skyWidth, this._skyHeight);

        vboId = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboId);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, skyIndices, gl.STATIC_DRAW);

        dc.frameStatistics.incrementVboLoadCount(1);
        dc.gpuResourceCache.putResource(skyData.indicesVboCacheKey, vboId, skyIndices.length * 2);
    }
    else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboId);
    }

};

// Internal. Intentionally not documented.
AtmosphereLayer.prototype.drawSky = function (dc) {
    var gl = dc.currentGlContext,
        program = dc.findAndBindProgram(SkyProgram);

    program.loadGlobeRadius(gl, dc.globe.equatorialRadius);

    program.loadEyePoint(gl, dc.eyePoint);

    program.loadVertexOrigin(gl, Vec3.ZERO);

    program.loadModelviewProjection(gl, dc.modelviewProjection);

    program.loadLightDirection(gl, this._activeLightDirection);

    program.setScale(gl);

    this.applySkyVertices(dc);
    this.applySkyIndices(dc);

    gl.depthMask(false);
    gl.frontFace(gl.CW);
    gl.enableVertexAttribArray(0);
    gl.drawElements(gl.TRIANGLE_STRIP, this._numIndices, gl.UNSIGNED_SHORT, 0);

    gl.depthMask(true);
    gl.frontFace(gl.CCW);
    gl.disableVertexAttribArray(0);
};

// Internal. Intentionally not documented.
AtmosphereLayer.prototype.drawGround = function (dc) {
    var gl = dc.currentGlContext,
        program = dc.findAndBindProgram(GroundProgram),
        terrain = dc.terrain,
        textureBound;

    program.loadGlobeRadius(gl, dc.globe.equatorialRadius);

    program.loadEyePoint(gl, dc.eyePoint);

    program.loadLightDirection(gl, this._activeLightDirection);

    program.setScale(gl);

    // Use this layer's night image when the layer has time value defined
    if (this.nightImageSource && this.time !== null) {

        this._activeTexture = dc.gpuResourceCache.resourceForKey(this.nightImageSource);

        if (!this._activeTexture) {
            this._activeTexture = dc.gpuResourceCache.retrieveTexture(gl, this.nightImageSource);
        }

        textureBound = this._activeTexture && this._activeTexture.bind(dc);
    }

    terrain.beginRendering(dc);

    for (var idx = 0, len = terrain.surfaceGeometry.length; idx < len; idx++) {
        var currentTile = terrain.surfaceGeometry[idx];

        // Use the vertex origin for the terrain tile.
        var terrainOrigin = currentTile.referencePoint;
        program.loadVertexOrigin(gl, terrainOrigin);

        // Use a tex coord matrix that registers the night texture correctly on each terrain.
        if (textureBound) {
            this._texMatrix.setToUnitYFlip();
            this._texMatrix.multiplyByTileTransform(currentTile.sector, this._fullSphereSector);
            program.loadTexMatrix(gl, this._texMatrix);
        }

        terrain.beginRenderingTile(dc, currentTile);

        // Draw the tile, multiplying the current fragment color by the program's secondary color.
        program.loadFragMode(gl, program.FRAGMODE_GROUND_SECONDARY);
        gl.blendFunc(gl.DST_COLOR, gl.ZERO);
        terrain.renderTile(dc, currentTile);

        // Draw the terrain as triangles, adding the current fragment color to the program's primary color.
        var fragMode = textureBound ?
            program.FRAGMODE_GROUND_PRIMARY_TEX_BLEND : program.FRAGMODE_GROUND_PRIMARY;
        program.loadFragMode(gl, fragMode);
        gl.blendFunc(gl.ONE, gl.ONE);
        terrain.renderTile(dc, currentTile);

        terrain.endRenderingTile(dc, currentTile);
    }

    // Restore the default WorldWind OpenGL state.
    terrain.endRendering(dc);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // Clear references to Gpu resources.
    this._activeTexture = null;
};

// Internal. Intentionally not documented.
AtmosphereLayer.prototype.assembleVertexPoints = function (dc, numLat, numLon, altitude) {
    var count = numLat * numLon;
    var altitudes = new Array(count);
    WWUtil.fillArray(altitudes, altitude);
    var result = new Float32Array(count * 3);

    return dc.globe.computePointsForGrid(this._fullSphereSector, numLat, numLon, altitudes, Vec3.ZERO, result);
};

// Internal. Intentionally not documented.
AtmosphereLayer.prototype.assembleTriStripIndices = function (numLat, numLon) {
    var result = [];
    var vertex = 0;

    for (var latIndex = 0; latIndex < numLat - 1; latIndex++) {
        // Create a triangle strip joining each adjacent column of vertices, starting in the bottom left corner and
        // proceeding to the right. The first vertex starts with the left row of vertices and moves right to create
        // a counterclockwise winding order.
        for (var lonIndex = 0; lonIndex < numLon; lonIndex++) {
            vertex = lonIndex + latIndex * numLon;
            result.push(vertex + numLon);
            result.push(vertex);
        }

        // Insert indices to create 2 degenerate triangles:
        // - one for the end of the current row, and
        // - one for the beginning of the next row
        if (latIndex < numLat - 2) {
            result.push(vertex);
            result.push((latIndex + 2) * numLon);
        }
    }

    this._numIndices = result.length;

    return new Uint16Array(result);
};

// Internal. Intentionally not documented.
AtmosphereLayer.prototype.determineLightDirection = function (dc) {
    if (this.time !== null) {
        var sunLocation = SunPosition.getAsGeographicLocation(this.time);
        dc.globe.computePointFromLocation(sunLocation.latitude, sunLocation.longitude,
            this._activeLightDirection);
    } else {
        this._activeLightDirection.copy(dc.eyePoint);
    }
    this._activeLightDirection.normalize();
};

export default AtmosphereLayer;
