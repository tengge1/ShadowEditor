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

import HashMap from './HashMap';
import Location from '../geom/Location';
import Position from '../geom/Position';
import WWMath from './WWMath';


/**
 * Splits polygons that cross the anti-meridian and/or contain a pole.
 * @exports PolygonSplitter
 */

var PolygonSplitter = {

    //Internal
    //Keeps track of the index of added points so that no point is duplicated
    addedIndex: -1,

    //Internal
    //The index where pole insertion began
    poleIndexOffset: -1,

    /**
     * Splits an array of polygons that cross the anti-meridian or contain a pole.
     *
     * @param {Array} contours an array of arrays of Locations or Positions
     * Each array entry defines one of this polygon's boundaries.
     * @param {Array} resultContours an empty array to put the result of the split. Each element will have the
     * shape of PolygonSplitter.formatContourOutput
     * @returns {Boolean} true if one of the boundaries crosses the anti-meridian otherwise false
     * */
    splitContours: function (contours, resultContours) {
        var doesCross = false;

        for (var i = 0, len = contours.length; i < len; i++) {
            var contourInfo = this.splitContour(contours[i]);
            if (contourInfo.polygons.length > 1) {
                doesCross = true;
            }
            resultContours.push(contourInfo);
        }

        return doesCross;
    },

    /**
     * Splits a polygon that cross the anti-meridian or contain a pole.
     *
     * @param {Location[] | Position[]} points an array of Locations or Positions that define a polygon
     * @returns {Object} @see PolygonSplitter.formatContourOutput
     * */
    splitContour: function (points) {
        var iMap = new HashMap();
        var newPoints = [];
        var intersections = [];
        var polygons = [];
        var iMaps = [];
        var poleIndex = -1;

        var pole = this.findIntersectionAndPole(points, newPoints, intersections, iMap);

        if (intersections.length === 0) {
            polygons.push(newPoints);
            iMaps.push(iMap);
            return this.formatContourOutput(polygons, pole, poleIndex, iMaps);
        }

        if (intersections.length > 2) {
            intersections.sort(function (a, b) {
                return b.latitude - a.latitude;
            });
        }

        if (pole !== Location.poles.NONE) {
            newPoints = this.handleOnePole(newPoints, intersections, iMap, pole);
            iMap = this.reindexIntersections(intersections, iMap, this.poleIndexOffset);
        }
        if (intersections.length === 0) {
            polygons.push(newPoints);
            iMaps.push(iMap);
            poleIndex = 0;
            return this.formatContourOutput(polygons, pole, poleIndex, iMaps);
        }

        this.linkIntersections(intersections, iMap);

        poleIndex = this.makePolygons(newPoints, intersections, iMap, polygons, iMaps);

        return this.formatContourOutput(polygons, pole, poleIndex, iMaps);
    },

    /**
     * Internal. Applications should not call this method.
     * Finds the intersections with the anti-meridian and if the polygon contains one of the poles.
     * A new polygon is constructed with the intersections and pole points and stored in newPoints
     *
     * @param {Location[] | Position[]} points An array of Locations or Positions that define a polygon
     * @param {Location[] | Position[]} newPoints An empty array where to store the resulting polygon with intersections
     * @param {Array} intersections An empty array where to store the intersection latitude and index
     * @param {HashMap} iMap A hashMap to store intersection data
     * The key is the index in the newPoints array and value is PolygonSplitter.makeIntersectionEntry
     * @returns {Number} The pole number @see Location.poles
     * */
    findIntersectionAndPole: function (points, newPoints, intersections, iMap) {
        var containsPole = false;
        var minLatitude = 90.0;
        var maxLatitude = -90.0;
        this.addedIndex = -1;

        for (var i = 0, lenC = points.length; i < lenC; i++) {
            var pt1 = points[i];
            var pt2 = points[(i + 1) % lenC];

            minLatitude = Math.min(minLatitude, pt1.latitude);
            maxLatitude = Math.max(maxLatitude, pt1.latitude);

            var doesCross = Location.locationsCrossDateLine([pt1, pt2]);
            if (doesCross) {
                containsPole = !containsPole;

                var iLatitude = Location.meridianIntersection(pt1, pt2, 180);
                if (iLatitude === null) {
                    iLatitude = (pt1.latitude + pt2.latitude) / 2;
                }
                var iLongitude = WWMath.signum(pt1.longitude) * 180 || 180;

                var iLoc1 = this.createPoint(iLatitude, iLongitude, pt1.altitude);
                var iLoc2 = this.createPoint(iLatitude, -iLongitude, pt2.altitude);

                this.safeAdd(newPoints, pt1, i, lenC);

                var index = newPoints.length;
                iMap.set(index, this.makeIntersectionEntry(index));
                iMap.set(index + 1, this.makeIntersectionEntry(index + 1));
                intersections.push({
                    indexEnd: index,
                    indexStart: index + 1,
                    latitude: iLatitude
                });

                newPoints.push(iLoc1);
                newPoints.push(iLoc2);

                this.safeAdd(newPoints, pt2, i + 1, lenC);
            }
            else {
                this.safeAdd(newPoints, pt1, i, lenC);
                this.safeAdd(newPoints, pt2, i + 1, lenC);
            }
        }

        var pole = Location.poles.NONE;
        if (containsPole) {
            pole = this.determinePole(minLatitude, maxLatitude);
        }

        return pole;
    },

    /**
     * Internal. Applications should not call this method.
     * Determine which pole is enclosed. If the shape is entirely in one hemisphere, then assume that it encloses
     * the pole in that hemisphere. Otherwise, assume that it encloses the pole that is closest to the shape's
     * extreme latitude.
     * @param {Number} minLatitude The minimum latitude of a polygon that contains a pole
     * @param {Number} maxLatitude The maximum latitude of a polygon that contains a pole
     * @returns {Number} The pole number @see Location.poles
     * */
    determinePole: function (minLatitude, maxLatitude) {
        var pole;
        if (minLatitude > 0) {
            pole = Location.poles.NORTH; // Entirely in Northern Hemisphere.
        }
        else if (maxLatitude < 0) {
            pole = Location.poles.SOUTH; // Entirely in Southern Hemisphere.
        }
        else if (Math.abs(maxLatitude) >= Math.abs(minLatitude)) {
            pole = Location.poles.NORTH; // Spans equator, but more north than south.
        }
        else {
            pole = Location.poles.SOUTH; // Spans equator, but more south than north.
        }
        return pole;
    },

    /**
     * Internal. Applications should not call this method.
     * Creates a new array of points containing the two pole locations on both sides of the anti-meridian
     *
     * @param {Location[] | Position[]} points
     * @param {Array} intersections
     * @param {HashMap} iMap
     * @param {Number} pole
     * @return {Object} an object containing the new points and a new reIndexed iMap
     * */
    handleOnePole: function (points, intersections, iMap, pole) {
        var pointsClone;

        if (pole === Location.poles.NORTH) {
            var intersection = intersections.shift();
            var poleLat = 90;
        }
        else if (pole === Location.poles.SOUTH) {
            intersection = intersections.pop();
            poleLat = -90;
        }

        var iEnd = iMap.get(intersection.indexEnd);
        var iStart = iMap.get(intersection.indexStart);
        iEnd.forPole = true;
        iStart.forPole = true;

        this.poleIndexOffset = intersection.indexStart;

        pointsClone = points.slice(0, intersection.indexEnd + 1);
        var polePoint1 = this.createPoint(poleLat, points[iEnd.index].longitude, points[iEnd.index].altitude);
        var polePoint2 = this.createPoint(poleLat, points[iStart.index].longitude, points[iStart.index].altitude);
        pointsClone.push(polePoint1, polePoint2);
        pointsClone = pointsClone.concat(points.slice(this.poleIndexOffset));

        return pointsClone;
    },

    /**
     * Internal. Applications should not call this method.
     * Links adjacents pairs of intersection by index
     * @param {Array} intersections
     * @param {HashMap} iMap
     * */
    linkIntersections: function (intersections, iMap) {
        for (var i = 0; i < intersections.length - 1; i += 2) {
            var i0 = intersections[i];
            var i1 = intersections[i + 1];

            var iEnd0 = iMap.get(i0.indexEnd);
            var iStart0 = iMap.get(i0.indexStart);
            var iEnd1 = iMap.get(i1.indexEnd);
            var iStart1 = iMap.get(i1.indexStart);

            iEnd0.linkTo = i1.indexStart;
            iStart0.linkTo = i1.indexEnd;
            iEnd1.linkTo = i0.indexStart;
            iStart1.linkTo = i0.indexEnd;
        }
    },

    /**
     * Internal. Applications should not call this method.
     * ReIndexes the intersections due to the poles being added to the array of points
     * @param {Array} intersections
     * @param {HashMap} iMap
     * @param {Number} indexOffset the index from which to start reIndexing
     * @returns {HashMap} a new hash map with the correct indices
     * */
    reindexIntersections: function (intersections, iMap, indexOffset) {
        iMap = HashMap.reIndex(iMap, indexOffset, 2);

        for (var i = 0, len = intersections.length; i < len; i++) {
            if (intersections[i].indexEnd >= indexOffset) {
                intersections[i].indexEnd += 2;
            }
            if (intersections[i].indexStart >= indexOffset) {
                intersections[i].indexStart += 2;
            }
        }

        return iMap;
    },

    /**
     * Internal. Applications should not call this method.
     * @param {Location[] | Position[]} points
     * @param {Array} intersections
     * @param {HashMap} iMap
     * @param {Array} polygons an empty array to store the resulting polygons
     * @param {HashMap[]} iMaps an empty array to store the resulting hasp maps for each polygon
     * @returns {Number} the pole number @see Location.poles
     * */
    makePolygons: function (points, intersections, iMap, polygons, iMaps) {
        var poleIndex = -1;
        for (var i = 0; i < intersections.length - 1; i += 2) {
            var i0 = intersections[i];
            var i1 = intersections[i + 1];

            var start = i0.indexStart;
            var end = i1.indexEnd;
            var polygon = [];
            var polygonHashMap = new HashMap();
            var containsPole = this.makePolygon(start, end, points, iMap, polygon, polygonHashMap);
            if (polygon.length) {
                polygons.push(polygon);
                iMaps.push(polygonHashMap);
                if (containsPole) {
                    poleIndex = polygons.length - 1;
                }
            }

            start = i1.indexStart;
            end = i0.indexEnd;
            polygon = [];
            polygonHashMap = new HashMap();
            containsPole = this.makePolygon(start, end, points, iMap, polygon, polygonHashMap);
            if (polygon.length) {
                polygons.push(polygon);
                iMaps.push(polygonHashMap);
                if (containsPole) {
                    poleIndex = polygons.length - 1;
                }
            }
        }

        return poleIndex;
    },

    /**
     * Internal. Applications should not call this method.
     * Paths from a start intersection index to an end intersection index and makes a polygon and a hashMap
     * with the intersection indices
     * @param {Number} start the index of a start type intersection
     * @param {Number} end the index of an end type intersection
     * @param {Location[] | Position[]} points
     * @param {HashMap} iMap
     * @param {Location[] | Position[]} resultPolygon an empty array to store the resulting polygon
     * @param {HashMap} polygonHashMap a hash map to record the indices of the intersections in the polygon
     * @returns {Boolean} true if the polygon contains a pole
     * */
    makePolygon: function (start, end, points, iMap, resultPolygon, polygonHashMap) {
        var pass = false;
        var len = points.length;
        var containsPole = false;

        if (end < start) {
            end += len;
        }

        for (var i = start; i <= end; i++) {
            var idx = i % len;
            var pt = points[idx];
            var intersection = iMap.get(idx);

            if (intersection) {
                if (intersection.visited) {
                    break;
                }

                resultPolygon.push(pt);
                polygonHashMap.set(resultPolygon.length - 1, intersection);

                if (intersection.forPole) {
                    containsPole = true;
                }
                else {
                    if (pass) {
                        i = intersection.linkTo - 1;
                        if (i + 1 === start) {
                            break;
                        }
                    }
                    pass = !pass;
                    intersection.visited = true;
                }
            }
            else {
                resultPolygon.push(pt);
            }
        }

        return containsPole;
    },

    /**
     * Internal. Applications should not call this method.
     * Adds an element to an array preventing duplication
     * @param {Location[] | Position[]} points
     * @param {Location | Position} point
     * @param {Number} index The index of the Point from the source array
     * @param {Number} len The length of the source array
     * */
    safeAdd: function (points, point, index, len) {
        if (this.addedIndex < index && this.addedIndex < len - 1) {
            points.push(point);
            this.addedIndex = index;
        }
    },

    /**
     * Internal. Applications should not call this method.
     * Creates a Location or a Position
     * @param {Number} latitude
     * @param {Number} longitude
     * @param {Number} altitude
     * @returns Location | Position
     * */
    createPoint: function (latitude, longitude, altitude) {
        if (altitude == null) {
            return new Location(latitude, longitude);
        }
        return new Position(latitude, longitude, altitude);
    },

    /**
     * Internal. Applications should not call this method.
     * @param {Array} polygons an array of arrays of Locations or Positions
     * @param {Number} pole the pole number @see Location.poles
     * @param {Number} poleIndex the index of the polygon containing the pole
     * @param {HashMap[]} iMaps an array of hash maps for each polygon
     * */
    formatContourOutput: function (polygons, pole, poleIndex, iMaps) {
        return {
            polygons: polygons,
            pole: pole,
            poleIndex: poleIndex,
            iMap: iMaps
        };
    },

    /**
     * Internal. Applications should not call this method.
     * @param {Number} index the index of the intersection in the array of points
     * */
    makeIntersectionEntry: function (index) {
        if (index == null) {
            index = -1;
        }
        return {
            visited: false,
            forPole: false,
            index: index,
            linkTo: -1
        }
    }
};

export default PolygonSplitter;


