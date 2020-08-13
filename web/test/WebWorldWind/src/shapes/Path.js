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
 * @exports Path
 */
import AbstractShape from '../shapes/AbstractShape';
import ArgumentError from '../error/ArgumentError';
import BasicTextureProgram from '../shaders/BasicTextureProgram';
import BoundingBox from '../geom/BoundingBox';
import Color from '../util/Color';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import PickedObject from '../pick/PickedObject';
import Position from '../geom/Position';
import ShapeAttributes from '../shapes/ShapeAttributes';
import SurfacePolyline from '../shapes/SurfacePolyline';
import Vec2 from '../geom/Vec2';
import Vec3 from '../geom/Vec3';


/**
 * Constructs a path.
 * @alias Path
 * @constructor
 * @augments AbstractShape
 * @classdesc Represents a line, curve or curtain between specified positions. The path is drawn between input
 * positions to achieve a specified path type, which can be one of the following:
 * <ul>
 *     <li>[WorldWind.GREAT_CIRCLE]{@link WorldWind#GREAT_CIRCLE}</li>
 *     <li>[WorldWind.RHUMB_LINE]{@link WorldWind#RHUMB_LINE}</li>
 *     <li>[WorldWind.LINEAR]{@link WorldWind#LINEAR}</li>
 * </ul>
 * <p>
 *     Paths conform to the terrain if the path's [followTerrain]{@link Path#followTerrain} property is true.
 * <p>
 *     Altitudes within the path's positions are interpreted according to the path's altitude mode, which
 *     can be one of the following:
 * <ul>
 *     <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
 *     <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
 *     <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
 * </ul>
 * If the latter, the path positions' altitudes are ignored.
 * <p>
 *     Paths have separate attributes for normal display and highlighted display. They use the interior and
 *     outline attributes of {@link ShapeAttributes} but do not use the image attributes.
 * <p>
 *     A path displays as a curtain if its [extrude]{@link Path#extrude} property is true. A curtain extends
 *     from the line formed by the path positions to the ground.
 * <p>
 *     This shape uses a {@link SurfacePolyline} when drawing on 2D globes and this shape's
 *     [useSurfaceShapeFor2D]{@link AbstractShape#useSurfaceShapeFor2D} is true.
 *
 * @param {Position[]} positions An array containing the path positions.
 * @param {ShapeAttributes} attributes The attributes to associate with this path. May be null, in which case
 * default attributes are associated.
 * @throws {ArgumentError} If the specified positions array is null or undefined.
 */
function Path(positions, attributes) {
    if (!positions) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Path", "constructor", "missingPositions"));
    }

    AbstractShape.call(this, attributes);

    // Private. Documentation is with the defined property below.
    this._positions = positions;

    // Private. Documentation is with the defined property below.
    this._pathType = WorldWind.GREAT_CIRCLE;

    // Private. Documentation is with the defined property below.
    this._terrainConformance = 10;

    // Private. Documentation is with the defined property below.
    this._numSubSegments = 10;

    this.referencePosition = this.determineReferencePosition(this._positions);

    this.scratchPoint = new Vec3(0, 0, 0); // scratch variable
}

Path.prototype = Object.create(AbstractShape.prototype);

Object.defineProperties(Path.prototype, {
    /**
     * This path's positions.
     * @type {Position[]}
     * @memberof Path.prototype
     */
    positions: {
        get: function () {
            return this._positions;
        },
        set: function (positions) {
            if (!positions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Path", "constructor", "missingPositions"));
            }

            this._positions = positions;
            this.referencePosition = this.determineReferencePosition(this._positions);
            this.reset();
        }
    },

    /**
     * Indicates whether this path should conform to the terrain.
     * @type {Boolean}
     * @default false
     * @memberof Path.prototype
     */
    followTerrain: {
        get: function () {
            return this._followTerrain;
        },
        set: function (followTerrain) {
            this._followTerrain = followTerrain;
            this.reset();
        }
    },

    /**
     * Specifies how accurately this path must adhere to the terrain when the path is terrain following. The value
     * specifies the maximum number of pixels between tessellation points. Lower values increase accuracy but decrease
     * performance.
     * @type {Number}
     * @default 10
     * @memberof Path.prototype
     */
    terrainConformance: {
        get: function () {
            return this._terrainConformance;
        },
        set: function (terrainConformance) {
            this._terrainConformance = terrainConformance;
            this.reset();
        }
    },

    /**
     * Specifies the number of segments used between specified positions to achieve this path's path type. Higher values
     * cause the path to conform more closely to the path type but decrease performance.
     * <p/>
     * Note: The sub-segments number is ignored when the path follows terrain or when the path type is
     * WorldWind.LINEAR.
     * @type {Number}
     * @default 10
     * @memberof Path.prototype
     */
    numSubSegments: {
        get: function () {
            return this._numSubSegments;
        },
        set: function (numSubSegments) {
            this._numSubSegments = numSubSegments >= 0 ? numSubSegments : 0;
            this.reset();
        }
    },

    /**
     * The type of path to follow when drawing the path. Recognized values are:
     * <ul>
     * <li>[WorldWind.GREAT_CIRCLE]{@link WorldWind#GREAT_CIRCLE}</li>
     * <li>[WorldWind.RHUMB_LINE]{@link WorldWind#RHUMB_LINE}</li>
     * <li>[WorldWind.LINEAR]{@link WorldWind#LINEAR}</li>
     * </ul>
     * @type {String}
     * @default WorldWind.GREAT_CIRCLE
     * @memberof Path.prototype
     */
    pathType: {
        get: function () {
            return this._pathType;
        },
        set: function (pathType) {
            this._pathType = pathType;
            this.reset();
        }
    },

    /**
     * Specifies whether to extrude this path to the ground by drawing a filled interior from the path to the
     * terrain. The filled interior uses this path's interior attributes.
     * @type {Boolean}
     * @default false
     * @memberof Path.prototype
     */
    extrude: {
        get: function () {
            return this._extrude;
        },
        set: function (extrude) {
            this._extrude = extrude;
            this.reset();
        }
    }
});

// Intentionally not documented.
Path.prototype.determineReferencePosition = function (positions) {
    // Assign the first position as the reference position.
    return positions.length > 0 ? positions[0] : null;
};

// Internal. Determines whether this shape's geometry must be re-computed.
Path.prototype.mustGenerateGeometry = function (dc) {
    if (!this.currentData.tessellatedPoints) {
        return true;
    }

    if (this.currentData.drawInterior !== this.activeAttributes.drawInterior
        || this.currentData.drawVerticals !== this.activeAttributes.drawVerticals) {
        return true;
    }

    if (!this.followTerrain && this.currentData.numSubSegments !== this.numSubSegments) {
        return true;
    }

    if (this.followTerrain && this.currentData.terrainConformance !== this.terrainConformance) {
        return true;
    }

    if (this.altitudeMode === WorldWind.ABSOLUTE) {
        return false;
    }

    return this.currentData.isExpired;
};

Path.prototype.createSurfaceShape = function () {
    return new SurfacePolyline(this.positions, null);
};

// Overridden from AbstractShape base class.
Path.prototype.doMakeOrderedRenderable = function (dc) {
    // A null reference position is a signal that there are no positions to render.
    if (!this.referencePosition) {
        return null;
    }

    // See if the current shape data can be re-used.
    if (!this.mustGenerateGeometry(dc)) {
        return this;
    }

    // Set the transformation matrix to correspond to the reference position.
    var refPt = this.currentData.referencePoint;
    dc.surfacePointForMode(this.referencePosition.latitude, this.referencePosition.longitude,
        this.referencePosition.altitude, this._altitudeMode, refPt);
    this.currentData.transformationMatrix.setToTranslation(refPt[0], refPt[1], refPt[2]);

    // Tessellate the path in geographic coordinates.
    var tessellatedPositions = this.makeTessellatedPositions(dc);
    if (tessellatedPositions.length < 2) {
        return null;
    }

    // Convert the tessellated geographic coordinates to the Cartesian coordinates that will be rendered.
    var tessellatedPoints = this.computeRenderedPath(dc, tessellatedPositions);

    this.currentData.tessellatedPoints = tessellatedPoints;
    this.currentData.drawInterior = this.activeAttributes.drawInterior;
    this.currentData.drawVerticals = this.activeAttributes.drawVerticals;
    this.currentData.numSubSegments = this.numSubSegments;
    this.currentData.terrainConformance = this.terrainConformance;
    this.resetExpiration(this.currentData);
    this.currentData.fillVbo = true;

    // Create the extent from the Cartesian points. Those points are relative to this path's reference point, so
    // translate the computed extent to the reference point.
    if (!this.currentData.extent) {
        this.currentData.extent = new BoundingBox();
    }
    this.currentData.extent.setToPoints(tessellatedPoints);
    this.currentData.extent.translate(this.currentData.referencePoint);

    return this;
};

// Private. Intentionally not documented.
Path.prototype.makeTessellatedPositions = function (dc) {
    var tessellatedPositions = [],
        eyePoint = dc.eyePoint,
        showVerticals = this.mustDrawVerticals(dc),
        ptA = new Vec3(0, 0, 0),
        ptB = new Vec3(0, 0, 0),
        posA = this._positions[0],
        posB, eyeDistance, pixelSize;

    if (showVerticals) {
        this.currentData.verticalIndices = new Int16Array(this.positions.length * 2);
        this.currentData.verticalIndices[0] = 0;
        this.currentData.verticalIndices[1] = 1;
    }

    tessellatedPositions.push(posA);

    dc.surfacePointForMode(posA.latitude, posA.longitude, posA.altitude, this._altitudeMode, ptA);

    for (var i = 1, len = this._positions.length; i < len; i++) {
        posB = this._positions[i];
        dc.surfacePointForMode(posB.latitude, posB.longitude, posB.altitude, this._altitudeMode, ptB);
        eyeDistance = eyePoint.distanceTo(ptA);
        pixelSize = dc.pixelSizeAtDistance(eyeDistance);
        if (ptA.distanceTo(ptB) < pixelSize * 8 && this.altitudeMode !== WorldWind.ABSOLUTE) {
            tessellatedPositions.push(posB); // distance is short so no need for sub-segments
        } else {
            this.makeSegment(dc, posA, posB, ptA, ptB, tessellatedPositions);
        }

        posA = posB;
        ptA.copy(ptB);

        if (showVerticals) {
            var k = 2 * (tessellatedPositions.length - 1);
            this.currentData.verticalIndices[i * 2] = k;
            this.currentData.verticalIndices[i * 2 + 1] = k + 1;
        }
    }

    return tessellatedPositions;
};

// Private. Intentionally not documented.
Path.prototype.makeSegment = function (dc, posA, posB, ptA, ptB, tessellatedPositions) {
    var eyePoint = dc.eyePoint,
        pos = new Location(0, 0),
        height = 0,
        arcLength, segmentAzimuth, segmentDistance, s, p, distance;

    // If it's just a straight line and not terrain following, then the segment is just two points.
    if (this._pathType === WorldWind.LINEAR && !this._followTerrain) {
        if (!ptA.equals(ptB)) {
            tessellatedPositions.push(posB);
        }
        return;
    }

    // Compute the segment length.

    if (this._pathType === WorldWind.LINEAR) {
        segmentDistance = Location.linearDistance(posA, posB);
    } else if (this._pathType === WorldWind.RHUMB_LINE) {
        segmentDistance = Location.rhumbDistance(posA, posB);
    } else {
        segmentDistance = Location.greatCircleDistance(posA, posB);
    }

    if (this._altitudeMode !== WorldWind.CLAMP_TO_GROUND) {
        height = 0.5 * (posA.altitude + posB.altitude);
    }

    arcLength = segmentDistance * (dc.globe.equatorialRadius + height * dc.verticalExaggeration);

    if (arcLength <= 0) { // segment is 0 length
        return;
    }

    // Compute the azimuth to apply while tessellating the segment.

    if (this._pathType === WorldWind.LINEAR) {
        segmentAzimuth = Location.linearAzimuth(posA, posB);
    } else if (this._pathType === WorldWind.RHUMB_LINE) {
        segmentAzimuth = Location.rhumbAzimuth(posA, posB);
    } else {
        segmentAzimuth = Location.greatCircleAzimuth(posA, posB);
    }

    this.scratchPoint.copy(ptA);
    for (s = 0, p = 0; s < 1;) {
        if (this._followTerrain) {
            p += this._terrainConformance * dc.pixelSizeAtDistance(this.scratchPoint.distanceTo(eyePoint));
        } else {
            p += arcLength / this._numSubSegments;
        }

        // Stop adding intermediate positions when we reach the arc length, or the remaining distance is in
        // millimeters on Earth.
        if (arcLength < p || arcLength - p < 1e-9)
            break;

        s = p / arcLength;
        distance = s * segmentDistance;

        if (this._pathType === WorldWind.LINEAR) {
            Location.linearLocation(posA, segmentAzimuth, distance, pos);
        } else if (this._pathType === WorldWind.RHUMB_LINE) {
            Location.rhumbLocation(posA, segmentAzimuth, distance, pos);
        } else {
            Location.greatCircleLocation(posA, segmentAzimuth, distance, pos);
        }

        pos.altitude = (1 - s) * posA.altitude + s * posB.altitude;
        tessellatedPositions.push(new Position(pos.latitude, pos.longitude, pos.altitude));

        if (this._followTerrain) {
            // Compute a new reference point for eye distance.
            dc.surfacePointForMode(pos.latitude, pos.longitude, pos.altitude,
                WorldWind.CLAMP_TO_GROUND, this.scratchPoint);
        }
    }

    tessellatedPositions.push(posB);
};

// Private. Intentionally not documented.
Path.prototype.computeRenderedPath = function (dc, tessellatedPositions) {
    var capturePoles = this.mustDrawInterior(dc) || this.mustDrawVerticals(dc),
        eyeDistSquared = Number.MAX_VALUE,
        eyePoint = dc.eyePoint,
        numPoints = (capturePoles ? 2 : 1) * tessellatedPositions.length,
        tessellatedPoints = new Float32Array(numPoints * 3),
        stride = capturePoles ? 6 : 3,
        pt = new Vec3(0, 0, 0),
        altitudeMode, pos, k, dSquared;

    if (this._followTerrain && this.altitudeMode !== WorldWind.CLAMP_TO_GROUND) {
        altitudeMode = WorldWind.RELATIVE_TO_GROUND;
    } else {
        altitudeMode = this.altitudeMode;
    }

    for (var i = 0, len = tessellatedPositions.length; i < len; i++) {
        pos = tessellatedPositions[i];

        dc.surfacePointForMode(pos.latitude, pos.longitude, pos.altitude, altitudeMode, pt);

        dSquared = pt.distanceToSquared(eyePoint);
        if (dSquared < eyeDistSquared) {
            eyeDistSquared = dSquared;
        }

        pt.subtract(this.currentData.referencePoint);

        k = stride * i;
        tessellatedPoints[k] = pt[0];
        tessellatedPoints[k + 1] = pt[1];
        tessellatedPoints[k + 2] = pt[2];

        if (capturePoles) {
            dc.surfacePointForMode(pos.latitude, pos.longitude, 0, WorldWind.CLAMP_TO_GROUND, pt);

            dSquared = pt.distanceToSquared(eyePoint);
            if (dSquared < eyeDistSquared) {
                eyeDistSquared = dSquared;
            }

            pt.subtract(this.currentData.referencePoint);

            tessellatedPoints[k + 3] = pt[0];
            tessellatedPoints[k + 4] = pt[1];
            tessellatedPoints[k + 5] = pt[2];
        }
    }

    this.currentData.pointBufferHasExtrusionPoints = capturePoles;
    this.currentData.eyeDistance = Math.sqrt(eyeDistSquared);

    return tessellatedPoints;
};

// Private. Intentionally not documented.
Path.prototype.mustDrawInterior = function (dc) {
    return this.activeAttributes.drawInterior
        && this._extrude
        && this._altitudeMode !== WorldWind.CLAMP_TO_GROUND;
};

// Private. Intentionally not documented.
Path.prototype.mustDrawVerticals = function (dc) {
    return this.activeAttributes.drawOutline && this.activeAttributes.drawVerticals
        && this.altitudeMode !== WorldWind.CLAMP_TO_GROUND;
};

// Overridden from AbstractShape base class.
Path.prototype.doRenderOrdered = function (dc) {
    var gl = dc.currentGlContext,
        program = dc.currentProgram,
        currentData = this.currentData,
        numPoints = currentData.tessellatedPoints.length / 3,
        vboId, color, pickColor, stride, nPts;

    this.applyMvpMatrix(dc);

    if (!currentData.vboCacheKey) {
        currentData.vboCacheKey = dc.gpuResourceCache.generateCacheKey();
    }

    vboId = dc.gpuResourceCache.resourceForKey(currentData.vboCacheKey);
    if (!vboId) {
        vboId = gl.createBuffer();
        dc.gpuResourceCache.putResource(this.currentData.vboCacheKey, vboId,
            currentData.tessellatedPoints.length * 4);
        currentData.fillVbo = true;
    }

    // Bind and if necessary fill the VBO. We fill the VBO here rather than in doMakeOrderedRenderable so that
    // there's no possibility of the VBO being ejected from the cache between the time it's filled and
    // the time it's used.
    gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
    if (currentData.fillVbo) {
        gl.bufferData(gl.ARRAY_BUFFER, currentData.tessellatedPoints,
            gl.STATIC_DRAW);
        dc.frameStatistics.incrementVboLoadCount(1);
    }

    program.loadTextureEnabled(gl, false);

    if (dc.pickingMode) {
        pickColor = dc.uniquePickColor();
    }

    if (this.mustDrawInterior(dc)) {
        color = this.activeAttributes.interiorColor;
        // Disable writing the shape's fragments to the depth buffer when the interior is semi-transparent.
        gl.depthMask(color.alpha * this.layer.opacity >= 1 || dc.pickingMode);
        program.loadColor(gl, dc.pickingMode ? pickColor : color);
        program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity);

        gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, numPoints);
    }

    if (this.activeAttributes.drawOutline) {
        if (this.mustDrawVerticals(dc) && this.mustDrawInterior(dc)
            || this.altitudeMode === WorldWind.CLAMP_TO_GROUND) {
            // Make the verticals stand out from the interior, or the outline stand out from the terrain.
            this.applyMvpMatrixForOutline(dc);
        }

        color = this.activeAttributes.outlineColor;
        // Disable writing the shape's fragments to the depth buffer when the interior is semi-transparent.
        gl.depthMask(color.alpha * this.layer.opacity >= 1 || dc.pickingMode);
        program.loadColor(gl, dc.pickingMode ? pickColor : color);
        program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity);

        gl.lineWidth(this.activeAttributes.outlineWidth);

        if (this.currentData.pointBufferHasExtrusionPoints) {
            stride = 24;
            nPts = numPoints / 2;
        } else {
            stride = 12;
            nPts = numPoints;
        }

        gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, stride, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, nPts);

        if (this.mustDrawVerticals(dc)) {
            if (!currentData.verticalIndicesVboCacheKey) {
                currentData.verticalIndicesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
            }

            vboId = dc.gpuResourceCache.resourceForKey(currentData.verticalIndicesVboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(currentData.verticalIndicesVboCacheKey, vboId,
                    currentData.verticalIndices.length * 4);
                currentData.fillVbo = true;
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboId);
            if (currentData.fillVbo) {
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, currentData.verticalIndices,
                    gl.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
            }

            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
            gl.drawElements(gl.LINES, currentData.verticalIndices.length,
                gl.UNSIGNED_SHORT, 0);
        }
    }
    currentData.fillVbo = false;

    if (dc.pickingMode) {
        var po = new PickedObject(pickColor, this.pickDelegate ? this.pickDelegate : this, null, this.layer,
            false);
        dc.resolvePick(po);
    }
};

// Overridden from AbstractShape base class.
Path.prototype.beginDrawing = function (dc) {
    var gl = dc.currentGlContext;

    if (this.mustDrawInterior(dc)) {
        gl.disable(gl.CULL_FACE);
    }

    dc.findAndBindProgram(BasicTextureProgram);
    gl.enableVertexAttribArray(dc.currentProgram.vertexPointLocation);
};

// Overridden from AbstractShape base class.
Path.prototype.endDrawing = function (dc) {
    var gl = dc.currentGlContext;

    gl.disableVertexAttribArray(dc.currentProgram.vertexPointLocation);
    gl.depthMask(true);
    gl.lineWidth(1);
    gl.enable(gl.CULL_FACE);
};

export default Path;
