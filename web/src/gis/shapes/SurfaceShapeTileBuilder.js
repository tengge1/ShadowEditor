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
 * @exports SurfaceShapeTileBuilder
 */
import ArgumentError from '../error/ArgumentError';
import DrawContext from '../render/DrawContext';
import Globe from '../globe/Globe';
import GpuProgram from '../shaders/GpuProgram';
import Level from '../util/Level';
import LevelSet from '../util/LevelSet';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import MemoryCache from '../cache/MemoryCache';
import NotYetImplementedError from '../error/NotYetImplementedError';
import PickedObject from '../pick/PickedObject';
import Rectangle from '../geom/Rectangle';
import Sector from '../geom/Sector';
import SurfaceShape from '../shapes/SurfaceShape';
import SurfaceShapeTile from '../shapes/SurfaceShapeTile';
import Terrain from '../globe/Terrain';
import TerrainTile from '../globe/TerrainTile';
import TerrainTileList from '../globe/TerrainTileList';
import TextureTile from '../render/TextureTile';
import Tile from '../util/Tile';


function SurfaceShapeTileBuilder() {
    // Parameterize top level subdivision in one place.

    // TilesInTopLevel describes the most coarse tile structure.
    this.numRowsTilesInTopLevel = 4;
    this.numColumnsTilesInTopLevel = 8;

    // The maximum number of levels that will ever be tessellated.
    this.maximumSubdivisionDepth = 15;

    // tileWidth, tileHeight - the number of subdivisions a single tile has; this determines the sampling grid.
    this.tileWidth = 256;
    this.tileHeight = 256;

    /**
     * The collection of levels.
     * @type {LevelSet}
     */
    this.levels = new LevelSet(
        Sector.FULL_SPHERE,
        new Location(
            180 / this.numRowsTilesInTopLevel,
            360 / this.numColumnsTilesInTopLevel),
        this.maximumSubdivisionDepth,
        this.tileWidth,
        this.tileHeight);

    /**
     * The collection of surface shapes processed by this class.
     * @type {SurfaceShape[]}
     */
    this.surfaceShapes = [];

    /**
     * The collection of surface shape tiles that actually contain surface shapes.
     * @type {SurfaceShapeTile[]}
     */
    this.surfaceShapeTiles = [];

    /**
     * The collection of top level surface shape tiles, from which actual tiles are derived.
     * @type {SurfaceShapeTile[]}
     */
    this.topLevelTiles = [];

    /**
     * Accumulator of all sectors for surface shapes
     * @type {Sector}
     */
    this.sector = new Sector(-90, 90, -180, 180);

    /**
     * The default split scale. The split scale 2.9 has been empirically determined to render sharp lines and edges with
     * the SurfaceShapes such as SurfacePolyline and SurfacePolygon.
     *
     * @type {Number}
     */
    this.detailControl = 1.25;

    // Internal use only. Intentionally not documented.
    this.tileCache = new MemoryCache(500000, 400000);
}

/**
 * Clear all transient state from the surface shape tile builder.
 */
SurfaceShapeTileBuilder.prototype.clear = function () {
    this.surfaceShapeTiles.splice(0, this.surfaceShapeTiles.length);
    this.surfaceShapes.splice(0, this.surfaceShapes.length);
};

/**
 * Insert a surface shape to be rendered into the surface shape tile builder.
 *
 * @param {SurfaceShape} surfaceShape A surfave shape to be processed.
 */
SurfaceShapeTileBuilder.prototype.insertSurfaceShape = function (surfaceShape) {
    this.surfaceShapes.push(surfaceShape);
};

/**
 * Perform the rendering of any accumulated surface shapes by building the surface shape tiles that contain these
 * shapes and then rendering those tiles.
 *
 * @param {DrawContext} dc The drawing context.
 */
SurfaceShapeTileBuilder.prototype.doRender = function (dc) {
    if (dc.pickingMode) {
        // Picking rendering strategy:
        //  1) save all tiles created prior to picking,
        //  2) construct and render new tiles with pick-based contents (colored with pick IDs),
        //  3) restore all prior tiles.
        // This has a big potential win for normal rendering, since there is a lot of coherence
        // from frame to frame if no picking is occurring.
        for (var idx = 0, len = this.surfaceShapes.length; idx < len; idx += 1) {
            this.surfaceShapes[idx].resetPickColor();
        }

        SurfaceShapeTileBuilder.pickSequence += 1;

        var savedTiles = this.surfaceShapeTiles;
        var savedTopLevelTiles = this.topLevelTiles;

        this.surfaceShapeTiles = [];
        this.topLevelTiles = [];

        this.buildTiles(dc);

        if (dc.deepPicking) {
            // Normally, we render all shapes together in one tile (or a small number, but this detail
            // doesn't matter). For deep picking, we need to render each shape individually.
            this.doDeepPickingRender(dc);

        } else {
            dc.surfaceTileRenderer.renderTiles(dc, this.surfaceShapeTiles, 1);
        }

        this.surfaceShapeTiles = savedTiles;
        this.topLevelTiles = savedTopLevelTiles;
    } else {
        this.buildTiles(dc);

        dc.surfaceTileRenderer.renderTiles(dc, this.surfaceShapeTiles, 1);
    }
};

SurfaceShapeTileBuilder.prototype.doDeepPickingRender = function (dc) {
    var idxTile, lenTiles, idxShape, lenShapes, idxPick, lenPicks, po, shape, tile;

    // Determine the shapes that were drawn during buildTiles. These shapes may not actually be
    // at the pick point, but they are candidates for deep picking.
    var deepPickShapes = [];
    for (idxPick = 0, lenPicks = dc.objectsAtPickPoint.objects.length; idxPick < lenPicks; idxPick += 1) {
        po = dc.objectsAtPickPoint.objects[idxPick];
        if (po.userObject instanceof SurfaceShape) {
            shape = po.userObject;

            // If the shape was not already in the collection of deep picked shapes, ...
            if (deepPickShapes.indexOf(shape) < 0) {
                deepPickShapes.push(shape);

                // Delete the shape that was drawn during buildTiles from the pick list.
                dc.objectsAtPickPoint.objects.splice(idxPick, 1);

                // Update the index and length to reflect the deletion.
                idxPick -= 1;
                lenPicks -= 1;
            }
        }
    }

    if (deepPickShapes.length <= 0) {
        return;
    }

    // For all shapes,
    //  1) force that shape to be the only shape in a tile,
    //  2) re-render the tile, and
    //  3) use the surfaceTileRenderer to render the tile on the terrain,
    //  4) read the color to see if it is attributable to the current shape.
    var resolvablePickObjects = [];
    for (idxShape = 0, lenShapes = deepPickShapes.length; idxShape < lenShapes; idxShape += 1) {
        shape = deepPickShapes[idxShape];
        for (idxTile = 0, lenTiles = this.surfaceShapeTiles.length; idxTile < lenTiles; idxTile += 1) {
            tile = this.surfaceShapeTiles[idxTile];
            tile.setShapes([shape]);
            tile.updateTexture(dc);
        }

        dc.surfaceTileRenderer.renderTiles(dc, this.surfaceShapeTiles, 1);

        var pickColor = dc.readPickColor(dc.pickPoint);
        if (!!pickColor && shape.pickColor.equals(pickColor)) {
            po = new PickedObject(shape.pickColor.clone(),
                shape.pickDelegate ? shape.pickDelegate : shape, null, shape.layer, false);
            resolvablePickObjects.push(po);
        }
    }

    // Flush surface shapes that have accumulated in the updateTexture pass just completed on all shapes.
    for (idxPick = 0, lenPicks = dc.objectsAtPickPoint.objects.length; idxPick < lenPicks; idxPick += 1) {
        po = dc.objectsAtPickPoint.objects[idxPick];
        if (po.userObject instanceof SurfaceShape) {
            // Delete the shape that was picked in the most recent pass.
            dc.objectsAtPickPoint.objects.splice(idxPick, 1);

            // Update the index and length to reflect the deletion.
            idxPick -= 1;
            lenPicks -= 1;
        }
    }

    // Add the resolvable pick objects for surface shapes that were actually visible at the pick point
    // to the pick list.
    for (idxPick = 0, lenPicks = resolvablePickObjects.length; idxPick < lenPicks; idxPick += 1) {
        po = resolvablePickObjects[idxPick];
        dc.objectsAtPickPoint.objects.push(po);
    }
};

/**
 * Assembles the surface tiles and draws any surface shapes that have been accumulated into those offscreen tiles. The
 * surface tiles are assembled to meet the necessary resolution of to the draw context's.
 * <p/>
 * This does nothing if there are no surface shapes associated with this builder.
 *
 * @param {DrawContext} dc The draw context to build tiles for.
 *
 * @throws {ArgumentError} If the draw context is null.
 */
SurfaceShapeTileBuilder.prototype.buildTiles = function (dc) {
    if (!dc) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceShapeTileBuilder", "buildTiles", "missingDc"));
    }

    if (!this.surfaceShapes || this.surfaceShapes.length < 1) {
        return;
    }

    // Assemble the current visible tiles and update their associated textures if necessary.
    this.assembleTiles(dc);

    // Clean up references to all surface shapes to avoid dangling references. The surface shape list is no
    // longer needed, now that the shapes are held by each tile.
    this.surfaceShapes.splice(0, this.surfaceShapes.length);
    for (var idx = 0, len = this.surfaceShapeTiles.length; idx < len; idx += 1) {
        var tile = this.surfaceShapeTiles[idx];
        tile.clearShapes();
    }
};

/**
 * Assembles a set of surface tiles that are visible in the specified DrawContext and meet the tile builder's
 * resolution criteria. Tiles are culled against the current surface shape list, against the DrawContext's view
 * frustum during rendering mode, and against the DrawContext's pick frustums during picking mode. If a tile does
 * not meet the tile builder's resolution criteria, it's split into four sub-tiles and the process recursively
 * repeated on the sub-tiles.
 * <p/>
 * During assembly, each surface shape in {@link #surfaceShapes} is sorted into the tiles they
 * intersect. The top level tiles are used as an index to quickly determine which tiles each shape intersects.
 * Surface shapes are sorted into sub-tiles by simple intersection tests, and are added to each tile's surface
 * renderable list at most once. See {@link SurfaceShapeTileBuilder.SurfaceShapeTile#addSurfaceShape(SurfaceShape,
 * gov.nasa.worldwind.geom.Sector)}. Tiles that don't intersect any surface shapes are discarded.
 *
 * @param {DrawContext} dc The DrawContext to assemble tiles for.
 */
SurfaceShapeTileBuilder.prototype.assembleTiles = function (dc) {
    var tile, idxShape, lenShapes, idxTile, lenTiles, idxSector, lenSectors;

    // Create a set of top level tiles only if that set doesn't exist yet.
    if (this.topLevelTiles.length < 1) {
        this.createTopLevelTiles();
    }

    // Store the top level tiles in a set to ensure that each top level tile is added only once. Store the tiles
    // that intersect each surface shape in a set to ensure that each object is added to a tile at most once.
    var intersectingTiles = {};

    // Iterate over the current surface shapes, adding each surface shape to the top level tiles that it
    // intersects. This produces a set of top level tiles containing the surface shapes that intersect each
    // tile. We use the tile structure as an index to quickly determine the tiles a surface shape intersects,
    // and add object to those tiles. This has the effect of quickly sorting the objects into the top level tiles.
    // We collect the top level tiles in a HashSet to ensure there are no duplicates when multiple objects intersect
    // the same top level tiles.
    for (idxShape = 0, lenShapes = this.surfaceShapes.length; idxShape < lenShapes; idxShape += 1) {
        var surfaceShape = this.surfaceShapes[idxShape];

        var sectors = surfaceShape.computeSectors(dc);
        if (!sectors) {
            continue;
        }

        for (idxSector = 0, lenSectors = sectors.length; idxSector < lenSectors; idxSector += 1) {
            var sector = sectors[idxSector];

            for (idxTile = 0, lenTiles = this.topLevelTiles.length; idxTile < lenTiles; idxTile += 1) {
                tile = this.topLevelTiles[idxTile];

                if (tile.sector.intersects(sector)) {
                    var cacheKey = tile.tileKey;
                    intersectingTiles[cacheKey] = tile;
                    tile.addSurfaceShape(surfaceShape);
                }
            }
        }
    }

    // Add each top level tile or its descendants to the current tile list.
    //for (var idxTile = 0, lenTiles = this.topLevelTiles.length; idxTile < lenTiles; idxTile += 1) {
    for (var key in intersectingTiles) {
        if (intersectingTiles.hasOwnProperty(key)) {
            tile = intersectingTiles[key];

            this.addTileOrDescendants(dc, this.levels, null, tile);
        }
    }
};

/**
 * Potentially adds the specified tile or its descendants to the tile builder's surface shape tile collection.
 * The tile and its descendants are discarded if the tile is not visible or does not intersect any surface shapes in the
 * parent's surface shape list.
 * <p/>
 * If the tile meet the tile builder's resolution criteria it's added to the tile builder's
 * <code>currentTiles</code> list. Otherwise, it's split into four sub-tiles and each tile is recursively processed.
 *
 * @param {DrawContext} dc              The current DrawContext.
 * @param {LevelSet} levels             The tile's LevelSet.
 * @param {SurfaceShapeTile} parentTile The tile's parent, or null if the tile is a top level tile.
 * @param {SurfaceShapeTile} tile       The tile to add.
 */
SurfaceShapeTileBuilder.prototype.addTileOrDescendants = function (dc, levels, parentTile, tile) {
    // Ignore this tile if it falls completely outside the frustum. This may be the viewing frustum or the pick
    // frustum, depending on the implementation.
    if (!this.intersectsFrustum(dc, tile)) {
        // This tile is not added to the current tile list, so we clear it's object list to prepare it for use
        // during the next frame.
        tile.clearShapes();
        return;
    }

    // If the parent tile is not null, add any parent surface shapes that intersect this tile.
    if (parentTile != null) {
        this.addIntersectingShapes(dc, parentTile, tile);
    }

    // Ignore tiles that do not intersect any surface shapes.
    if (!tile.hasShapes()) {
        return;
    }

    // If this tile meets the current rendering criteria, add it to the current tile list. This tile's object list
    // is cleared after the tile update operation.
    if (this.meetsRenderCriteria(dc, levels, tile)) {
        this.addTile(dc, tile);
        return;
    }

    var nextLevel = levels.level(tile.level.levelNumber + 1);
    var subTiles = dc.pickingMode ?
        tile.subdivide(nextLevel, this) :
        tile.subdivideToCache(nextLevel, this, this.tileCache);
    for (var idxTile = 0, lenTiles = subTiles.length; idxTile < lenTiles; idxTile += 1) {
        var subTile = subTiles[idxTile];
        this.addTileOrDescendants(dc, levels, tile, subTile);
    }

    // This tile is not added to the current tile list, so we clear it's object list to prepare it for use during
    // the next frame.
    tile.clearShapes();
};

/**
 * Adds surface shapes from the parent's object list to the specified tile's object list. Adds any of the
 * parent's surface shapes that intersect the tile's sector to the tile's object list.
 *
 * @param {DrawContext} dc              The current DrawContext.
 * @param {SurfaceShapeTile} parentTile The tile's parent.
 * @param {SurfaceShapeTile} tile       The tile to add intersecting surface shapes to.
 */
SurfaceShapeTileBuilder.prototype.addIntersectingShapes = function (dc, parentTile, tile) {
    var shapes = parentTile.getShapes();
    for (var idxShape = 0, lenShapes = shapes.length; idxShape < lenShapes; idxShape += 1) {
        var shape = shapes[idxShape];

        var sectors = shape.computeSectors(dc);
        if (!sectors) {
            continue;
        }

        // Test intersection against each of the surface shape's sectors. We break after finding an
        // intersection to avoid adding the same object to the tile more than once.
        for (var idxSector = 0, lenSectors = sectors.length; idxSector < lenSectors; idxSector += 1) {
            var sector = sectors[idxSector];

            if (tile.getSector().intersects(sector)) {
                tile.addSurfaceShape(shape);
                break;
            }
        }
    }
};

/**
 * Adds the specified tile to this tile builder's surface tile collection.
 *
 * @param {DrawContext} dc The draw context.
 * @param {SurfaceShapeTile} tile The tile to add.
 */
SurfaceShapeTileBuilder.prototype.addTile = function (dc, tile) {
    if (dc.pickingMode) {
        tile.pickSequence = SurfaceShapeTileBuilder.pickSequence;
    }

    if (tile.needsUpdate(dc)) {
        tile.updateTexture(dc);
    }

    this.surfaceShapeTiles.push(tile);
};

/**
 * Internal use only.
 *
 * Returns a new SurfaceObjectTile corresponding to the specified {@code sector}, {@code level}, {@code row},
 * and {@code column}.
 *
 * CAUTION: it is assumed that there exists a single SurfaceShapeTileBuilder. This algorithm might be invalid if there
 * are more of them (or it might actually work, although it hasn't been tested in that context).
 *
 * @param {Sector} sector       The tile's Sector.
 * @param {Level} level         The tile's Level in a {@link LevelSet}.
 * @param {Number} row          The tile's row in the Level, starting from 0 and increasing to the right.
 * @param {Number} column       The tile's column in the Level, starting from 0 and increasing upward.
 *
 * @return {SurfaceShapeTile} a new SurfaceShapeTile.
 */
SurfaceShapeTileBuilder.prototype.createTile = function (sector, level, row, column) {
    return new SurfaceShapeTile(sector, level, row, column);
};

SurfaceShapeTileBuilder.prototype.createTopLevelTiles = function () {
    Tile.createTilesForLevel(this.levels.firstLevel(), this, this.topLevelTiles);
};

/**
 * Test if the tile intersects the specified draw context's frustum. During picking mode, this tests intersection
 * against all of the draw context's pick frustums. During rendering mode, this tests intersection against the draw
 * context's viewing frustum.
 *
 * @param {DrawContext} dc   The draw context the surface shape is related to.
 * @param {SurfaceShapeTile} tile The tile to test for intersection.
 *
 * @return {Boolean} true if the tile intersects the draw context's frustum; false otherwise.
 */
SurfaceShapeTileBuilder.prototype.intersectsFrustum = function (dc, tile) {
    if (dc.globe.projectionLimits && !tile.sector.overlaps(dc.globe.projectionLimits)) {
        return false;
    }

    tile.update(dc);

    return tile.extent.intersectsFrustum(dc.pickingMode ? dc.pickFrustum : dc.frustumInModelCoordinates);
};

/**
 * Tests if the specified tile meets the rendering criteria on the specified draw context. This returns true if the
 * tile is from the level set's final level, or if the tile achieves the desired resolution on the draw context.
 *
 * @param {DrawContext} dc          The current draw context.
 * @param {LevelSet} levels         The level set the tile belongs to.
 * @param {SurfaceShapeTile} tile   The tile to test.
 *
 * @return {Boolean} true if the tile meets the rendering criteria; false otherwise.
 */
SurfaceShapeTileBuilder.prototype.meetsRenderCriteria = function (dc, levels, tile) {
    return tile.level.levelNumber == levels.lastLevel().levelNumber || !tile.mustSubdivide(dc, this.detailControl);
};

/**
 * Internal use only.
 * Count of pick operations. This is used to give a surface shape tile a unique pick sequence number if it is
 * participating in picking.
 * @type {Number}
 */
SurfaceShapeTileBuilder.pickSequence = 0;

export default SurfaceShapeTileBuilder;
