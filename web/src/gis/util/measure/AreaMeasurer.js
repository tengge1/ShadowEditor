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
 * @exports AreaMeasurer
 */

import Angle from '../../geom/Angle';
import ArgumentError from '../../error/ArgumentError';
import Location from '../../geom/Location';
import Logger from '../Logger';
import MeasurerUtils from './MeasurerUtils';
import Sector from '../../geom/Sector';
import Vec3 from '../../geom/Vec3';
import libtessDummy from '../libtess';


/**
 * Utility class to compute approximations of projected and surface (terrain following) area on a globe.
 *
 * <p>To properly compute surface area the measurer must be provided with a list of positions that describe a
 * closed path - one which last position is equal to the first.</p>
 *
 * <p>Segments which are longer then the current maxSegmentLength will be subdivided along lines following the
 * current pathType - WorldWind.LINEAR, WorldWind.RHUMB_LINE or WorldWind.GREAT_CIRCLE.</p>
 *
 * <p>Projected or non terrain following area is computed in a sinusoidal projection which is equivalent or
 * equal area.
 * Surface or terrain following area is approximated by sampling the path bounding sector with square cells
 * along a grid. Cells which center is inside the path  have their area estimated and summed according to the
 * overall slope at the cell south-west corner.</p>
 *
 * @alias AreaMeasurer
 * @constructor
 * @param {WorldWindow} wwd The WorldWindow associated with AreaMeasurer.
 * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
 */
function AreaMeasurer(wwd) {
    if (!wwd) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "AreaMeasurer", "constructor", "missingWorldWindow"));
    }

    this.wwd = wwd;

    // Private. Sampling grid max rows or cols
    this.DEFAULT_AREA_SAMPLING_STEPS = 32;

    // Private. Documentation is with the defined property below.
    this._areaTerrainSamplingSteps = this.DEFAULT_AREA_SAMPLING_STEPS;

    // Private. Documentation is with the defined property below.
    this._maxSegmentLength = 100e3;

    // Private. A list of positions with no segment longer then maxLength and elevations following terrain or not.
    this.subdividedPositions = null;

    // Private.
    this.vecZ = new Vec3(0, 0, 1);

    // Private. Reusable Location.
    this.scratchLocation = new Location(0, 0);

}

Object.defineProperties(AreaMeasurer.prototype, {
    /**
     * The sampling grid maximum number of rows or columns for terrain following surface area approximation.
     * @type {Number}
     * @memberof AreaMeasurer.prototype
     */
    areaTerrainSamplingSteps: {
        get: function () {
            return this._areaTerrainSamplingSteps;
        },
        set: function (value) {
            this._areaTerrainSamplingSteps = value;
        }
    },

    /**
     * The maximum length a segment can have before being subdivided along a line following the current pathType.
     * @type {Number}
     * @memberof AreaMeasurer.prototype
     */
    maxSegmentLength: {
        get: function () {
            return this._maxSegmentLength;
        },
        set: function (value) {
            this._maxSegmentLength = value;
        }
    }
});

/**
 * Get the sampling grid maximum number of rows or columns for terrain following surface area approximation.
 *
 * @param {Position[]} positions A list of positions describing a polygon
 * @param {Boolean} followTerrain If true, the computed length will account for terrain deformations as if
 * someone was walking along that path
 * @param {String} pathType One of WorldWind.LINEAR, WorldWind.RHUMB_LINE or WorldWind.GREAT_CIRCLE
 *
 * @return {Number} area in square meters
 */
AreaMeasurer.prototype.getArea = function (positions, followTerrain, pathType) {
    var globe = this.wwd.globe;
    if (followTerrain) {
        return this.computeSurfaceAreaSampling(globe, positions, pathType);
    }
    return this.computeProjectedAreaGeometry(globe, positions, pathType);
};

/**
 * Sample the path bounding sector with square cells which area are approximated according to the surface normal
 * at the cell south-west corner.
 *
 * @param {Globe} globe
 * @param {Position[]} positions
 * @param {String} pathType One of WorldWind.LINEAR, WorldWind.RHUMB_LINE or WorldWind.GREAT_CIRCLE
 *
 * @return {Number} area in square meters
 */
AreaMeasurer.prototype.computeSurfaceAreaSampling = function (globe, positions, pathType) {
    var sector = new Sector(0, 0, 0, 0);
    sector.setToBoundingSector(positions);

    // Subdivide long segments if needed
    this.subdividedPositions = MeasurerUtils.subdividePositions(globe, positions, true, pathType,
        this._maxSegmentLength);

    // Sample the bounding sector with cells about the same length in side - squares
    var steps = Math.max(this.DEFAULT_AREA_SAMPLING_STEPS, this._areaTerrainSamplingSteps);
    var deltaLatRadians = sector.deltaLatitude() * Angle.DEGREES_TO_RADIANS;
    var deltaLonRadians = sector.deltaLongitude() * Angle.DEGREES_TO_RADIANS;
    var stepsRadians = Math.max(deltaLatRadians / steps, deltaLonRadians / steps);
    var latSteps = Math.round(deltaLatRadians / stepsRadians);
    var lonSteps = Math.round(deltaLonRadians / stepsRadians *
        Math.cos(sector.centroidLatitude() * Angle.DEGREES_TO_RADIANS));
    var latStepRadians = deltaLatRadians / latSteps;
    var lonStepRadians = deltaLonRadians / lonSteps;

    var area = 0;
    for (var i = 0; i < latSteps; i++) {
        var lat = sector.minLatitude * Angle.DEGREES_TO_RADIANS + latStepRadians * i;
        // Compute this latitude row cells area
        var radius = globe.radiusAt((lat + latStepRadians / 2) * Angle.RADIANS_TO_DEGREES, sector.centroidLongitude());
        var cellWidth = lonStepRadians * radius * Math.cos(lat + latStepRadians / 2);
        var cellHeight = latStepRadians * radius;
        var cellArea = cellWidth * cellHeight;

        for (var j = 0; j < lonSteps; j++) {
            var lon = sector.minLongitude * Angle.DEGREES_TO_RADIANS + lonStepRadians * j;
            var minLat = lat * Angle.RADIANS_TO_DEGREES;
            var maxLat = (lat + latStepRadians) * Angle.RADIANS_TO_DEGREES;
            var minLon = lon * Angle.RADIANS_TO_DEGREES;
            var maxLon = (lon + lonStepRadians) * Angle.RADIANS_TO_DEGREES;
            var cellSector = new Sector(minLat, maxLat, minLon, maxLon);
            var isLocationInside = MeasurerUtils.isLocationInside(cellSector.centroid(this.scratchLocation),
                this.subdividedPositions);
            if (isLocationInside) {
                // Compute suface area using terrain normal in SW corner
                // Corners elevation
                var eleSW = globe.elevationAtLocation(minLat, minLon);
                var eleSE = globe.elevationAtLocation(minLat, maxLon);
                var eleNW = globe.elevationAtLocation(maxLat, minLon);

                // Compute normal
                var vx = new Vec3(cellWidth, 0, eleSE - eleSW);
                var vy = new Vec3(0, cellHeight, eleNW - eleSW);
                vx.normalize();
                vy.normalize();
                var normalSW = vx.cross(vy).normalize(); // point toward positive Z

                // Compute slope factor
                var tan = Math.tan(MeasurerUtils.angleBetweenVectors(this.vecZ, normalSW));
                var slopeFactor = Math.sqrt(1 + tan * tan);

                // Add cell area
                area += cellArea * slopeFactor;
            }
        }
    }

    return area;
};

/**
 * Tessellate the path in lat-lon space, then sum each triangle area.
 *
 * @param {Globe} globe
 * @param {Position[]} positions
 * @param {String} pathType One of WorldWind.LINEAR, WorldWind.RHUMB_LINE or WorldWind.GREAT_CIRCLE
 *
 * @return {Number} area in square meters
 */
AreaMeasurer.prototype.computeProjectedAreaGeometry = function (globe, positions, pathType) {

    // Subdivide long segments if needed
    this.subdividedPositions = MeasurerUtils.subdividePositions(globe, positions, false, pathType,
        this._maxSegmentLength);

    // First: tessellate polygon
    var verticesCount = this.subdividedPositions.length;
    var firstPos = this.subdividedPositions[0];
    var lastPos = this.subdividedPositions[verticesCount - 1];
    if (firstPos.equals(lastPos)) {
        verticesCount--;
    }

    var verts = [];
    var idx = 0;
    for (var i = 0; i < verticesCount; i++) {
        var pos = this.subdividedPositions[i];
        verts[idx++] = pos.longitude * Angle.DEGREES_TO_RADIANS;
        verts[idx++] = pos.latitude * Angle.DEGREES_TO_RADIANS;
        verts[idx++] = 0;
    }

    var triangles = this.tessellatePolygon(verticesCount, verts);

    // Second: sum triangles area
    var area = 0;
    var triangleCount = triangles.length / 9;
    for (i = 0; i < triangleCount; i++) {
        idx = i * 9;
        var triangle = [
            triangles[idx + 0], triangles[idx + 1], triangles[idx + 2],
            triangles[idx + 3], triangles[idx + 4], triangles[idx + 5],
            triangles[idx + 6], triangles[idx + 7], triangles[idx + 8]
        ];
        area += this.computeTriangleProjectedArea(globe, triangle);
    }

    return area;

};

/**
 * Compute triangle area in a sinusoidal projection centered at the triangle center.
 * Note sinusoidal projection is equivalent or equal area.
 *
 * @param {Globe} globe
 * @param {Number[]} verts A list of 9 positions in radians describing a triangle
 *
 * @return {Number} area in square meters
 */
AreaMeasurer.prototype.computeTriangleProjectedArea = function (globe, verts) {
    // http://www.mathopenref.com/coordtrianglearea.html
    var ax = verts[0];
    var ay = verts[1];
    var bx = verts[3];
    var by = verts[4];
    var cx = verts[6];
    var cy = verts[7];

    var area = Math.abs(
        ax * (by - cy) +
        bx * (cy - ay) +
        cx * (ay - by)
    );
    area /= 2;

    var centerLon = (ax + bx + cx) / 3;
    var centerLat = (ay + by + cy) / 3;

    // Apply globe radius at triangle center and scale down area according to center latitude cosine
    var radius = globe.radiusAt(centerLat * Angle.RADIANS_TO_DEGREES, centerLon * Angle.RADIANS_TO_DEGREES);
    area *= Math.cos(centerLat) * radius * radius; // Square meter

    return area;
};

/**
 * Tessellate a Polygon
 *
 * @param {Number} count the number of vertices
 * @param {Number[]} vertices A list of positions in radians
 *
 * @return {Number[]} a list of tessellated vertices
 */
AreaMeasurer.prototype.tessellatePolygon = function (count, vertices) {
    var tess = new libtess.GluTesselator();
    var triangles = [];
    var coords;

    tess.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, function (prim) {
        if (prim !== libtess.primitiveType.GL_TRIANGLES) {
            Logger.logMessage(Logger.LEVEL_WARNING, "AreaMeasurer", "tessellatePolygon",
                "Tessellation error, primitive is not TRIANGLES.");
        }
    });

    tess.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, function (data, tris) {
        tris.push(data[0]);
        tris.push(data[1]);
        tris.push(data[2]);
    });

    //prevents triangle fans and strips
    tess.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, function () {
    });

    tess.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, function (errno) {
        Logger.logMessage(Logger.LEVEL_WARNING, "AreaMeasurer", "tessellatePolygon",
            "Tessellation error " + errno + ".");
    });

    // Tessellate the polygon.
    tess.gluTessBeginPolygon(triangles);
    tess.gluTessBeginContour();
    for (var i = 0; i < count; i++) {
        coords = vertices.slice(3 * i, 3 * i + 3);
        tess.gluTessVertex(coords, coords);
    }
    tess.gluTessEndContour();
    tess.gluTessEndPolygon();

    return triangles;
};

export default AreaMeasurer;

