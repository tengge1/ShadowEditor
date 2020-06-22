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
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import BoundingBox from '../geom/BoundingBox';
import Logger from '../util/Logger';
import Vec3 from '../geom/Vec3';
import WWUtil from '../util/WWUtil';
        

        // This is an internal class and is intentionally not documented.
        var WmtsLayerTile = function (sector, tileMatrix, row, column, imagePath) {
            this.sector = sector;
            this.tileMatrix = tileMatrix;
            this.row = row;
            this.column = column;
            this.imagePath = imagePath;

            this.texelSize = (sector.deltaLatitude() * Angle.DEGREES_TO_RADIANS) / tileMatrix.tileHeight;

            this.tileKey = tileMatrix.levelNumber.toString() + "." + row.toString() + "." + column.toString();

            this.gpuCacheKey = imagePath;
        };

        WmtsLayerTile.prototype.isEqual = function (that) {
            if (!that)
                return false;

            if (!that.tileKey)
                return false;

            return this.tileKey == that.tileKey;
        };

        WmtsLayerTile.prototype.distanceTo = function (vector) {
            if (!vector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "distanceTo", "missingVector"));
            }

            var px = vector[0], py = vector[1], pz = vector[2],
                dx, dy, dz,
                points = this.samplePoints,
                distance = Number.POSITIVE_INFINITY;

            for (var i = 0, len = points.length; i < len; i += 3) {
                dx = px - points[i];
                dy = py - points[i + 1];
                dz = pz - points[i + 2];
                distance = Math.min(distance, dx * dx + dy * dy + dz * dz); // minimum squared distance
            }

            return Math.sqrt(distance);
        };

        WmtsLayerTile.prototype.subdivide = function (tileMatrix, tileFactory) {
            if (!tileMatrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerTile", "subdivide",
                        "The specified tile matrix is null or undefined."));
            }

            if (!tileFactory) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerTile", "subdivide",
                        "The specified tile factory is null or undefined."));
            }

            var subRow,
                subCol,
                children = [],
                subFactorLat = tileMatrix.matrixHeight / this.tileMatrix.matrixHeight,
                subFactorLon = tileMatrix.matrixWidth / this.tileMatrix.matrixWidth;

            for (var i = 0; i < subFactorLat; i++) {
                for (var j = 0; j < subFactorLon; j++) {
                    subRow = subFactorLat * this.row + i;
                    subCol = subFactorLon * this.column + j;

                    children.push(tileFactory.createTile(tileMatrix, subRow, subCol));
                }
            }

            return children;
        };

        WmtsLayerTile.prototype.subdivideToCache = function (tileMatrix, tileFactory, cache) {
            if (!tileMatrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "subdivideToCache",
                        "The specified tile matrix is null or undefined."));
            }

            if (!tileFactory) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Tile", "subdivideToCache",
                        "The specified tile factory is null or undefined."));
            }

            var childList = cache ? cache.entryForKey(this.tileKey) : null;
            if (!childList) {
                childList = this.subdivide(tileMatrix, tileFactory);
                if (childList && cache) {
                    cache.putEntry(this.tileKey, childList, childList.length);
                }
            }

            return childList;
        };

        WmtsLayerTile.prototype.mustSubdivide = function (dc, detailFactor) {
            var cellSize = dc.globe.equatorialRadius * this.texelSize,
                distance = this.distanceTo(dc.eyePoint),
                pixelSize = dc.pixelSizeAtDistance(distance);

            return cellSize > Math.max(detailFactor * pixelSize, 0.5);
        };

        WmtsLayerTile.prototype.update = function (dc) {
            var elevationTimestamp = dc.globe.elevationTimestamp(),
                verticalExaggeration = dc.verticalExaggeration,
                globeStateKey = dc.globeStateKey;

            if (this.updateTimestamp != elevationTimestamp
                || this.updateVerticalExaggeration != verticalExaggeration
                || this.updateGlobeStateKey != globeStateKey) {

                this.doUpdate(dc);
                dc.frameStatistics.incrementTileUpdateCount(1);

                // Set the geometry extent to the globe's elevation timestamp on which the geometry is based. This
                // ensures that the geometry timestamp can be reliably compared to the elevation timestamp in subsequent
                // frames.
                this.updateTimestamp = elevationTimestamp;
                this.updateVerticalExaggeration = verticalExaggeration;
                this.updateGlobeStateKey = globeStateKey;
            }
        };

        WmtsLayerTile.prototype.doUpdate = function (dc) {
            // Compute the minimum and maximum world coordinate height for this tile's sector by multiplying the minimum
            // and maximum elevations by the scene's vertical exaggeration. This ensures that the elevations to used
            // build the terrain are contained by this tile's extent. Use zero if the globe as no elevations in this
            // tile's sector.
            var globe = dc.globe,
                verticalExaggeration = dc.verticalExaggeration,
                extremes = globe.minAndMaxElevationsForSector(this.sector),
                minHeight = extremes[0] * verticalExaggeration,
                maxHeight = extremes[1] * verticalExaggeration;

            if (minHeight === maxHeight) {
                minHeight = maxHeight + 10; // TODO: Determine if this is necessary.
            }

            // Compute a bounding box for this tile that contains the terrain surface in the tile's coverage area.
            if (!this.extent) {
                this.extent = new BoundingBox();
            }
            this.extent.setToSector(this.sector, globe, minHeight, maxHeight);

            // Compute the cartesian points for a 3x3 geographic grid. This grid captures sufficiently close sample
            // points in order to estimate the distance from the viewer to this tile.
            if (!this.samplePoints) {
                this.sampleElevations = new Float64Array(9);
                this.samplePoints = new Float64Array(3 * this.sampleElevations.length);
            }
            WWUtil.fillArray(this.sampleElevations, 0.5 * (minHeight + maxHeight));
            globe.computePointsForGrid(this.sector, 3, 3, this.sampleElevations, Vec3.ZERO, this.samplePoints);

            // Compute the reference point used as a local coordinate origin for the tile.
            if (!this.referencePoint) {
                this.referencePoint = new Vec3(0, 0, 0);
            }

            globe.computePointFromPosition(this.sector.centroidLatitude(), this.sector.centroidLongitude(), 0,
                this.referencePoint);
        };

        WmtsLayerTile.prototype.bind = function (dc) {
            var texture = dc.gpuResourceCache.resourceForKey(this.gpuCacheKey);

            if (texture && texture.bind(dc)) {
                return true;
            }

            if (this.fallbackTile) {
                return this.fallbackTile.bind(dc);
            }

            return false;
        };

        WmtsLayerTile.prototype.applyInternalTransform = function (dc, matrix) {
            // This type of tile does not apply an internal transform.
        };

        export default WmtsLayerTile;
    