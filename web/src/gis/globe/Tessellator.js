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
import ArgumentError from '../error/ArgumentError';
import BasicProgram from '../shaders/BasicProgram';
import LevelSet from '../util/LevelSet';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import MemoryCache from '../cache/MemoryCache';
import PickedObject from '../pick/PickedObject';
import Position from '../geom/Position';
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
    this.numRowsTilesInTopLevel = 4; // baseline: 4
    this.numColumnsTilesInTopLevel = 8; // baseline: 8

    // The maximum number of levels that will ever be tessellated.
    this.maximumSubdivisionDepth = 15; // baseline: 15

    // tileWidth, tileHeight - the number of subdivisions a single tile has; this determines the sampling grid.
    this.tileWidth = 32; // baseline: 32
    this.tileHeight = 32; // baseline: 32

    /**
     * Controls the level of detail switching for this layer. The next highest resolution level is
     * used when an elevation tile's cell size is greater than this number of pixels, up to the maximum
     * resolution of the elevation model.
     * @type {Number}
     * @default 1.75
     */
    this.detailControl = 40;

    this.levels = new LevelSet(
        Sector.FULL_SPHERE,
        new Location(
            180 / this.numRowsTilesInTopLevel,
            360 / this.numColumnsTilesInTopLevel),
        this.maximumSubdivisionDepth,
        this.tileWidth,
        this.tileHeight);

    this.topLevelTiles = {};
    this.currentTiles = new TerrainTileList(this);

    this.tileCache = new MemoryCache(5000000, 4000000); // Holds 316 32x32 tiles.

    this.elevationTimestamp = undefined;
    this.lastModelViewProjection = Matrix.fromIdentity();

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

    this.scratchMatrix = Matrix.fromIdentity();
    this.scratchElevations = null;
    this.scratchPrevElevations = null;

    this.corners = {};
    this.tiles = [];
}

/**
 * Creates the visible terrain of the globe associated with the current draw context.
 * @param {DrawContext} dc The draw context.
 * @returns {Terrain} The computed terrain, or null if terrain could not be computed.
 * @throws {ArgumentError} If the dc is null or undefined.
 */
Tessellator.prototype.tessellate = function (dc) {
    if (!dc) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tessellator", "tessellate", "missingDC"));
    }

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

    this.refineNeighbors(dc);
    this.finishTessellating(dc);

    this.lastTerrain = this.currentTiles.length === 0 ? null
        : new Terrain(dc.globe, this, this.currentTiles, dc.verticalExaggeration);

    return this.lastTerrain;
};

Tessellator.prototype.createTile = function (tileSector, level, row, column) {
    if (!tileSector) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "constructor", "missingSector"));
    }

    if (!level) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "constructor",
                "The specified level is null or undefined."));
    }

    if (row < 0 || column < 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "constructor",
                "The specified row or column is less than zero."));
    }

    return new TerrainTile(tileSector, level, row, column);
};

/**
 * Initializes rendering state to draw a succession of terrain tiles.
 * @param {DrawContext} dc The draw context.
 */
Tessellator.prototype.beginRendering = function (dc) {
    var program = dc.currentProgram; // use the current program; the caller configures other program state
    if (!program) {
        Logger.logMessage(Logger.LEVEL_INFO, "Tessellator", "beginRendering", "Current Program is empty");
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
 * @throws {ArgumentError} If the specified tile is null or undefined.
 */
Tessellator.prototype.beginRenderingTile = function (dc, terrainTile) {
    if (!terrainTile) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tessellator", "beginRenderingTile", "missingTile"));
    }

    var gl = dc.currentGlContext,
        gpuResourceCache = dc.gpuResourceCache;

    this.scratchMatrix.setToMultiply(dc.modelviewProjection, terrainTile.transformationMatrix);
    dc.currentProgram.loadModelviewProjection(gl, this.scratchMatrix);

    var vboCacheKey = dc.globeStateKey + terrainTile.tileKey,
        vbo = gpuResourceCache.resourceForKey(vboCacheKey);
    if (!vbo) {
        vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, terrainTile.points, gl.STATIC_DRAW);
        dc.frameStatistics.incrementVboLoadCount(1);
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

    gl.vertexAttribPointer(this.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
};

/**
 * Restores rendering state after drawing the most recent tile specified to
 * [beginRenderingTile]{@link Tessellator#beginRenderingTile}.
 * @param {DrawContext} dc The draw context.
 * @param {TerrainTile} terrainTile The terrain tile most recently rendered.
 * @throws {ArgumentError} If the specified tile is null or undefined.
 */
Tessellator.prototype.endRenderingTile = function (dc, terrainTile) {
    // Intentionally empty until there's some reason to add code here.
};

/**
 * Renders a specified terrain tile.
 * @param {DrawContext} dc The draw context.
 * @param {TerrainTile} terrainTile The terrain tile to render.
 * @throws {ArgumentError} If the specified tile is null or undefined.
 */
Tessellator.prototype.renderTile = function (dc, terrainTile) {
    if (!terrainTile) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tessellator", "renderTile", "missingTile"));
    }

    var gl = dc.currentGlContext,
        prim = gl.TRIANGLE_STRIP; // replace TRIANGLE_STRIP with LINE_STRIP to debug borders

    /*
     * Indices order in the buffer:
     *
     * base indices
     *
     * north border
     * south border
     * west border
     * east border
     *
     * north lores
     * south lores
     * west lores
     * east lores
     *
     * wireframe
     * outline
     */

    gl.drawElements(
        prim,
        this.numBaseIndices,
        gl.UNSIGNED_SHORT,
        this.baseIndicesOffset * 2);

    var level = terrainTile.level,
        neighborLevel;

    neighborLevel = terrainTile.neighborLevel(WorldWind.NORTH);
    if (neighborLevel && neighborLevel.compare(level) < 0) {
        gl.drawElements(
            prim,
            this.numIndicesLoresNorth,
            gl.UNSIGNED_SHORT,
            this.indicesLoresNorthOffset * 2);
    }
    else {
        gl.drawElements(
            prim,
            this.numIndicesNorth,
            gl.UNSIGNED_SHORT,
            this.indicesNorthOffset * 2);
    }

    neighborLevel = terrainTile.neighborLevel(WorldWind.SOUTH);
    if (neighborLevel && neighborLevel.compare(level) < 0) {
        gl.drawElements(
            prim,
            this.numIndicesLoresSouth,
            gl.UNSIGNED_SHORT,
            this.indicesLoresSouthOffset * 2);
    }
    else {
        gl.drawElements(
            prim,
            this.numIndicesSouth,
            gl.UNSIGNED_SHORT,
            this.indicesSouthOffset * 2);
    }

    neighborLevel = terrainTile.neighborLevel(WorldWind.WEST);
    if (neighborLevel && neighborLevel.compare(level) < 0) {
        gl.drawElements(
            prim,
            this.numIndicesLoresWest,
            gl.UNSIGNED_SHORT,
            this.indicesLoresWestOffset * 2);
    }
    else {
        gl.drawElements(
            prim,
            this.numIndicesWest,
            gl.UNSIGNED_SHORT,
            this.indicesWestOffset * 2);
    }

    neighborLevel = terrainTile.neighborLevel(WorldWind.EAST);
    if (neighborLevel && neighborLevel.compare(level) < 0) {
        gl.drawElements(
            prim,
            this.numIndicesLoresEast,
            gl.UNSIGNED_SHORT,
            this.indicesLoresEastOffset * 2);
    }
    else {
        gl.drawElements(
            prim,
            this.numIndicesEast,
            gl.UNSIGNED_SHORT,
            this.indicesEastOffset * 2);
    }
};

/**
 * Draws outlines of the triangles composing the tile.
 * @param {DrawContext} dc The current draw context.
 * @param {TerrainTile} terrainTile The tile to draw.
 * @throws {ArgumentError} If the specified tile is null or undefined.
 */
Tessellator.prototype.renderWireframeTile = function (dc, terrainTile) {
    if (!terrainTile) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tessellator", "renderWireframeTile", "missingTile"));
    }

    var gl = dc.currentGlContext;

    // Must turn off texture coordinates, which were turned on in beginRendering.
    if (this.vertexTexCoordLocation >= 0) {
        gl.disableVertexAttribArray(this.vertexTexCoordLocation);
    }

    gl.drawElements(
        gl.LINES,
        this.numWireframeIndices,
        gl.UNSIGNED_SHORT,
        this.wireframeIndicesOffset * 2);
};

/**
 * Draws the outer boundary of a specified terrain tile.
 * @param {DrawContext} dc The current draw context.
 * @param {TerrainTile} terrainTile The tile whose outer boundary to draw.
 * @throws {ArgumentError} If the specified tile is null or undefined.
 */
Tessellator.prototype.renderTileOutline = function (dc, terrainTile) {
    if (!terrainTile) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tessellator", "renderTileOutline", "missingTile"));
    }

    var gl = dc.currentGlContext;

    // Must turn off texture coordinates, which were turned on in beginRendering.
    if (this.vertexTexCoordLocation >= 0) {
        gl.disableVertexAttribArray(this.vertexTexCoordLocation);
    }

    gl.drawElements(
        gl.LINE_LOOP,
        this.numOutlineIndices,
        gl.UNSIGNED_SHORT,
        this.outlineIndicesOffset * 2);
};

/**
 * Causes this terrain to perform the picking operations on the specified tiles, as appropriate for the draw
 * context's pick settings. Normally, this draws the terrain in a unique pick color and computes the picked
 * terrain position. When the draw context is set to region picking mode, this omits the computation of a picked
 * terrain position.
 * @param {DrawContext} dc The current draw context.
 * @param {Array} tileList The list of tiles to pick.
 * @param {Object} pickDelegate Indicates the object to use as the picked object's <code>userObject</code>.
 * If null, then this tessellator is used as the <code>userObject</code>.
 * @throws {ArgumentError} If either the draw context or the tile list are null or undefined.
 */
Tessellator.prototype.pick = function (dc, tileList, pickDelegate) {
    if (!dc) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tessellator", "pick", "missingDc"));
    }

    if (!tileList) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Tessellator", "pick", "missingList"));
    }

    var color = null,
        userObject = pickDelegate || this,
        position = new Position(0, 0, 0),
        pickableTiles = [];

    // Assemble a list of tiles that intersect the pick frustum. This eliminates unnecessary work for tiles that
    // do not contribute to the pick result.
    for (var i = 0, len = tileList.length; i < len; i++) {
        var tile = tileList[i];
        if (tile.extent.intersectsFrustum(dc.pickFrustum)) {
            pickableTiles.push(tile);
        }
    }

    // Draw the pickable tiles in a unique pick color. Suppress this step when picking the terrain only. In this
    // case drawing to the pick framebuffer is unnecessary.
    if (!dc.pickTerrainOnly) {
        color = dc.uniquePickColor();
        this.drawPickTiles(dc, pickableTiles, color);
    }

    // Determine the terrain position at the pick point. If the terrain is picked, add a corresponding picked
    // object to the draw context. Suppress this step in region picking mode.
    if (!dc.regionPicking) {
        var ray = dc.pickRay.clone(), // Cloning the pick ray is necessary here due to the fact that Tesselator.computeIntersections modifies ray
            point = this.computeNearestIntersection(ray, pickableTiles);

        if (point) {
            dc.globe.computePositionFromPoint(point[0], point[1], point[2], position);
            position.altitude = dc.globe.elevationAtLocation(position.latitude, position.longitude);
            dc.addPickedObject(new PickedObject(color, userObject, position, null, true));
        }
    }
};

// Internal function. Intentionally not documented.
Tessellator.prototype.drawPickTiles = function (dc, tileList, color) {
    var gl = dc.currentGlContext;

    try {
        dc.findAndBindProgram(BasicProgram);
        dc.currentProgram.loadColor(gl, color);
        this.beginRendering(dc);

        for (var i = 0, len = tileList.length; i < len; i++) {
            var tile = tileList[i];
            this.beginRenderingTile(dc, tile);
            this.renderTile(dc, tile);
            this.endRenderingTile(dc, tile);
        }
    } finally {
        this.endRendering(dc);
    }
};

// Internal function. Intentionally not documented.
Tessellator.prototype.computeNearestIntersection = function (line, tileList) {
    // Compute all intersections between the specified line and tile list.
    var results = [];
    for (var i = 0, len = tileList.length; i < len; i++) {
        this.computeIntersections(line, tileList[i], results);
    }

    if (results.length == 0) {
        return null; // no intersection
    } else {
        // Find and return the intersection nearest to the line's origin.
        var minDistance = Number.POSITIVE_INFINITY,
            minIndex;
        for (i = 0, len = results.length; i < len; i++) {
            var distance = line.origin.distanceToSquared(results[i]);
            if (minDistance > distance) {
                minDistance = distance;
                minIndex = i;
            }
        }

        return results[minIndex];
    }
};

// Internal function. Intentionally not documented.
Tessellator.prototype.computeIntersections = function (line, tile, results) {
    var level = tile.level,
        neighborLevel,
        points = tile.points,
        elements,
        firstResult = results.length;

    // Translate the line from model coordinates to tile local coordinates.
    line.origin.subtract(tile.referencePoint);

    // Assemble the shared tile index geometry. This initializes the index properties used below.
    this.buildSharedGeometry(tile);

    // Compute any intersections with the tile's interior triangles..
    elements = this.baseIndices;
    WWMath.computeTriStripIntersections(line, points, elements, results);

    // Compute any intersections with the tile's south border triangles.
    neighborLevel = tile.neighborLevel(WorldWind.SOUTH);
    elements = neighborLevel && neighborLevel.compare(level) < 0 ? this.indicesLoresSouth : this.indicesSouth;
    WWMath.computeTriStripIntersections(line, points, elements, results);

    // Compute any intersections with the tile's west border triangles.
    neighborLevel = tile.neighborLevel(WorldWind.WEST);
    elements = neighborLevel && neighborLevel.compare(level) < 0 ? this.indicesLoresWest : this.indicesWest;
    WWMath.computeTriStripIntersections(line, points, elements, results);

    // Compute any intersections with the tile's east border triangles.
    neighborLevel = tile.neighborLevel(WorldWind.EAST);
    elements = neighborLevel && neighborLevel.compare(level) < 0 ? this.indicesLoresEast : this.indicesEast;
    WWMath.computeTriStripIntersections(line, points, elements, results);

    // Compute any intersections with the tile's north border triangles.
    neighborLevel = tile.neighborLevel(WorldWind.NORTH);
    elements = neighborLevel && neighborLevel.compare(level) < 0 ? this.indicesLoresNorth : this.indicesNorth;
    WWMath.computeTriStripIntersections(line, points, elements, results);

    // Translate the line and the intersection results from tile local coordinates to model coordinates.
    line.origin.add(tile.referencePoint);
    for (var i = firstResult, len = results.length; i < len; i++) {
        results[i].add(tile.referencePoint);
    }
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

Tessellator.prototype.refineNeighbors = function (dc) {
    var tileRefinementSet = {};

    for (var idx = 0, len = this.tiles.length; idx < len; idx += 1) {
        var tile = this.tiles[idx],
            levelNumber = tile.level.levelNumber,
            sector = tile.sector,
            corner,
            neighbor,
            idx,
            len;

        // Corners of the tile.
        var neTileCorner = [sector.maxLatitude, sector.maxLongitude].toString(),
            seTileCorner = [sector.minLatitude, sector.maxLongitude].toString(),
            nwTileCorner = [sector.maxLatitude, sector.minLongitude].toString(),
            swTileCorner = [sector.minLatitude, sector.minLongitude].toString();

        corner = this.corners[neTileCorner];
        // assert(corner, "northeast corner not found");
        if (corner.hasOwnProperty('se')) {
            neighbor = corner.se;
            if (this.tiles[neighbor].level.levelNumber < levelNumber - 1) {
                if (!tileRefinementSet[neighbor]) {
                    tileRefinementSet[neighbor] = true;
                }
            }
        }
        if (corner.hasOwnProperty('nw')) {
            neighbor = corner.nw;
            if (this.tiles[neighbor].level.levelNumber < levelNumber - 1) {
                if (!tileRefinementSet[neighbor]) {
                    tileRefinementSet[neighbor] = true;
                }
            }
        }

        corner = this.corners[seTileCorner];
        // assert(corner, "southeast corner not found");
        if (corner.hasOwnProperty('ne')) {
            neighbor = corner.ne;
            if (this.tiles[neighbor].level.levelNumber < levelNumber - 1) {
                if (!tileRefinementSet[neighbor]) {
                    tileRefinementSet[neighbor] = true;
                }
            }
        }
        if (corner.hasOwnProperty('sw')) {
            neighbor = corner.sw;
            if (this.tiles[neighbor].level.levelNumber < levelNumber - 1) {
                if (!tileRefinementSet[neighbor]) {
                    tileRefinementSet[neighbor] = true;
                }
            }
        }

        corner = this.corners[nwTileCorner];
        // assert(corner, "northwest corner not found");
        if (corner.hasOwnProperty('ne')) {
            neighbor = corner.ne;
            if (this.tiles[neighbor].level.levelNumber < levelNumber - 1) {
                if (!tileRefinementSet[neighbor]) {
                    tileRefinementSet[neighbor] = true;
                }
            }
        }
        if (corner.hasOwnProperty('sw')) {
            neighbor = corner.sw;
            if (this.tiles[neighbor].level.levelNumber < levelNumber - 1) {
                if (!tileRefinementSet[neighbor]) {
                    tileRefinementSet[neighbor] = true;
                }
            }
        }

        corner = this.corners[swTileCorner];
        // assert(corner, "southwest corner not found");
        if (corner.hasOwnProperty('se')) {
            neighbor = corner.se;
            if (this.tiles[neighbor].level.levelNumber < levelNumber - 1) {
                if (!tileRefinementSet[neighbor]) {
                    tileRefinementSet[neighbor] = true;
                }
            }
        }
        if (corner.hasOwnProperty('nw')) {
            neighbor = corner.nw;
            if (this.tiles[neighbor].level.levelNumber < levelNumber - 1) {
                if (!tileRefinementSet[neighbor]) {
                    tileRefinementSet[neighbor] = true;
                }
            }
        }
    }

    // Partition tiles into those requiring refinement and those that don't need refinement.
    var tilesNeedingRefinement = [],
        tilesNotNeedingRefinement = [];
    for (idx = 0, len = this.tiles.length; idx < len; idx += 1) {
        tile = this.tiles[idx];
        if (tileRefinementSet[idx]) {
            tilesNeedingRefinement.push(tile);
        }
        else {
            tilesNotNeedingRefinement.push(tile);
        }
    }

    // When tiles need refinement, recur.
    if (tilesNeedingRefinement.length > 0) {
        // Reset refinement state.
        this.tiles = [];
        this.corners = {};

        // For tiles that don't need refinement, simply add the tile.
        for (idx = 0, len = tilesNotNeedingRefinement.length; idx < len; idx += 1) {
            tile = tilesNotNeedingRefinement[idx];

            this.addTile(dc, tile);
        }

        // For tiles that do need refinement, subdivide the tile and add its descendants.
        for (idx = 0, len = tilesNeedingRefinement.length; idx < len; idx += 1) {
            var tile = tilesNeedingRefinement[idx];

            this.addTileDescendants(dc, tile);
        }

        // Recur.
        this.refineNeighbors(dc);
    }
};

Tessellator.prototype.finishTessellating = function (dc) {
    for (var idx = 0, len = this.tiles.length; idx < len; idx += 1) {
        var tile = this.tiles[idx];
        this.setNeighbors(tile);
        this.regenerateTileGeometryIfNeeded(dc, tile);
        this.currentTiles.addTile(tile);
    }
};

Tessellator.prototype.setNeighbors = function (tile) {
    var sector = tile.sector;

    // Corners of the tile.
    var neTileCorner = [sector.maxLatitude, sector.maxLongitude].toString(),
        seTileCorner = [sector.minLatitude, sector.maxLongitude].toString(),
        nwTileCorner = [sector.maxLatitude, sector.minLongitude].toString(),
        swTileCorner = [sector.minLatitude, sector.minLongitude].toString();

    var neCorner = this.corners[neTileCorner],
        seCorner = this.corners[seTileCorner],
        nwCorner = this.corners[nwTileCorner],
        swCorner = this.corners[swTileCorner];

    var northIdx = -1, // neCorner.hasOwnProperty('se') ? neCorner.se : nwCorner.hasOwnProperty('sw') ? nwCorner.sw : -1,
        southIdx = -1, // seCorner.hasOwnProperty('ne') ? seCorner.ne : swCorner.hasOwnProperty('nw') ? swCorner.nw : -1,
        eastIdx = -1, // neCorner.hasOwnProperty('nw') ? neCorner.nw : seCorner.hasOwnProperty('sw') ? seCorner.sw : -1,
        westIdx = -1; //nwCorner.hasOwnProperty('ne') ? nwCorner.ne : swCorner.hasOwnProperty('se') ? swCorner.se : -1;

    if (neCorner.hasOwnProperty('se')) {
        northIdx = neCorner.se;
    }
    else if (nwCorner.hasOwnProperty('sw')) {
        northIdx = nwCorner.sw;
    }

    if (seCorner.hasOwnProperty('ne')) {
        southIdx = seCorner.ne;
    }
    else if (swCorner.hasOwnProperty('nw')) {
        southIdx = swCorner.nw;
    }

    if (neCorner.hasOwnProperty('nw')) {
        eastIdx = neCorner.nw;
    }
    else if (seCorner.hasOwnProperty('sw')) {
        eastIdx = seCorner.sw;
    }

    if (nwCorner.hasOwnProperty('ne')) {
        westIdx = nwCorner.ne;
    }
    else if (swCorner.hasOwnProperty('se')) {
        westIdx = swCorner.se;
    }

    tile.setNeighborLevel(WorldWind.NORTH, northIdx >= 0 ? this.tiles[northIdx].level : null);
    tile.setNeighborLevel(WorldWind.SOUTH, southIdx >= 0 ? this.tiles[southIdx].level : null);
    tile.setNeighborLevel(WorldWind.EAST, eastIdx >= 0 ? this.tiles[eastIdx].level : null);
    tile.setNeighborLevel(WorldWind.WEST, westIdx >= 0 ? this.tiles[westIdx].level : null);
};

Tessellator.prototype.isTileVisible = function (dc, tile) {
    if (dc.globe.projectionLimits && !tile.sector.overlaps(dc.globe.projectionLimits)) {
        return false;
    }

    return tile.extent.intersectsFrustum(dc.frustumInModelCoordinates);
};

Tessellator.prototype.tileMeetsRenderCriteria = function (dc, tile) {
    var s = this.detailControl;
    if (tile.sector.minLatitude >= 75 || tile.sector.maxLatitude <= -75) {
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
    return texelSize / 8 * Angle.RADIANS_TO_DEGREES;
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

    // Modify the elevations around the tile's border to match neighbors of lower resolution, if any.
    if (this.mustAlignNeighborElevations(dc, tile)) {
        this.alignNeighborElevations(dc, tile, elevations);
    }

    // Compute the tile's Cartesian coordinates relative to a local origin, called the reference point.
    WWUtil.multiplyArray(elevations, dc.verticalExaggeration);
    dc.globe.computePointsForGrid(tile.sector, numLat, numLon, elevations, refPoint, tile.points);

    // Establish a transform that is used later to move the tile coordinates into place relative to the globe.
    tile.transformationMatrix.setTranslation(refPoint[0], refPoint[1], refPoint[2]);
};

Tessellator.prototype.mustAlignNeighborElevations = function (dc, tile) {
    var level = tile.level,
        northLevel = tile.neighborLevel(WorldWind.NORTH),
        southLevel = tile.neighborLevel(WorldWind.SOUTH),
        eastLevel = tile.neighborLevel(WorldWind.EAST),
        westLevel = tile.neighborLevel(WorldWind.WEST);

    return northLevel && northLevel.compare(level) < 0 ||
        southLevel && southLevel.compare(level) < 0 ||
        eastLevel && eastLevel.compare(level) < 0 ||
        westLevel && westLevel.compare(level) < 0;
};

Tessellator.prototype.alignNeighborElevations = function (dc, tile, elevations) {
    var numLat = tile.tileHeight + 1, // num points in each dimension is 1 more than the number of tile cells
        numLon = tile.tileWidth + 1,
        level = tile.level,
        prevNumLat = Math.floor(numLat / 2) + 1, // num prev level points is 1 more than 1/2 the number of cells
        prevNumLon = Math.floor(numLon / 2) + 1,
        prevLevel = level.previousLevel(),
        prevElevations = this.scratchPrevElevations,
        neighborLevel,
        i, index, prevIndex;

    // Allocate space for the previous level elevations.
    if (!prevElevations) {
        prevElevations = new Float64Array(prevNumLat * prevNumLon);
        this.scratchPrevElevations = prevElevations;
    }

    // Retrieve the previous level elevations, using 1/2 the number of tile cells.
    WWUtil.fillArray(prevElevations, 0);

    dc.globe.elevationsForGrid(tile.sector, prevNumLat, prevNumLon, this.coverageTargetResolution(prevLevel.texelSize), prevElevations);

    // Use previous level elevations along the north edge when the northern neighbor is lower resolution.
    neighborLevel = tile.neighborLevel(WorldWind.NORTH);
    if (neighborLevel && neighborLevel.compare(level) < 0) {
        index = (numLat - 1) * numLon;
        prevIndex = (prevNumLat - 1) * prevNumLon;
        for (i = 0; i < prevNumLon; i++, index += 2, prevIndex += 1) {
            elevations[index] = prevElevations[prevIndex];
            if (i < prevNumLon - 1) {
                elevations[index + 1] = 0.5 * (prevElevations[prevIndex] + prevElevations[prevIndex + 1]);
            }
        }
    }

    // Use previous level elevations along the south edge when the southern neighbor is lower resolution.
    neighborLevel = tile.neighborLevel(WorldWind.SOUTH);
    if (neighborLevel && neighborLevel.compare(level) < 0) {
        index = 0;
        prevIndex = 0;
        for (i = 0; i < prevNumLon; i++, index += 2, prevIndex += 1) {
            elevations[index] = prevElevations[prevIndex];
            if (i < prevNumLon - 1) {
                elevations[index + 1] = 0.5 * (prevElevations[prevIndex] + prevElevations[prevIndex + 1]);
            }
        }
    }

    // Use previous level elevations along the east edge when the eastern neighbor is lower resolution.
    neighborLevel = tile.neighborLevel(WorldWind.EAST);
    if (neighborLevel && neighborLevel.compare(level) < 0) {
        index = numLon - 1;
        prevIndex = prevNumLon - 1;
        for (i = 0; i < prevNumLat; i++, index += 2 * numLon, prevIndex += prevNumLon) {
            elevations[index] = prevElevations[prevIndex];
            if (i < prevNumLat - 1) {
                elevations[index + numLon] = 0.5 * (prevElevations[prevIndex] + prevElevations[prevIndex + prevNumLon]);
            }
        }
    }

    // Use previous level elevations along the west edge when the western neighbor is lower resolution.
    neighborLevel = tile.neighborLevel(WorldWind.WEST);
    if (neighborLevel && neighborLevel.compare(level) < 0) {
        index = 0;
        prevIndex = 0;
        for (i = 0; i < prevNumLat; i++, index += 2 * numLon, prevIndex += prevNumLon) {
            elevations[index] = prevElevations[prevIndex];
            if (i < prevNumLat - 1) {
                elevations[index + numLon] = 0.5 * (prevElevations[prevIndex] + prevElevations[prevIndex + prevNumLon]);
            }
        }
    }
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

    var wireframeIndices = this.buildWireframeIndices(tileWidth, tileHeight);
    var outlineIndices = this.buildOutlineIndices(tileWidth, tileHeight);

    indices = indices.concat(wireframeIndices);
    this.wireframeIndicesOffset = indices.length - this.numWireframeIndices;

    indices = indices.concat(outlineIndices);
    this.outlineIndicesOffset = indices.length - this.numOutlineIndices;

    this.indices = new Uint16Array(indices);
};

Tessellator.prototype.buildWireframeIndices = function (tileWidth, tileHeight) {
    // The wireframe representation draws the vertices that appear on the surface.

    // The number of vertices in each dimension is 1 more than the number of cells.
    var numLatVertices = tileHeight + 1;
    var numLonVertices = tileWidth + 1;

    // Allocate an array to hold the computed indices.
    var numIndices = 2 * tileWidth * numLatVertices + 2 * tileHeight * numLonVertices;
    var indices = [];

    var rowStride = numLonVertices;

    var index = 0,
        lonIndex,
        latIndex,
        vertexIndex;

    // Add a line between each row to define the horizontal cell outlines.
    for (latIndex = 0; latIndex < numLatVertices; latIndex += 1) {
        for (lonIndex = 0; lonIndex < tileWidth; lonIndex += 1) {
            vertexIndex = lonIndex + latIndex * rowStride;
            indices[index] = vertexIndex;
            indices[index + 1] = vertexIndex + 1;
            index += 2;
        }
    }

    // Add a line between each column to define the vertical cell outlines.
    for (lonIndex = 0; lonIndex < numLonVertices; lonIndex += 1) {
        for (latIndex = 0; latIndex < tileHeight; latIndex += 1) {
            vertexIndex = lonIndex + latIndex * rowStride;
            indices[index] = vertexIndex;
            indices[index + 1] = vertexIndex + rowStride;
            index += 2;
        }
    }

    this.numWireframeIndices = numIndices;
    return indices;
};

Tessellator.prototype.buildOutlineIndices = function (tileWidth, tileHeight) {
    // The outline representation traces the tile's outer edge on the surface.

    // The number of vertices in each dimension is 1 more than the number of cells.
    var numLatVertices = tileHeight + 1;
    var numLonVertices = tileWidth + 1;

    // Allocate an array to hold the computed indices.
    var numIndices = 2 * (numLatVertices - 2) + 2 * numLonVertices + 1;
    var indices = [];

    var rowStride = numLatVertices;

    var index = 0,
        lonIndex,
        latIndex,
        vertexIndex;

    // Bottom row, starting at the left and going right.
    latIndex = 0;
    for (lonIndex = 0; lonIndex < numLonVertices; lonIndex += 1) {
        vertexIndex = lonIndex + latIndex * numLonVertices;
        indices[index] = vertexIndex;
        index += 1;
    }

    // Right column, starting at the bottom and going up.
    lonIndex = numLonVertices - 1;
    for (latIndex = 1; latIndex < numLatVertices; latIndex += 1) {
        vertexIndex = lonIndex + latIndex * numLonVertices;
        indices[index] = vertexIndex;
        index += 1;
    }

    // Top row, starting on the right and going to the left.
    latIndex = numLatVertices - 1;
    for (lonIndex = numLonVertices - 1; lonIndex >= 0; lonIndex -= 1) {
        vertexIndex = lonIndex + latIndex * numLonVertices;
        indices[index] = vertexIndex;
        index += 1;
    }

    // Leftmost column, starting at the top and going down.
    lonIndex = 0;
    for (latIndex = numLatVertices - 1; latIndex >= 0; latIndex -= 1) {
        vertexIndex = lonIndex + latIndex * numLonVertices;
        indices[index] = vertexIndex;
        index += 1;
    }

    this.numOutlineIndices = numIndices;
    return indices;
};

Tessellator.prototype.cacheSharedGeometryVBOs = function (dc) {
    var gl = dc.currentGlContext,
        gpuResourceCache = dc.gpuResourceCache;

    var texCoordVbo = gpuResourceCache.resourceForKey(this.texCoordVboCacheKey);
    if (!texCoordVbo) {
        texCoordVbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordVbo);
        gl.bufferData(gl.ARRAY_BUFFER, this.texCoords, gl.STATIC_DRAW);
        dc.frameStatistics.incrementVboLoadCount(1);
        gpuResourceCache.putResource(this.texCoordVboCacheKey, texCoordVbo, this.texCoords.length * 4 / 2);
    }

    var indicesVbo = gpuResourceCache.resourceForKey(this.indicesVboCacheKey);
    if (!indicesVbo) {
        indicesVbo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesVbo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        dc.frameStatistics.incrementVboLoadCount(1);
        gpuResourceCache.putResource(this.indicesVboCacheKey, indicesVbo, this.indices.length * 2);
    }
};

export default Tessellator;
