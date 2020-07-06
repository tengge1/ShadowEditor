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

import Location from '../../geom/Location';
import Position from '../../geom/Position';


/**
 * Provides utilities for Measurements.
 * @exports MeasurerUtils
 */
var MeasurerUtils = {

    /**
     * Subdivide a list of positions so that no segment is longer then the provided maxLength.
     * <p>If needed, new intermediate positions will be created along lines that follow the given pathType one
     * of WorldWind.LINEAR, WorldWind.RHUMB_LINE or WorldWind.GREAT_CIRCLE.
     * All position elevations will be either at the terrain surface if followTerrain is true, or interpolated
     * according to the original elevations.</p>
     *
     * @param {Globe} globe
     * @param {Position[]} positions
     * @param {Boolean} followTerrain
     * @param {String} pathType One of WorldWind.LINEAR, WorldWind.RHUMB_LINE or WorldWind.GREAT_CIRCLE
     * @param {Number} maxLength The maximum length for one segment
     *
     * @return {Position[]} a list of positions with no segment longer then maxLength and elevations following
     * terrain or not.
     */
    subdividePositions: function (globe, positions, followTerrain, pathType, maxLength) {
        var subdividedPositions = [];
        var loc = new Location(0, 0);
        var destLatLon = new Location(0, 0);
        var pos1 = positions[0];
        var elevation;

        this.addPosition(globe, subdividedPositions, pos1, followTerrain);

        for (var i = 1; i < positions.length; i++) {
            var pos2 = positions[i];
            var arcLengthRadians = Location.greatCircleDistance(pos1, pos2);
            loc = Location.interpolateAlongPath(pathType, 0.5, pos1, pos2, loc);
            var arcLength = arcLengthRadians * globe.radiusAt(loc.latitude, loc.longitude);
            if (arcLength > maxLength) {
                // if necessary subdivide segment at regular intervals smaller then maxLength
                var segmentAzimuth = null;
                var segmentDistance = null;
                var steps = Math.ceil(arcLength / maxLength); // number of intervals - at least two
                for (var j = 1; j < steps; j++) {
                    var s = j / steps;
                    if (pathType === WorldWind.LINEAR) {
                        destLatLon = Location.interpolateLinear(s, pos1, pos2, destLatLon);
                    }
                    else if (pathType === WorldWind.RHUMB_LINE) {
                        if (segmentAzimuth == null) {
                            segmentAzimuth = Location.rhumbAzimuth(pos1, pos2);
                            segmentDistance = Location.rhumbDistance(pos1, pos2);
                        }
                        destLatLon = Location.rhumbLocation(pos1, segmentAzimuth, s * segmentDistance,
                            destLatLon);
                    }
                    else {
                        //GREAT_CIRCLE
                        if (segmentAzimuth == null) {
                            segmentAzimuth = Location.greatCircleAzimuth(pos1, pos2); //degrees
                            segmentDistance = Location.greatCircleDistance(pos1, pos2); //radians
                        }
                        //Location, degrees, radians, Location
                        destLatLon = Location.greatCircleLocation(pos1, segmentAzimuth, s * segmentDistance,
                            destLatLon);
                    }

                    // Set elevation
                    if (followTerrain) {
                        elevation = globe.elevationAtLocation(destLatLon.latitude, destLatLon.longitude);
                    }
                    else {
                        elevation = pos1.altitude * (1 - s) + pos2.altitude * s;
                    }

                    subdividedPositions.push(new Position(destLatLon.latitude, destLatLon.longitude, elevation));
                }
            }

            // Finally add the segment end position
            this.addPosition(globe, subdividedPositions, pos2, followTerrain);

            // Prepare for next segment
            pos1 = pos2;
        }

        return subdividedPositions;
    },

    /**
     * Adds a position to a list of positions.
     * If the path is following the terrain the elevation is also computed.
     *
     * @param {Globe} globe
     * @param {Position[]} positions The list of positions to add to
     * @param {Position} position The position to add to the list
     * @param {Boolean} followTerrain
     *
     * @return {Position[]} The list of positions
     */
    addPosition: function (globe, positions, position, followTerrain) {
        var elevation = position.altitude;
        if (followTerrain) {
            elevation = globe.elevationAtLocation(position.latitude, position.longitude);
        }
        positions.push(new Position(position.latitude, position.longitude, elevation));
        return positions;
    },

    /**
     * Determines whether a location is located inside a given polygon.
     *
     * @param {Location} location
     * @param {Location[]}locations The list of positions describing the polygon.
     * Last one should be the same as the first one.
     *
     * @return {Boolean} true if the location is inside the polygon.
     */
    isLocationInside: function (location, locations) {
        var result = false;
        var p1 = locations[0];
        for (var i = 1, len = locations.length; i < len; i++) {
            var p2 = locations[i];
            if ((p2.latitude <= location.latitude && location.latitude < p1.latitude ||
                p1.latitude <= location.latitude && location.latitude < p2.latitude) &&
                location.longitude < (p1.longitude - p2.longitude) * (location.latitude - p2.latitude) /
                    (p1.latitude - p2.latitude) + p2.longitude) {
                result = !result;
            }
            p1 = p2;
        }
        return result;
    },

    /**
     * Computes the angle between two Vec3 in radians.
     *
     * @param {Vec3} v1
     * @param {Vec3} v2
     *
     * @return {Number} The ange in radians
     */
    angleBetweenVectors: function (v1, v2) {
        var dot = v1.dot(v2);
        // Compute the sum of magnitudes.
        var length = v1.magnitude() * v2.magnitude();
        // Normalize the dot product, if necessary.
        if (!(length === 0) && length !== 1.0) {
            dot /= length;
        }

        // The normalized dot product should be in the range [-1, 1]. Otherwise the result is an error from
        // floating point roundoff. So if dot is less than -1 or greater than +1, we treat it as -1 and +1
        // respectively.
        if (dot < -1.0) {
            dot = -1.0;
        }
        else if (dot > 1.0) {
            dot = 1.0;
        }

        // Angle is arc-cosine of normalized dot product.
        return Math.acos(dot);
    }

};

export default MeasurerUtils;

