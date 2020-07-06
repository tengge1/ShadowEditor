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
 * @exports LengthMeasurer
 */

import ArgumentError from '../../error/ArgumentError';
import Location from '../../geom/Location';
import Logger from '../Logger';
import MeasurerUtils from './MeasurerUtils';
import Position from '../../geom/Position';
import Vec3 from '../../geom/Vec3';

/**
 * Utility class to measure length along a path on a globe. <p/> <p>Segments which are longer then the current
 * maxSegmentLength will be subdivided along lines following the current pathType - WorldWind.LINEAR,
 * WorldWind.RHUMB_LINE or WorldWind.GREAT_CIRCLE.</p> <p/> <p>For follow terrain, the computed length will
 * account for terrain deformations as if someone was walking along that path. Otherwise the length is the sum
 * of the cartesian distance between the positions.</p>
 * <p/>
 * <p>When following terrain the measurer will sample terrain elevations at regular intervals along the path.
 * The minimum number of samples used for the whole length can be set with lengthTerrainSamplingSteps.
 * However, the minimum sampling interval is 30 meters.
 * @alias LengthMeasurer
 * @constructor
 * @param {WorldWindow} wwd The WorldWindow associated with LengthMeasurer.
 * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
 */
function LengthMeasurer(wwd) {
    if (!wwd) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "LengthMeasurer", "constructor", "missingWorldWindow"));
    }

    this.wwd = wwd;

    // Private. The minimum length of a terrain following subdivision.
    this.DEFAULT_MIN_SEGMENT_LENGTH = 30;

    // Private. Documentation is with the defined property below.
    this._maxSegmentLength = 100e3;

    // Private. Documentation is with the defined property below.
    this._lengthTerrainSamplingSteps = 128;

    // Private. A list of positions with no segment longer then maxLength and elevations following terrain or not.
    this.subdividedPositions = null;
}

Object.defineProperties(LengthMeasurer.prototype, {
    /**
     * The maximum length a segment can have before being subdivided along a line following the current pathType.
     * @type {Number}
     * @memberof LengthMeasurer.prototype
     */
    maxSegmentLength: {
        get: function () {
            return this._maxSegmentLength;
        },
        set: function (value) {
            this._maxSegmentLength = value;
        }
    },

    /**
     * The number of terrain elevation samples used along the path to approximate it's terrain following length.
     * @type {Number}
     * @memberof LengthMeasurer.prototype
     */
    lengthTerrainSamplingSteps: {
        get: function () {
            return this._lengthTerrainSamplingSteps;
        },
        set: function (value) {
            this._lengthTerrainSamplingSteps = value;
        }
    }
});

/**
 * Get the path length in meter. <p/> <p>If followTerrain is true, the computed length will account
 * for terrain deformations as if someone was walking along that path. Otherwise the length is the sum of the
 * cartesian distance between each positions.</p>
 *
 * @param {Position[]} positions
 * @param {Boolean} followTerrain
 * @param {String} pathType One of WorldWind.LINEAR, WorldWind.RHUMB_LINE or WorldWind.GREAT_CIRCLE
 *
 * @return the current path length or -1 if the position list is too short.
 */
LengthMeasurer.prototype.getLength = function (positions, followTerrain, pathType) {
    pathType = pathType || WorldWind.GREAT_CIRCLE;
    this.subdividedPositions = null;
    return this.computeLength(positions, followTerrain, pathType);
};

/**
 * Get the path length in meter of a Path. <p/> <p>If the path's followTerrain is true, the computed length
 * will account for terrain deformations as if someone was walking along that path. Otherwise the length is the
 * sum of the cartesian distance between each positions.</p>
 *
 * @param {Path} path
 *
 * @return the current path length or -1 if the position list is too short.
 */
LengthMeasurer.prototype.getPathLength = function (path) {
    this.subdividedPositions = null;
    return this.computeLength(path.positions, path.followTerrain, path.pathType);
};

/**
 * Get the great circle, rhumb or linear distance, in meter, of a Path or an array of Positions.
 *
 * @param {Path|Position[]} path A Path or an array of Positions
 * @param {String} pathType Optional argument used when path is an array of Positions.
 * Defaults to WorldWind.GREAT_CIRCLE.
 * Recognized values are:
 * <ul>
 * <li>[WorldWind.GREAT_CIRCLE]{@link WorldWind#GREAT_CIRCLE}</li>
 * <li>[WorldWind.RHUMB_LINE]{@link WorldWind#RHUMB_LINE}</li>
 * <li>[WorldWind.LINEAR]{@link WorldWind#LINEAR}</li>
 * </ul>
 *
 * @return {Number} the current path length or -1 if the position list is too short.
 */
LengthMeasurer.prototype.getGeographicDistance = function (path, pathType) {
    if (path instanceof WorldWind.Path) {
        var positions = path.positions;
        var _pathType = path.pathType;
    }
    else if (Array.isArray(path)) {
        positions = path;
        _pathType = pathType || WorldWind.GREAT_CIRCLE;
    }

    if (!positions || positions.length < 2) {
        return -1;
    }

    var fn = Location.greatCircleDistance;
    if (_pathType === WorldWind.RHUMB_LINE) {
        fn = Location.rhumbDistance;
    }
    else if (_pathType === WorldWind.LINEAR) {
        fn = Location.linearDistance;
    }

    var distance = 0;
    for (var i = 0, len = positions.length - 1; i < len; i++) {
        var pos1 = positions[i];
        var pos2 = positions[i + 1];
        distance += fn(pos1, pos2);
    }

    return distance * this.wwd.globe.equatorialRadius;
};

/**
 * Computes the length.
 * @param {Position[]} positions
 * @param {Boolean} followTerrain
 * @param {String} pathType One of WorldWind.LINEAR, WorldWind.RHUMB_LINE or WorldWind.GREAT_CIRCLE
 */
LengthMeasurer.prototype.computeLength = function (positions, followTerrain, pathType) {
    if (!positions || positions.length < 2) {
        return -1;
    }

    var globe = this.wwd.globe;

    if (this.subdividedPositions == null) {
        // Subdivide path so as to have at least segments smaller then maxSegmentLength. If follow terrain,
        // subdivide so as to have at least lengthTerrainSamplingSteps segments, but no segments shorter then
        // DEFAULT_MIN_SEGMENT_LENGTH either.
        var maxLength = this._maxSegmentLength;
        if (followTerrain) {
            // Recurse to compute overall path length not following terrain
            var pathLength = this.computeLength(positions, false, pathType);
            // Determine segment length to have enough sampling points
            maxLength = pathLength / this._lengthTerrainSamplingSteps;
            maxLength = Math.min(Math.max(maxLength, this.DEFAULT_MIN_SEGMENT_LENGTH), this._maxSegmentLength);
        }
        this.subdividedPositions = MeasurerUtils.subdividePositions(globe, positions, followTerrain, pathType,
            maxLength);
    }

    var distance = 0;
    var pos0 = this.subdividedPositions[0];
    var p1 = new Vec3(0, 0, 0);
    var p2 = new Vec3(0, 0, 0);
    p1 = globe.computePointFromPosition(pos0.latitude, pos0.longitude, pos0.altitude, p1);
    for (var i = 1, len = this.subdividedPositions.length; i < len; i++) {
        var pos = this.subdividedPositions[i];
        p2 = globe.computePointFromPosition(pos.latitude, pos.longitude, pos.altitude, p2);
        distance += p1.distanceTo(p2);
        p1.copy(p2);
    }

    return distance;
};

export default LengthMeasurer;

