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
 * @exports ShapefileRecord
 */
import Angle from '../../geom/Angle';
import ArgumentError from '../../error/ArgumentError';
import ByteBuffer from '../../util/ByteBuffer';
import Location from '../../geom/Location';
import Logger from '../../util/Logger';
import Shapefile from '../../formats/shapefile/Shapefile';
        

        /**
         * Constructs a shapefile record. Applications typically do not call this constructor. It is called by
         * {@link Shapefile} as shapefile records are read.
         * @alias ShapefileRecord
         * @constructor
         * @classdesc Contains the data associated with a shapefile record.
         * @param {Shapefile} shapefile The shapefile containing this record.
         * @param {ByteBuffer} buffer The buffer descriptor of the shapefile record's contents.
         * @throws {ArgumentError} If either the specified shapefile or buffer are null or undefined.
         */
        var ShapefileRecord = function (shapefile, buffer) {
            if (!shapefile) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ShapefileRecord", "constructor",
                        "The specified shapefile is null or undefined"));
            }

            if (!buffer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ShapefileRecord", "constructor",
                        "The specified buffer is null or undefined"));
            }

            // All these are documented in their property definition below. All but the shapefile and point buffer
            // are determined when the record is read by this class.
            this._shapefile = shapefile;
            this._recordNumber = -1;
            this._attributes = {};
            this._numberOfParts = 0;
            this._firstPartNumber = 0;
            this._lastPartNumber = 0;
            this._numberOfPoints = 0;
            this._boundingRectangle = [];
            this._zRange = null;
            this._zValues = null;
            this._mRange = null;
            this._mValues = null;

            // Internal use only. Intentionally not documented.
            this._contentLengthInBytes = -1;

            // Internal use only. Intentionally not documented.
            this._buffer = buffer;

            // Internal use only. Intentionally not documented.
            this._isNormalized = false;

            // Internal use only. Intentionally not documented.
            this._parts = [];

            // Prime the input pump.
            this.readRecord();
        };

        Object.defineProperties(ShapefileRecord.prototype, {
            /**
             * The shapefile containing this record.
             * @memberof ShapefileRecord.prototype
             * @type {Shapefile}
             * @readonly
             */
            shapefile: {
                get: function () {
                    return this._shapefile;
                }
            },

            /**
             * This record's ordinal position in the shapefile. 0 indicates the first record in the shapefile.
             * @memberof ShapefileRecord.prototype
             * @type {Number}
             * @readonly
             */
            recordNumber: {
                get: function () {
                    return this._recordNumber;
                }
            },

            /**
             * The attributes associated with this record, as read from the attribute file associated with the
             * shapefile. Empty if there are no attributes associated with this record or with the shapefile.
             * @memberof ShapefileRecord.prototype
             * @type {Object}
             * @readonly
             */
            attributes: {
                get: function () {
                    return this._attributes;
                }
            },

            /**
             * The number of parts in the shapefile.
             * @memberof ShapefileRecord.prototype
             * @type {Number}
             * @readonly
             */
            numberOfParts: {
                get: function () {
                    return this._numberOfParts;
                }
            },

            /**
             * The first part number in the record.
             * @memberof ShapefileRecord.prototype
             * @type {Number}
             * @readonly
             */
            firstPartNumber: {
                get: function () {
                    return this._firstPartNumber;
                }
            },

            /**
             * The last part number in the record.
             * @memberof ShapefileRecord.prototype
             * @type {Number}
             * @readonly
             */
            lastPartNumber: {
                get: function () {
                    return this._lastPartNumber;
                }
            },

            /**
             * The number of points in the record.
             * @memberof ShapefileRecord.prototype
             * @type {Number}
             * @readonly
             */
            numberOfPoints: {
                get: function () {
                    return this._numberOfPoints;
                }
            },

            /**
             * A four-element array containing this record's bounding rectangle, or null if this record has no
             * bounding rectangle. The returned array is ordered as follows: minimum Y, maximum Y, minimum X,
             * maximum X. If the shapefile's coordinate system is geographic then the elements can be interpreted
             * as angular degrees in the order minimum latitude, maximum latitude, minimum longitude, maximum
             * longitude.
             * @memberof ShapefileRecord.prototype
             * @type {Number[]}
             * @readonly
             */
            boundingRectangle: {
                get: function () {
                    return this._boundingRectangle;
                }
            },

            /**
             * The record's Z range if the shapefile's shape type is a Z type, otherwise null.
             * @memberof ShapefileRecord.prototype
             * @type {Number[]}
             * @readonly
             */
            zRange: {
                get: function () {
                    return this._zRange;
                }
            },

            /**
             * The record's Z values if the shapefile's shape type is a Z type, otherwise null.
             * @memberof ShapefileRecord.prototype
             * @type {Number[]}
             * @readonly
             */
            zValues: {
                get: function () {
                    return this._zValues;
                }
            },

            /**
             * The record's M range if the shapefile's shape type is an M type, otherwise null.
             * @memberof ShapefileRecord.prototype
             * @type {Number[]}
             * @readonly
             */
            mRange: {
                get: function () {
                    return this._mRange;
                }
            },

            /**
             * The record's M values if the shapefile's shape type is an M type, otherwise null.
             * @memberof ShapefileRecord.prototype
             * @type {Number[]}
             * @readonly
             */
            mValues: {
                get: function () {
                    return this._mValues;
                }
            }
        });

        /**
         * Returns the points of a specified part of this record.
         * @param {Number} partNumber The part number of interest. The range of part numbers can be determined via
         * [firstPartNumber]{@link ShapefileRecord#firstPartNumber} and
         * [lastPartNumber]{@link ShapefileRecord#lastPartNumber}.
         * @returns {Float64Array} The part's points in the order X0, Y0, X1, Y1, ..., Xn, Yn, where n is the number
         * of points in the part minus one. Returns null if the specified part does not exist.
         */
        ShapefileRecord.prototype.pointBuffer = function (partNumber) {
            if (partNumber >= 0 && partNumber < this._parts.length) {
                return this._parts[partNumber];
            }
            else {
                return null;
            }
        };

        ShapefileRecord.prototype.readRecord = function() {
            this.readHeader();

            // Technically, the shape type in the record header is considered a part of the contents according to the
            // ESRI specification. However, every record has a shape type, so we will read before reading the record contents.
            // Read shape type as little endian.
            this._buffer.order(ByteBuffer.LITTLE_ENDIAN);
            var type = this._buffer.getInt32();
            var shapeType = this.shapefile.getShapeType(type);
            this.validateShapeType(shapeType);

            this.readContents();
        };

        /**
         * Reads and parses the contents of a shapefile record from a specified buffer. The buffer's current position must
         * be the start of the record and will be the start of the next record when the method returns.
         *
         */
        ShapefileRecord.prototype.readHeader = function() {
            // Read record number and record length - big endian.
            this._buffer.order(ByteBuffer.BIG_ENDIAN);
            this._recordNumber = this._buffer.getInt32();
            this._contentLengthInBytes = this._buffer.getInt32() * 2;
        };

        /**
         * Verifies that the record's shape type matches that of the shapefile. All non-null
         * records in a Shapefile must be of the same type. Throws an exception if the types do not match and the shape type
         * is not {@link Shapefile#NULL}. Records of type NULL are always valid, and
         * may appear in any Shapefile.
         * <p/>
         * For details, see the ESRI Shapefile specification at <a href="https://www.esri.com/library/whitepapers/pdfs/shapefile.pdf"/>,
         * pages 4 and 5.
         *
         * @throws Error If the shape types do not match.
         */
        ShapefileRecord.prototype.validateShapeType = function(shapeType) {
            if (shapeType !== this.shapefile.NULL &&
                shapeType !== this.shapefile.shapeType) {
                // TODO: throw the correct error
                throw new Error(
                    Logger.log(Logger.LEVEL_SEVERE, "Shapefile record is not supported.")
                );
            }
        };

        // Internal use only. Intentionally not documented.
        ShapefileRecord.prototype.readNullContents = function() {
            this._numberOfParts = 0;
            this._numberOfPoints = 0;
            this._parts = null;
            this._boundingRectangle = null;

            // Skip over the remaining contents of the record after the record's shape type.
            this._buffer.seek(this._contentLengthInBytes - ByteBuffer.INT32_SIZE);
        };

        // Internal use only. Intentionally not documented.
        ShapefileRecord.prototype.readPointContents = function() {
            this._numberOfParts = 1;
            this._firstPartNumber = 0;
            this._lastPartNumber = this._numberOfParts - 1;
            this._numberOfPoints = 1;

            this._parts = [this._buffer.getDoubleArray(2)];

            var latitude = this._parts[0][1];
            var longitude = this._parts[0][0];
            this._boundingRectangle = [latitude, latitude, longitude, longitude];

            // Read the optional Z value.
            if (this.isZType()) {
                this.readZ(true);
            }

            // Read the optional measure value.
            if (this.isMeasureType()) {
                this.readOptionalMeasures(true);
            }
        };

        // Internal use only. Intentionally not documented.
        ShapefileRecord.prototype.readPolylineContents = function() {
            // Read the bounding rectangle.
            var rect = this.shapefile.readBoundingRectangle(this._buffer);
            this._boundingRectangle = rect.coords;

            // Specify that the record's points should be normalized if the bounding rectangle is normalized. Ignore the
            // shapefile's normalizePoints property to avoid normalizing records that don't need it.
            this._isNormalized = rect.isNormalized;

            // Read the number of parts and the number of points.
            this._numberOfParts = this._buffer.getInt32();
            this._firstPartNumber = 0;
            this._lastPartNumber = this._numberOfParts - 1;
            this._numberOfPoints = this._buffer.getInt32();

            if (this._numberOfParts > 0 && this._numberOfPoints > 0) {
                // Read the part positions.
                var partPositions = this._buffer.getInt32Array(this.numberOfParts);

                for (var partNumber = 0; partNumber < this.numberOfParts; partNumber += 1) {
                    var numPointsInPart = (partNumber == this.numberOfParts - 1) ?
                        this._numberOfPoints - partPositions[partNumber] :
                        partPositions[partNumber + 1] - partPositions[partNumber];

                    // Add the record's points to the Shapefile's point buffer, and record this record's part offset in the
                    // Shapefile's point buffer.
                    this._parts[partNumber] = this._buffer.getDoubleArray(numPointsInPart * 2);
                    ShapefileRecord.normalizeLocations(this._parts[partNumber]);
                }
            }

            // Read the optional Z value.
            if (this.isZType()) {
                this.readZ(false);
            }

            // Read the optional measure value.
            if (this.isMeasureType()) {
                this.readOptionalMeasures(false);
            }
        };

        // Internal use only. Intentionally not documented.
        ShapefileRecord.prototype.readMultiPointContents = function() {
            // Read the bounding rectangle.
            var rect = this.shapefile.readBoundingRectangle(this._buffer);
            this._boundingRectangle = rect.coords;

            // Specify that the record's points should be normalized if the bounding rectangle is normalized. Ignore the
            // shapefile's normalizePoints property to avoid normalizing records that don't need it.
            this._isNormalized = rect.isNormalized;

            // Read the number of parts and the number of points.
            this._numberOfParts = 1;
            this._numberOfPoints = this._buffer.getInt32();

            this._parts = [this._buffer.getDoubleArray(this._numberOfPoints * 2)];
            ShapefileRecord.normalizeLocations(this._parts[0]);

            // Read the optional Z value.
            if (this.isZType()) {
                this.readZ(false);
            }

            // Read the optional measure value.
            if (this.isMeasureType()) {
                this.readOptionalMeasures(false);
            }
        };

        /**
         * Read's the shape's Z values from the record buffer.
         */
        ShapefileRecord.prototype.readZ = function(isPoint) {
            if (isPoint) {
                this._zValues = this._buffer.getDoubleArray(1);
                var z = this._zValues[0];
                this._zRange = [z, z];
            }
            else {
                this._zRange = this._buffer.getDoubleArray(2);
                this._zValues = this._buffer.getDoubleArray(this.numberOfPoints);
            }
        };

        /**
         * Reads any optional measure values from the record buffer.
         */
        ShapefileRecord.prototype.readOptionalMeasures = function(isPoint) {
            // Measure values are optional.
            if (this._buffer.hasRemaining() && (this._buffer.limit() - this._buffer.position) >= (this.numberOfPoints * 8)) {
                if (isPoint) {
                    this._mValues = this._buffer.getDoubleArray(1);
                    var m = this._mValues[0];
                    this._mRange = [m, m];
                }
                else {
                    this._mRange = this._buffer.getDoubleArray(2);
                    this._mValues = this._buffer.getDoubleArray(this.numberOfPoints);
                }
            }
        };

        /**
         * Normalize an array of doubles and treat them as lat/lon pairs,
         * where the longitude is the first value of the pair, and
         * the latitude is the second value of the pair.
         * <p>
         * This pair ordering is dictated by the format of shapefiles.
         * @param {Number} array
         */
        ShapefileRecord.normalizeLocations = function(array) {
            for (var idx = 0, len = array.length; idx < len; idx += 2) {
                var longitude = array[idx];
                var latitude = array[idx + 1];

                array[idx] = Angle.normalizedDegreesLongitude(longitude);
                array[idx + 1] = Angle.normalizedDegreesLatitude(latitude);
            }
        };

        /**
         * Indicate whether the record is of a point type.
         * @returns {Boolean} True if the record is of a point type.
         */
        ShapefileRecord.prototype.isPointType = function() {
            return this.shapefile.isPointType();
        };

        /**
         * Indicate whether the record is of a point type.
         * @returns {Boolean} True if the record is of a point type.
         */
        ShapefileRecord.prototype.isMultiPointType = function() {
            return this.shapefile.isMultiPointType();
        };

        /**
         * Indicate whether the record is of a polyline type.
         * @returns {Boolean} True if the record is of a polyline type.
         */
        ShapefileRecord.prototype.isPolylineType = function() {
            return this.shapefile.isPolylineType();
        };

        /**
         * Indicate whether the record is of a polygon type.
         * @returns {Boolean} True if the record is of a polygon type.
         */
        ShapefileRecord.prototype.isPolygonType = function() {
            return this.shapefile.isPolygonType();
        };

        /**
         * Indicate whether the record is of a depth type.
         * @returns {Boolean} True if the record is of a depth type.
         */
        ShapefileRecord.prototype.isZType = function() {
            return this.shapefile.isZType();
        };

        /**
         * Indicate whether the record is of a measure type.
         * @returns {Boolean} True if the record is of a measure type.
         */
        ShapefileRecord.prototype.isMeasureType = function() {
            return this.shapefile.isMeasureType();

        };

        /**
         * Internal use only.
         * Set the attributes of the record from a dBase file.
         * @param {Object} attributes Attributes contained in a dBase file.
         */
        ShapefileRecord.prototype.setAttributes = function(attributes) {
            this._attributes = attributes;
        };

        ShapefileRecord.RECORD_HEADER_LENGTH = 8;

        export default ShapefileRecord;
    