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
 * @exports Matrix3
 */

import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';


/**
 * Constructs a 3 x 3  matrix.
 * @alias Matrix3
 * @constructor
 * @classdesc Represents a 3 x 3 double precision matrix stored in a Float64Array in row-major order.
 * @param {Number} m11 matrix element at row 1, column 1.
 * @param {Number} m12 matrix element at row 1, column 2.
 * @param {Number} m13 matrix element at row 1, column 3.
 * @param {Number} m21 matrix element at row 2, column 1.
 * @param {Number} m22 matrix element at row 2, column 2.
 * @param {Number} m23 matrix element at row 2, column 3.
 * @param {Number} m31 matrix element at row 3, column 1.
 * @param {Number} m32 matrix element at row 3, column 2.
 * @param {Number} m33 matrix element at row 3, column 3.
 */
function Matrix3(m11, m12, m13,
    m21, m22, m23,
    m31, m32, m33) {
    this[0] = m11;
    this[1] = m12;
    this[2] = m13;
    this[3] = m21;
    this[4] = m22;
    this[5] = m23;
    this[6] = m31;
    this[7] = m32;
    this[8] = m33;
}

// Derives from Float64Array.
Matrix3.prototype = new Float64Array(9);

/**
 * Creates an identity matrix.
 * @returns {Matrix3} A new identity matrix.
 */
Matrix3.fromIdentity = function () {
    return new Matrix3(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    );
};

/**
 * Sets this matrix to one that flips and shifts the y-axis.
 * <p>
 * The resultant matrix maps Y=0 to Y=1 and Y=1 to Y=0. All existing values are overwritten. This matrix is
 * usually used to change the coordinate origin from an upper left coordinate origin to a lower left coordinate
 * origin. This is typically necessary to align the coordinate system of images (top-left origin) with that of
 * OpenGL (bottom-left origin).
 * @returns {Matrix3} This matrix set to values described above.
 */
Matrix3.prototype.setToUnitYFlip = function () {
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = -1;
    this[5] = 1;
    this[6] = 0;
    this[7] = 0;
    this[8] = 1;
    return this;
};

/**
 * Multiplies this matrix by a specified matrix.
 *
 * @param {Matrix3} matrix The matrix to multiply with this matrix.
 * @returns {Matrix3} This matrix after multiplying it by the specified matrix.
 * @throws {ArgumentError} if the specified matrix is null or undefined.
 */
Matrix3.prototype.multiplyMatrix = function (matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix3", "multiplyMatrix", "missingMatrix"));
    }

    var ma = this,
        mb = matrix,
        ma0, ma1, ma2;

    // Row 1
    ma0 = ma[0];
    ma1 = ma[1];
    ma2 = ma[2];
    ma[0] = ma0 * mb[0] + ma1 * mb[3] + ma2 * mb[6];
    ma[1] = ma0 * mb[1] + ma1 * mb[4] + ma2 * mb[7];
    ma[2] = ma0 * mb[2] + ma1 * mb[5] + ma2 * mb[8];

    // Row 2
    ma0 = ma[3];
    ma1 = ma[4];
    ma2 = ma[5];
    ma[3] = ma0 * mb[0] + ma1 * mb[3] + ma2 * mb[6];
    ma[4] = ma0 * mb[1] + ma1 * mb[4] + ma2 * mb[7];
    ma[5] = ma0 * mb[2] + ma1 * mb[5] + ma2 * mb[8];

    // Row 3
    ma0 = ma[6];
    ma1 = ma[7];
    ma2 = ma[8];
    ma[6] = ma0 * mb[0] + ma1 * mb[3] + ma2 * mb[6];
    ma[7] = ma0 * mb[1] + ma1 * mb[4] + ma2 * mb[7];
    ma[8] = ma0 * mb[2] + ma1 * mb[5] + ma2 * mb[8];

    return this;

};

/**
 * Multiplies this matrix by a matrix that transforms normalized coordinates from a source sector to a destination
 * sector. Normalized coordinates within a sector range from 0 to 1, with (0, 0) indicating the lower left corner
 * and (1, 1) indicating the upper right. The resultant matrix maps a normalized source coordinate (X, Y) to its
 * corresponding normalized destination coordinate (X', Y').
 * <p/>
 * This matrix typically necessary to transform texture coordinates from one geographic region to another. For
 * example, the texture coordinates for a terrain tile spanning one region must be transformed to coordinates
 * appropriate for an image tile spanning a potentially different region.
 *
 * @param {Sector} src the source sector
 * @param {Sector} dst the destination sector
 *
 * @returns {Matrix3} this matrix multiplied by the transform matrix implied by values described above
 */
Matrix3.prototype.multiplyByTileTransform = function (src, dst) {

    var srcDeltaLat = src.deltaLatitude();
    var srcDeltaLon = src.deltaLongitude();
    var dstDeltaLat = dst.deltaLatitude();
    var dstDeltaLon = dst.deltaLongitude();

    var xs = srcDeltaLon / dstDeltaLon;
    var ys = srcDeltaLat / dstDeltaLat;
    var xt = (src.minLongitude - dst.minLongitude) / dstDeltaLon;
    var yt = (src.minLatitude - dst.minLatitude) / dstDeltaLat;

    // This is equivalent to the following operation, but is potentially much faster:
    /*var m = new Matrix3(
        xs, 0, xt,
        0, ys, yt,
        0, 0, 1);
    this.multiplyMatrix(m);*/

    // This inline version eliminates unnecessary multiplication by 1 and 0 in the matrix's components, reducing
    // the total number of primitive operations from 63 to 18.

    var m = this;

    // Must be done before modifying m0, m1, etc. below.
    m[2] += m[0] * xt + m[1] * yt;
    m[5] += m[3] * xt + m[4] * yt;
    m[8] += m[6] * xt + m[6] * yt;

    m[0] *= xs;
    m[1] *= ys;

    m[3] *= xs;
    m[4] *= ys;

    m[6] *= xs;
    m[7] *= ys;

    return this;
};

/**
 * Stores this matrix's components in column-major order in a specified array.
 * <p>
 * The array must have space for at least 9 elements. This matrix's components are stored in the array
 * starting with row 0 column 0 in index 0, row 1 column 0 in index 1, row 2 column 0 in index 2, and so on.
 *
 * @param {Float32Array | Float64Array | Number[]} result An array of at least 9 elements. Upon return,
 * contains this matrix's components in column-major.
 * @returns {Float32Array} The specified result array.
 * @throws {ArgumentError} If the specified result array in null or undefined.
 */
Matrix3.prototype.columnMajorComponents = function (result) {
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix3", "columnMajorComponents", "missingResult"));
    }

    // Column 1
    result[0] = this[0];
    result[1] = this[3];
    result[2] = this[6];

    // Column 2
    result[3] = this[1];
    result[4] = this[4];
    result[5] = this[7];

    // Column 3
    result[6] = this[2];
    result[7] = this[5];
    result[8] = this[8];

    return result;
};

export default Matrix3;

