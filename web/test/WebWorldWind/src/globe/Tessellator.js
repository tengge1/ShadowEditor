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
 * @exports Tessellator
 */
import Angle from '../geom/Angle';
import BasicProgram from '../shaders/BasicProgram';
import LevelSet from '../util/LevelSet';
import Location from '../geom/Location';
import MemoryCache from '../cache/MemoryCache';
import Sector from '../geom/Sector';
import Terrain from '../globe/Terrain';
import TerrainTile from '../globe/TerrainTile';
import TerrainTileList from '../globe/TerrainTileList';
import Tile from '../util/Tile';
import WWMath from '../util/WWMath';
import WWUtil from '../util/WWUtil';


/**
 * Constructs a Tessellator.
 * @alias Tessellator
 * @constructor
 * @classdesc Provides terrain tessellation for a globe.
 */
function Tessellator() {
    // Parameterize top level subdivision in one place.

    // TilesInTopLevel describes the most coarse tile structure.
    this.numRowsTilesInTopLevel = 2; // baseline: 4
    this.numColumnsTilesInTopLevel = 2; // baseline: 8

    // The maximum number of levels that will ever be tessellated.
    this.maximumSubdivisionDepth = 16; // baseline: 15

    // tileWidth, tileHeight - the number of subdivisions a single tile has; this determines the sampling grid.
    this.tileWidth = 256; // baseline: 32
    this.tileHeight = 256; // baseline: 32

    /**
     * Controls the level of detail switching for this layer. The next highest resolution level is
     * used when an elevation tile's cell size is greater than this number of pixels, up to the maximum
     * resolution of the elevation model.
     * @type {Number}
     * @default 1.75
     */
    this.detailControl = 8.0;

    this.levels = new LevelSet(
        Sector.FULL_SPHERE,
        new Location(
            360 / this.numRowsTilesInTopLevel,
            360 / this.numColumnsTilesInTopLevel),
        this.maximumSubdivisionDepth,
        this.tileWidth,
        this.tileHeight);

    this.topLevelTiles = {};
    this.currentTiles = new TerrainTileList(this);

    this.tileCache = new MemoryCache(5000000, 4000000); // Holds 316 32x32 tiles.

    this.elevationTimestamp = undefined;
    this.lastModelViewProjection = new THREE.Matrix4();

    this.vertexPointLocation = -1;
    this.vertexTexCoordLocation = -1;

    this.texCoords = null;
    this.texCoordVboCacheKey = 'global_tex_coords';

    this.indices = null;
    this.indicesVboCacheKey = 'global_indices';

    this.baseIndices = null;
    this.baseIndicesOffset = null;
    this.numBaseIndices = null;

    this.indicesNorth = null;
    this.indicesNorthOffset = null;
    this.numIndicesNorth = null;

    this.indicesSouth = null;
    this.indicesSouthOffset = null;
    this.numIndicesSouth = null;

    this.indicesWest = null;
    this.indicesWestOffset = null;
    this.numIndicesWest = null;

    this.indicesEast = null;
    this.indicesEastOffset = null;
    this.numIndicesEast = null;

    this.indicesLoresNorth = null;
    this.indicesLoresNorthOffset = null;
    this.numIndicesLoresNorth = null;

    this.indicesLoresSouth = null;
    this.indicesLoresSouthOffset = null;
    this.numIndicesLoresSouth = null;

    this.indicesLoresWest = null;
    this.indicesLoresWestOffset = null;
    this.numIndicesLoresWest = null;

    this.indicesLoresEast = null;
    this.indicesLoresEastOffset = null;
    this.numIndicesLoresEast = null;

    this.outlineIndicesOffset = null;
    this.numOutlineIndices = null;

    this.wireframeIndicesOffset = null;
    this.numWireframeIndices = null;

    this.scratchMatrix = new THREE.Matrix4();
    this.scratchElevations = null;
    this.scratchPrevElevations = null;

    this.corners = {};
    this.tiles = [];
}

/**
 * Creates the visible terrain of the globe associated with the current draw context.
 * @param {DrawContext} dc The draw context.
 * @returns {Terrain} The computed terrain, or null if terrain could not be computed.
 */
Tessellator.prototype.tessellate = function (dc) {
    var lastElevationsChange = dc.globe.elevationTimestamp();
    if (this.lastGlobeStateKey === dc.globeStateKey
        && this.lastVerticalExaggeration === dc.verticalExaggeration
        && this.elevationTimestamp === lastElevationsChange
        && dc.modelviewProjection.equals(this.lastModelViewProjection)) {

        return this.lastTerrain;
    }

    this.lastModelViewProjection.copy(dc.modelviewProjection);
    this.lastGlobeStateKey = dc.globeStateKey;
    this.elevationTimestamp = lastElevationsChange;
    this.lastVerticalExaggeration = dc.verticalExaggeration;

    this.currentTiles.removeAllTiles();

    if (!this.topLevelTiles[dc.globeStateKey] || this.topLevelTiles[dc.globeStateKey].length == 0) {
        this.createTopLevelTiles(dc);
    }

    this.corners = {};
    this.tiles = [];

    for (var index = 0, len = this.topLevelTiles[dc.globeStateKey].length; index < len; index += 1) {
        var tile = this.topLevelTiles[dc.globeStateKey][index];

        tile.update(dc);

        if (this.isTileVisible(dc, tile)) {
            this.addTileOrDescendants(dc, tile);
        }
    }
    this.finishTessellating(dc);

    this.lastTerrain = this.currentTiles.length === 0 ? null
        : new Terrain(dc.globe, this, this.currentTiles, dc.verticalExaggeration);

    return this.lastTerrain;
};

Tessellator.prototype.createTile = function (tileSector, level, row, column) {
    return new TerrainTile(tileSector, level, row, column);
};

/**
 * Initializes rendering state to draw a succession of terrain tiles.
 * @param {DrawContext} dc The draw context.
 */
Tessellator.prototype.beginRendering = function (dc) {
    var program = dc.currentProgram; // use the current program; the caller configures other program state
    if (!program) {
        console.info("Tessellator", "beginRendering", "Current Program is empty");
        return;
    }

    this.buildSharedGeometry();
    this.cacheSharedGeometryVBOs(dc);

    var gl = dc.currentGlContext,
        gpuResourceCache = dc.gpuResourceCache;

    // Keep track of the program's attribute locations. The tessellator does not know which program the caller has
    // bound, and therefore must look up the location of attributes by name.
    this.vertexPointLocation = program.attributeLocation(gl, "vertexPoint");
    this.vertexTexCoordLocation = program.attributeLocation(gl, "vertexTexCoord");
    gl.enableVertexAttribArray(this.vertexPointLocation);

    if (this.vertexTexCoordLocation >= 0) { // location of vertexTexCoord attribute is -1 when the basic program is bound
        var texCoordVbo = gpuResourceCache.resourceForKey(this.texCoordVboCacheKey);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordVbo);
        gl.vertexAttribPointer(this.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertexTexCoordLocation);
    }

    var indicesVbo = gpuResourceCache.resourceForKey(this.indicesVboCacheKey);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesVbo);

};

/**
 * Restores rendering state after drawing a succession of terrain tiles.
 * @param {DrawContext} dc The draw context.
 */
Tessellator.prototype.endRendering = function (dc) {
    var gl = dc.currentGlContext;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Restore the global OpenGL vertex attribute array state.
    if (this.vertexPointLocation >= 0) {
        gl.disableVertexAttribArray(this.vertexPointLocation);
    }

    if (this.vertexTexCoordLocation >= 0) { // location of vertexTexCoord attribute is -1 when the basic program is bound
        gl.disableVertexAttribArray(this.vertexTexCoordLocation);
    }
};

/**
 * Initializes rendering state for drawing a specified terrain tile.
 * @param {DrawContext} dc The draw context.
 * @param {TerrainTile} terrainTile The terrain tile subsequently drawn via this tessellator's render function.
 */
Tessellator.prototype.beginRenderingTile = function (dc, terrainTile) {
    var gl = dc.currentGlContext,
        gpuResourceCache = dc.gpuResourceCache;

    this.scratchMatrix.multiplyMatrices(dc.modelviewProjection, terrainTile.transformationMatrix);
    dc.currentProgram.loadModelviewProjection(gl, this.scratchMatrix);

    var vboCacheKey = dc.globeStateKey + terrainTile.tileKey,
        vbo = gpuResourceCache.resourceForKey(vboCacheKey);
    if (!vbo) {
        vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, terrainTile.points, gl.STATIC_DRAW);
        gpuResourceCache.putResource(vboCacheKey, vbo, terrainTile.points.length * 4);
        terrainTile.pointsVboStateKey = terrainTile.pointsStateKey;
    }
    else if (terrainTile.pointsVboStateKey != terrainTile.pointsStateKey) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, terrainTile.points);
        terrainTile.pointsVboStateKey = terrainTile.pointsStateKey;
    }
    else {
        dc.currentGlContext.bindBuffer(gl.ARRAY_BUFFER, vbo);
    }

    dc.currentProgram.setColumn(gl, terrainTile.column);
    dc.currentProgram.setRow(gl, terrainTile.row);
    dc.currentProgram.setLevel(gl, terrainTile.level.levelNumber);

    gl.vertexAttribPointer(this.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
};

/**
 * Restores rendering state after drawing the most recent tile specified to
 * [beginRenderingTile]{@link Tessellator#beginRenderingTile}.
 * @param {DrawContext} dc The draw context.
 * @param {TerrainTile} terrainTile The terrain tile most recently rendered.
 */
Tessellator.prototype.endRenderingTile = function (dc, terrainTile) {
    // Intentionally empty until there's some reason to add code here.
};

/**
 * Renders a specified terrain tile.
 * @param {DrawContext} dc The draw context.
 * @param {TerrainTile} terrainTile The terrain tile to render.
 */
Tessellator.prototype.renderTile = function (dc, terrainTile) {
    var gl = dc.currentGlContext,
        prim = gl.TRIANGLE_STRIP; // replace TRIANGLE_STRIP with LINE_STRIP to debug borders

    var heightmap = dc.globe.elevationModel.coverages[0].imageCache.get(
        terrainTile.level.levelNumber,
        terrainTile.row,
        terrainTile.column
    );
    if (heightmap) {
        if(!heightmap.texture) {
            gl.activeTexture(gl.TEXTURE1);
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, heightmap.imageWidth, 
                heightmap.imageHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, heightmap.imgData);
            heightmap.texture = texture;
        }
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, heightmap.texture);
        gl.activeTexture(gl.TEXTURE0);
    }
    
    gl.drawElements(
        prim,
        this.numBaseIndices,
        gl.UNSIGNED_SHORT,
        this.baseIndicesOffset * 2);
};

/***********************************************************************
 * Internal methods - assume that arguments have been validated already.
 ***********************************************************************/

Tessellator.prototype.createTopLevelTiles = function (dc) {
    this.topLevelTiles[dc.globeStateKey] = [];
    Tile.createTilesForLevel(this.levels.firstLevel(), this, this.topLevelTiles[dc.globeStateKey]);
};

Tessellator.prototype.addTileOrDescendants = function (dc, tile) {
    if (this.tileMeetsRenderCriteria(dc, tile)) {
        this.addTile(dc, tile);
        return;
    }

    this.addTileDescendants(dc, tile);
};

Tessellator.prototype.addTileDescendants = function (dc, tile) {
    var nextLevel = tile.level.nextLevel();
    var subTiles = tile.subdivideToCache(nextLevel, this, this.tileCache);
    for (var index = 0; index < subTiles.length; index += 1) {
        var child = subTiles[index];

        child.update(dc);

        if (this.levels.sector.intersects(child.sector) && this.isTileVisible(dc, child)) {
            this.addTileOrDescendants(dc, child);
        }
    }
};

Tessellator.prototype.addTile = function (dc, tile) {
    // Insert tile at index idx.
    var idx = this.tiles.length;
    this.tiles.push(tile);

    // Insert tile into corner data collection for later LOD neighbor analysis.
    var sector = tile.sector;

    // Corners of the tile.
    var neTileCorner = [sector.maxLatitude, sector.maxLongitude].toString(),
        seTileCorner = [sector.minLatitude, sector.maxLongitude].toString(),
        nwTileCorner = [sector.maxLatitude, sector.minLongitude].toString(),
        swTileCorner = [sector.minLatitude, sector.minLongitude].toString(),
        corner;

    corner = this.corners[swTileCorner];
    if (!corner) {
        this.corners[swTileCorner] = { 'sw': idx }; //corner;
    }
    else {
        // assert(!corner.sw, "sw already defined");
        corner.sw = idx;
    }

    corner = this.corners[nwTileCorner];
    if (!corner) {
        this.corners[nwTileCorner] = { 'nw': idx };
    }
    else {
        // assert(!corner.nw, "nw already defined");
        corner.nw = idx;
    }

    corner = this.corners[seTileCorner];
    if (!corner) {
        this.corners[seTileCorner] = { 'se': idx };
    }
    else {
        // assert(!corver.se, "se already defined");
        corner.se = idx;
    }

    corner = this.corners[neTileCorner];
    if (!corner) {
        this.corners[neTileCorner] = { 'ne': idx };
    }
    else {
        //assert(!corner.ne, "ne already defined");
        corner.ne = idx;
    }
};

Tessellator.prototype.finishTessellating = function (dc) {
    for (var idx = 0, len = this.tiles.length; idx < len; idx += 1) {
        var tile = this.tiles[idx];
        this.regenerateTileGeometryIfNeeded(dc, tile);
        this.currentTiles.addTile(tile);
    }
};

Tessellator.prototype.isTileVisible = function (dc, tile) {
    if (dc.globe.projectionLimits && !tile.sector.overlaps(dc.globe.projectionLimits)) {
        return false;
    }
    return dc.frustumInModelCoordinates.intersectsBox(tile.extent);
};

Tessellator.prototype.tileMeetsRenderCriteria = function (dc, tile) {
    var s = this.detailControl;
    var lat = WWMath.mercatorLat(75);
    if (tile.sector.minLatitude >= lat || tile.sector.maxLatitude <= -lat) {
        s *= 2;
    }
    return tile.level.isLastLevel() || !tile.mustSubdivide(dc, s);
};

Tessellator.prototype.regenerateTileGeometryIfNeeded = function (dc, tile) {
    var stateKey = dc.globeStateKey + tile.stateKey + dc.verticalExaggeration;

    if (!tile.points || tile.pointsStateKey != stateKey) {
        this.regenerateTileGeometry(dc, tile);
        tile.pointsStateKey = stateKey;
    }
};

/**
 * Internal use only.
 * TODO: Remove this function when Tessellator and ElevationModel are refactored
 * Artificially calculates an adjusted target resolution for the given texel size to more
 * optimally select elevation coverages until later refactoring.
 * @returns {Number} An adjusted target resolution in degrees.
 * @ignore
 */
Tessellator.prototype.coverageTargetResolution = function (texelSize) {
    return texelSize * Angle.RADIANS_TO_DEGREES;
};

Tessellator.prototype.regenerateTileGeometry = function (dc, tile) {
    var numLat = tile.tileHeight + 1, // num points in each dimension is 1 more than the number of tile cells
        numLon = tile.tileWidth + 1,
        refPoint = tile.referencePoint,
        elevations = this.scratchElevations;

    // Allocate space for the tile's elevations.
    if (!elevations) {
        elevations = new Float64Array(numLat * numLon);
        this.scratchElevations = elevations;
    }

    // Allocate space for the tile's Cartesian coordinates.
    if (!tile.points) {
        tile.points = new Float32Array(numLat * numLon * 3);
    }

    // Retrieve the elevations for all points in the tile.
    WWUtil.fillArray(elevations, 0);

    dc.globe.elevationsForGrid(tile.sector, numLat, numLon, this.coverageTargetResolution(tile.texelSize), elevations);

    // Compute the tile's Cartesian coordinates relative to a local origin, called the reference point.
    WWUtil.multiplyArray(elevations, dc.verticalExaggeration);
    dc.globe.computePointsForGrid(tile.sector, numLat, numLon, elevations, refPoint, tile.points);

    // Establish a transform that is used later to move the tile coordinates into place relative to the globe.
    tile.transformationMatrix.makeTranslation(refPoint.x, refPoint.y, refPoint.z);
};

Tessellator.prototype.buildSharedGeometry = function () {
    // TODO: put all indices into a single buffer
    var tileWidth = this.levels.tileWidth,
        tileHeight = this.levels.tileHeight;

    if (!this.texCoords) {
        this.buildTexCoords(tileWidth, tileHeight);
    }

    if (!this.indices) {
        this.buildIndices(tileWidth, tileHeight);
    }
};

Tessellator.prototype.buildTexCoords = function (tileWidth, tileHeight) {
    var numCols = tileWidth + 1,
        numRows = tileHeight + 1,
        colDelta = 1 / tileWidth,
        rowDelta = 1 / tileHeight,
        buffer = new Float32Array(numCols * numRows * 2),
        index = 0;

    for (var row = 0, t = 0; row < numRows; row++, t += rowDelta) {
        if (row == numRows - 1) {
            t = 1; // explicitly set the last row coordinate to ensure alignment
        }

        for (var col = 0, s = 0; col < numCols; col++, s += colDelta) {
            if (col == numCols - 1) {
                s = 1; // explicitly set the last column coordinate to ensure alignment
            }

            buffer[index++] = s;
            buffer[index++] = t;
        }
    }

    this.texCoords = buffer;
};

Tessellator.prototype.buildIndices = function (tileWidth, tileHeight) {
    var vertexIndex; // The index of the vertex in the sample grid.

    // The number of vertices in each dimension is 1 more than the number of cells.
    var numLatVertices = tileHeight + 1,
        numLonVertices = tileWidth + 1,
        latIndexMid = tileHeight / 2,   // Assumption: tileHeight is even, so that there is a midpoint!
        lonIndexMid = tileWidth / 2;    // Assumption: tileWidth is even, so that there is a midpoint!

    // Each vertex has two indices associated with it: the current vertex index and the index of the row.
    // There are tileHeight rows.
    // There are tileHeight + 2 columns
    var numIndices = 2 * (numLatVertices - 3) * (numLonVertices - 2) + 2 * (numLatVertices - 3);
    var indices = [];

    // Inset core by one round of sub-tiles. Full grid is numLatVertices x numLonVertices. This must be used
    // to address vertices in the core as well.
    var index = 0;
    for (var lonIndex = 1; lonIndex < numLonVertices - 2; lonIndex += 1) {
        for (var latIndex = 1; latIndex < numLatVertices - 1; latIndex += 1) {
            vertexIndex = lonIndex + latIndex * numLonVertices;

            // Create a triangle strip joining each adjacent column of vertices, starting in the top left corner and
            // proceeding to the right. The first vertex starts with the left row of vertices and moves right to create a
            // counterclockwise winding order.
            indices[index++] = vertexIndex;
            indices[index++] = vertexIndex + 1;
        }

        // Insert indices to create 2 degenerate triangles:
        //      one for the end of the current row, and
        //      one for the beginning of the next row.
        indices[index++] = vertexIndex + 1;
        vertexIndex = lonIndex + 1 + 1 * numLonVertices;
        indices[index++] = vertexIndex;
    }

    this.baseIndicesOffset = indices.length - numIndices;
    this.baseIndices = new Uint16Array(indices.slice(this.baseIndicesOffset));
    this.numBaseIndices = numIndices;

    // TODO: parameterize and refactor!!!!!
    // Software engineering notes: There are patterns being used in the following code that should be abstracted.
    // However, I suspect that the process of abstracting the patterns will result in as much code created
    // as gets removed. YMMV. If JavaScript had a meta-programming (a.k.a., macro) facility, that code would be
    // processed at "compile" time rather than "runtime". But it doesn't have such a facility that I know of.
    //
    // Patterns used:
    //  0) Each tile has four borders: north, south, east, and west.
    //  1) Counter-clockwise traversal around the outside results in clockwise meshes amendable to back-face elimination.
    //  2) For each vertex on the exterior, there corresponds a vertex on the interior that creates a diagonal.
    //  3) Each border construction is broken into three phases:
    //      a) The starting phase to generate the first half of the border,
    //      b) The middle phase, where a single vertex reference gets created, and
    //      c) The ending phase to complete the generation of the border.
    //  4) Each border is generated in two variants:
    //      a) one variant that mates with a tile at the same level of detail, and
    //      b) another variant that mates with a tile at the next lower level of detail.
    //  5) Borders that mate with the next lower level of detail are constrained to lie on even indices.
    //  6) Evenness is generated by ANDing the index with a mask that has 1's in all bits except for the LSB,
    //      which results in clearing the LSB os the index, making it even.
    //  7) The section that generates lower level LOD borders gives up any attempt to be optimal because of the
    //      complexity. Instead, correctness was preferred. That said, any performance lost is in the noise,
    //      since this code only gets run once.

    /*
     *  The following section of code generates full resolution boundary meshes. These are used to mate
     *  with neighboring tiles that are at the same level of detail.
     */
    // North border.
    numIndices = 2 * numLonVertices - 2;
    latIndex = numLatVertices - 1;

    // Corner vertex.
    lonIndex = numLonVertices - 1;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    for (lonIndex = numLonVertices - 2; lonIndex > 0; lonIndex -= 1) {
        vertexIndex = lonIndex + latIndex * numLonVertices;
        indices[index++] = vertexIndex;
        indices[index++] = vertexIndex - numLonVertices;
    }

    // Corner vertex.
    lonIndex = 0;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    this.indicesNorthOffset = indices.length - numIndices;
    this.indicesNorth = new Uint16Array(indices.slice(this.indicesNorthOffset));
    this.numIndicesNorth = numIndices;

    // South border.
    numIndices = 2 * numLonVertices - 2;
    latIndex = 0;

    // Corner vertex.
    lonIndex = 0;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    for (lonIndex = 1; lonIndex < numLonVertices - 1; lonIndex += 1) {
        vertexIndex = lonIndex + latIndex * numLonVertices;
        indices[index++] = vertexIndex;
        indices[index++] = vertexIndex + numLonVertices;
    }

    // Corner vertex.
    lonIndex = numLonVertices - 1;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    this.indicesSouthOffset = indices.length - numIndices;
    this.indicesSouth = new Uint16Array(indices.slice(this.indicesSouthOffset));
    this.numIndicesSouth = numIndices;

    // West border.
    numIndices = 2 * numLatVertices - 2;
    lonIndex = 0;

    // Corner vertex.
    latIndex = numLatVertices - 1;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    for (latIndex = numLatVertices - 2; latIndex > 0; latIndex -= 1) {
        vertexIndex = lonIndex + latIndex * numLonVertices;
        indices[index++] = vertexIndex;
        indices[index++] = vertexIndex + 1;
    }

    // Corner vertex.
    latIndex = 0;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    this.indicesWestOffset = indices.length - numIndices;
    this.indicesWest = new Uint16Array(indices.slice(this.indicesWestOffset));
    this.numIndicesWest = numIndices;

    // East border.
    numIndices = 2 * numLatVertices - 2;
    lonIndex = numLonVertices - 1;

    // Corner vertex.
    latIndex = 0;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    for (latIndex = 1; latIndex < numLatVertices - 1; latIndex += 1) {
        vertexIndex = lonIndex + latIndex * numLonVertices;
        indices[index++] = vertexIndex;
        indices[index++] = vertexIndex - 1;
    }

    // Corner vertex.
    latIndex = numLatVertices - 1;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    this.indicesEastOffset = indices.length - numIndices;
    this.indicesEast = new Uint16Array(indices.slice(this.indicesEastOffset));
    this.numIndicesEast = numIndices;

    /*
     *  The following section of code generates "lores" low resolution boundary meshes. These are used to mate
     *  with neighboring tiles that are at a lower level of detail. The property of these lower level meshes is that
     *  they have half the number of vertices.
     *
     *  To generate the boundary meshes, force the use of only even boundary vertex indices.
     */
    // North border.
    numIndices = 2 * numLonVertices - 2;
    latIndex = numLatVertices - 1;

    // Corner vertex.
    lonIndex = numLonVertices - 1;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    for (lonIndex = numLonVertices - 2; lonIndex > 0; lonIndex -= 1) {
        // Exterior vertex rounded up to even index.
        vertexIndex = (lonIndex + 1 & ~1) + latIndex * numLonVertices;
        indices[index++] = vertexIndex;

        // Interior vertex.
        vertexIndex = lonIndex + (latIndex - 1) * numLonVertices;
        indices[index++] = vertexIndex;
    }

    // Corner vertex.
    lonIndex = 0;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    this.indicesLoresNorthOffset = indices.length - numIndices;
    this.indicesLoresNorth = new Uint16Array(indices.slice(this.indicesLoresNorthOffset));
    this.numIndicesLoresNorth = numIndices;

    // South border.
    numIndices = 2 * numLonVertices - 2;
    latIndex = 0;

    // Corner vertex.
    lonIndex = 0;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    for (lonIndex = 1; lonIndex < numLonVertices - 1; lonIndex += 1) {
        // Exterior Vertex rounded down to even index.
        vertexIndex = (lonIndex & ~1) + latIndex * numLonVertices;
        indices[index++] = vertexIndex;

        // Interior vertex.
        vertexIndex = lonIndex + (latIndex + 1) * numLonVertices;
        indices[index++] = vertexIndex;
    }

    // Corner vertex.
    lonIndex = numLonVertices - 1;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    this.indicesLoresSouthOffset = indices.length - numIndices;
    this.indicesLoresSouth = new Uint16Array(indices.slice(this.indicesLoresSouthOffset));
    this.numIndicesLoresSouth = numIndices;

    // West border.
    numIndices = 2 * numLatVertices - 2;
    lonIndex = 0;

    // Corner vertex.
    latIndex = numLatVertices - 1;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    for (latIndex = numLatVertices - 2; latIndex > 0; latIndex -= 1) {
        // Exterior Vertex rounded up to even index.
        vertexIndex = lonIndex + (latIndex + 1 & ~1) * numLonVertices;
        indices[index++] = vertexIndex;

        // Interior vertex.
        vertexIndex = lonIndex + 1 + latIndex * numLonVertices;
        indices[index++] = vertexIndex;
    }

    // Corner vertex.
    latIndex = 0;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    this.indicesLoresWestOffset = indices.length - numIndices;
    this.indicesLoresWest = new Uint16Array(indices.slice(this.indicesLoresWestOffset));
    this.numIndicesLoresWest = numIndices;

    // East border.
    numIndices = 2 * numLatVertices - 2;
    lonIndex = numLonVertices - 1;

    // Corner vertex.
    latIndex = 0;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    for (latIndex = 1; latIndex < numLatVertices - 1; latIndex += 1) {
        // Exterior vertex rounded down to even index.
        vertexIndex = lonIndex + (latIndex & ~1) * numLonVertices;
        indices[index++] = vertexIndex;

        // Interior vertex.
        vertexIndex = lonIndex - 1 + latIndex * numLonVertices;
        indices[index++] = vertexIndex;
    }

    // Corner vertex.
    latIndex = numLatVertices - 1;
    vertexIndex = lonIndex + latIndex * numLonVertices;
    indices[index++] = vertexIndex;

    this.indicesLoresEastOffset = indices.length - numIndices;
    this.indicesLoresEast = new Uint16Array(indices.slice(this.indicesLoresEastOffset));
    this.numIndicesLoresEast = numIndices;

    this.indices = new Uint16Array(indices);
};

Tessellator.prototype.cacheSharedGeometryVBOs = function (dc) {
    var gl = dc.currentGlContext,
        gpuResourceCache = dc.gpuResourceCache;

    var texCoordVbo = gpuResourceCache.resourceForKey(this.texCoordVboCacheKey);
    if (!texCoordVbo) {
        texCoordVbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordVbo);
        gl.bufferData(gl.ARRAY_BUFFER, this.texCoords, gl.STATIC_DRAW);
        gpuResourceCache.putResource(this.texCoordVboCacheKey, texCoordVbo, this.texCoords.length * 4 / 2);
    }

    var indicesVbo = gpuResourceCache.resourceForKey(this.indicesVboCacheKey);
    if (!indicesVbo) {
        indicesVbo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesVbo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        gpuResourceCache.putResource(this.indicesVboCacheKey, indicesVbo, this.indices.length * 2);
    }
};

export default Tessellator;
