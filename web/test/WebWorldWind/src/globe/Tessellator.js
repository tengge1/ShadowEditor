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
    this.lastModelViewProjection = Matrix.fromIdentity();

    this.vertexPointLocation = -1;
    this.vertexTexCoordLocation = -1;

    this.vertices = null;

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

    if (!terrainTile.points) {
        terrainTile.points = this.vertices;
    }

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
        prim = gl.TRIANGLES; // replace TRIANGLE_STRIP with LINE_STRIP to debug borders

    var heightmap = dc.globe.elevationModel.coverages[0].imageCache.get(
        terrainTile.level.levelNumber,
        terrainTile.row,
        terrainTile.column
    );
    if (heightmap) {
        if (!heightmap.texture) {
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
        this.indices.length,
        gl.UNSIGNED_SHORT,
        0);

    // TODO: 适应不同切图的瓦片。
    // var level = terrainTile.level,
    //     neighborLevel;

    // neighborLevel = terrainTile.neighborLevel(WorldWind.NORTH);
    // if (neighborLevel && neighborLevel.compare(level) < 0) {
    //     gl.drawElements(
    //         prim,
    //         this.numIndicesLoresNorth,
    //         gl.UNSIGNED_SHORT,
    //         this.indicesLoresNorthOffset * 2);
    // }
    // else {
    //     gl.drawElements(
    //         prim,
    //         this.numIndicesNorth,
    //         gl.UNSIGNED_SHORT,
    //         this.indicesNorthOffset * 2);
    // }

    // neighborLevel = terrainTile.neighborLevel(WorldWind.SOUTH);
    // if (neighborLevel && neighborLevel.compare(level) < 0) {
    //     gl.drawElements(
    //         prim,
    //         this.numIndicesLoresSouth,
    //         gl.UNSIGNED_SHORT,
    //         this.indicesLoresSouthOffset * 2);
    // }
    // else {
    //     gl.drawElements(
    //         prim,
    //         this.numIndicesSouth,
    //         gl.UNSIGNED_SHORT,
    //         this.indicesSouthOffset * 2);
    // }

    // neighborLevel = terrainTile.neighborLevel(WorldWind.WEST);
    // if (neighborLevel && neighborLevel.compare(level) < 0) {
    //     gl.drawElements(
    //         prim,
    //         this.numIndicesLoresWest,
    //         gl.UNSIGNED_SHORT,
    //         this.indicesLoresWestOffset * 2);
    // }
    // else {
    //     gl.drawElements(
    //         prim,
    //         this.numIndicesWest,
    //         gl.UNSIGNED_SHORT,
    //         this.indicesWestOffset * 2);
    // }

    // neighborLevel = terrainTile.neighborLevel(WorldWind.EAST);
    // if (neighborLevel && neighborLevel.compare(level) < 0) {
    //     gl.drawElements(
    //         prim,
    //         this.numIndicesLoresEast,
    //         gl.UNSIGNED_SHORT,
    //         this.indicesLoresEastOffset * 2);
    // }
    // else {
    //     gl.drawElements(
    //         prim,
    //         this.numIndicesEast,
    //         gl.UNSIGNED_SHORT,
    //         this.indicesEastOffset * 2);
    // }
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
 */
Tessellator.prototype.pick = function (dc, tileList, pickDelegate) {
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

Tessellator.prototype.finishTessellating = function (dc) {
    for (var idx = 0, len = this.tiles.length; idx < len; idx += 1) {
        var tile = this.tiles[idx];
        dc.globe.elevationModel.coverages[0].assembleTiles(tile.level, tile.sector, true);
        this.currentTiles.addTile(tile);
    }
};

Tessellator.prototype.isTileVisible = function (dc, tile) {
    if (dc.globe.projectionLimits && !tile.sector.overlaps(dc.globe.projectionLimits)) {
        return false;
    }

    return tile.extent.intersectsFrustum(dc.frustumInModelCoordinates);
};

Tessellator.prototype.tileMeetsRenderCriteria = function (dc, tile) {
    var s = this.detailControl;
    var lat = WWMath.mercatorLat(75);
    if (tile.sector.minLatitude >= lat || tile.sector.maxLatitude <= -lat) {
        s *= 2;
    }
    return tile.level.isLastLevel() || !tile.mustSubdivide(dc, s);
};

Tessellator.prototype.buildSharedGeometry = function () {
    var plane = new THREE.PlaneBufferGeometry(1, 1, 16, 16);
    this.vertices = plane.attributes.position.array;
    this.texCoords = plane.attributes.uv.array;
    this.indices = plane.index.array;
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
