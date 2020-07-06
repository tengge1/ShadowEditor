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
 * @exports Matrix
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Position from '../geom/Position';
import Rectangle from '../geom/Rectangle';
import Texture from '../render/Texture';
import Vec3 from '../geom/Vec3';
import WWMath from '../util/WWMath';


/**
 * Constructs a matrix.
 * @alias Matrix
 * @constructor
 * @classdesc Represents a 4 x 4 double precision matrix stored in a Float64Array in row-major order.
 * @param {Number} m11 matrix element at row 1, column 1.
 * @param {Number} m12 matrix element at row 1, column 2.
 * @param {Number} m13 matrix element at row 1, column 3.
 * @param {Number} m14 matrix element at row 1, column 4.
 * @param {Number} m21 matrix element at row 2, column 1.
 * @param {Number} m22 matrix element at row 2, column 2.
 * @param {Number} m23 matrix element at row 2, column 3.
 * @param {Number} m24 matrix element at row 2, column 4.
 * @param {Number} m31 matrix element at row 3, column 1.
 * @param {Number} m32 matrix element at row 3, column 2.
 * @param {Number} m33 matrix element at row 3, column 3.
 * @param {Number} m34 matrix element at row 3, column 4.
 * @param {Number} m41 matrix element at row 4, column 1.
 * @param {Number} m42 matrix element at row 4, column 2.
 * @param {Number} m43 matrix element at row 4, column 3.
 * @param {Number} m44 matrix element at row 4, column 4.
 */
function Matrix(m11, m12, m13, m14,
    m21, m22, m23, m24,
    m31, m32, m33, m34,
    m41, m42, m43, m44) {
    this[0] = m11;
    this[1] = m12;
    this[2] = m13;
    this[3] = m14;
    this[4] = m21;
    this[5] = m22;
    this[6] = m23;
    this[7] = m24;
    this[8] = m31;
    this[9] = m32;
    this[10] = m33;
    this[11] = m34;
    this[12] = m41;
    this[13] = m42;
    this[14] = m43;
    this[15] = m44;
}

// Derives from Float64Array.
Matrix.prototype = new Float64Array(16);

/**
 * Creates an identity matrix.
 * @returns {Matrix} A new identity matrix.
 */
Matrix.fromIdentity = function () {
    return new Matrix(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
};

/**
 * Computes the principal axes of a point collection expressed in a typed array.
 * @param {Float32Array} points The points for which to compute the axes,
 * expressed as X0, Y0, Z0, X1, Y1, Z1, ...
 * @param {Vec3} axis1 A vector in which to return the first (longest) principal axis.
 * @param {Vec3} axis2 A vector in which to return the second (mid-length) principal axis.
 * @param {Vec3} axis3 A vector in which to return the third (shortest) principal axis.
 * @throws {ArgumentError} If the specified points array is null, undefined or empty, or one of the
 * specified axes arguments is null or undefined.
 */
Matrix.principalAxesFromPoints = function (points, axis1, axis2, axis3) {
    if (!points || points.length < 1) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "principalAxesFromPoints",
            "missingPoints"));
    }

    if (!axis1 || !axis2 || !axis3) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "principalAxesFromPoints",
            "An axis argument is null or undefined."));
    }

    // Compute the covariance matrix.
    var covariance = Matrix.fromIdentity();
    covariance.setToCovarianceOfPoints(points);

    // Compute the eigenvectors from the covariance matrix. Since the covariance matrix is symmetric by
    // definition, we can safely use the "symmetric" method below.
    covariance.eigensystemFromSymmetricMatrix(axis1, axis2, axis3);

    // Normalize the eigenvectors, which are already sorted in order from most prominent to least prominent.
    axis1.normalize();
    axis2.normalize();
    axis3.normalize();
};

/**
 * Sets the components of this matrix to specified values.
 * @param {Number} m11 matrix element at row 1, column 1.
 * @param {Number} m12 matrix element at row 1, column 2.
 * @param {Number} m13 matrix element at row 1, column 3.
 * @param {Number} m14 matrix element at row 1, column 4.
 * @param {Number} m21 matrix element at row 2, column 1.
 * @param {Number} m22 matrix element at row 2, column 2.
 * @param {Number} m23 matrix element at row 2, column 3.
 * @param {Number} m24 matrix element at row 2, column 4.
 * @param {Number} m31 matrix element at row 3, column 1.
 * @param {Number} m32 matrix element at row 3, column 2.
 * @param {Number} m33 matrix element at row 3, column 3.
 * @param {Number} m34 matrix element at row 3, column 4.
 * @param {Number} m41 matrix element at row 4, column 1.
 * @param {Number} m42 matrix element at row 4, column 2.
 * @param {Number} m43 matrix element at row 4, column 3.
 * @param {Number} m44 matrix element at row 4, column 4.
 * @returns {Matrix} This matrix with its components set to the specified values.
 */
Matrix.prototype.set = function (m11, m12, m13, m14,
    m21, m22, m23, m24,
    m31, m32, m33, m34,
    m41, m42, m43, m44) {
    this[0] = m11;
    this[1] = m12;
    this[2] = m13;
    this[3] = m14;
    this[4] = m21;
    this[5] = m22;
    this[6] = m23;
    this[7] = m24;
    this[8] = m31;
    this[9] = m32;
    this[10] = m33;
    this[11] = m34;
    this[12] = m41;
    this[13] = m42;
    this[14] = m43;
    this[15] = m44;

    return this;
};

/**
 * Sets this matrix to the identity matrix.
 * @returns {Matrix} This matrix set to the identity matrix.
 */
Matrix.prototype.setToIdentity = function () {
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = 1;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
};

/**
 * Copies the components of a specified matrix to this matrix.
 * @param {Matrix} matrix The matrix to copy.
 * @returns {Matrix} This matrix set to the values of the specified matrix.
 * @throws {ArgumentError} If the specified matrix is null or undefined.
 */
Matrix.prototype.copy = function (matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "copy", "missingMatrix"));
    }

    this[0] = matrix[0];
    this[1] = matrix[1];
    this[2] = matrix[2];
    this[3] = matrix[3];
    this[4] = matrix[4];
    this[5] = matrix[5];
    this[6] = matrix[6];
    this[7] = matrix[7];
    this[8] = matrix[8];
    this[9] = matrix[9];
    this[10] = matrix[10];
    this[11] = matrix[11];
    this[12] = matrix[12];
    this[13] = matrix[13];
    this[14] = matrix[14];
    this[15] = matrix[15];
};

/**
 * Creates a new matrix that is a copy of this matrix.
 * @returns {Matrix} The new matrix.
 */
Matrix.prototype.clone = function () {
    var clone = Matrix.fromIdentity();
    clone.copy(this);

    return clone;
};

/**
 * Indicates whether the components of this matrix are equal to those of a specified matrix.
 * @param {Matrix} matrix The matrix to test equality with. May be null or undefined, in which case this
 * function returns false.
 * @returns {boolean} true if all components of this matrix are equal to the corresponding
 * components of the specified matrix, otherwise false.
 */
Matrix.prototype.equals = function (matrix) {
    return matrix
        && this[0] == matrix[0]
        && this[1] == matrix[1]
        && this[2] == matrix[2]
        && this[3] == matrix[3]
        && this[4] == matrix[4]
        && this[5] == matrix[5]
        && this[6] == matrix[6]
        && this[7] == matrix[7]
        && this[8] == matrix[8]
        && this[9] == matrix[9]
        && this[10] == matrix[10]
        && this[11] == matrix[11]
        && this[12] == matrix[12]
        && this[13] == matrix[13]
        && this[14] == matrix[14]
        && this[15] == matrix[15];
};

/**
 * Stores this matrix's components in column-major order in a specified array.
 * <p>
 * The array must have space for at least 16 elements. This matrix's components are stored in the array
 * starting with row 0 column 0 in index 0, row 1 column 0 in index 1, row 2 column 0 in index 2, and so on.
 *
 * @param {Float32Array | Float64Array | Number[]} result An array of at least 16 elements. Upon return,
 * contains this matrix's components in column-major.
 * @returns {Float32Array} The specified result array.
 * @throws {ArgumentError} If the specified result array in null or undefined.
 */
Matrix.prototype.columnMajorComponents = function (result) {
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "columnMajorComponents", "missingResult"));
    }

    // Column 1
    result[0] = this[0];
    result[1] = this[4];
    result[2] = this[8];
    result[3] = this[12];
    // Column 2
    result[4] = this[1];
    result[5] = this[5];
    result[6] = this[9];
    result[7] = this[13];
    // Column 3
    result[8] = this[2];
    result[9] = this[6];
    result[10] = this[10];
    result[11] = this[14];
    // Column 4
    result[12] = this[3];
    result[13] = this[7];
    result[14] = this[11];
    result[15] = this[15];

    return result;
};

/**
 * Sets this matrix to a translation matrix with specified translation components.
 * @param {Number} x The X translation component.
 * @param {Number} y The Y translation component.
 * @param {Number} z The Z translation component.
 * @returns {Matrix} This matrix with its translation components set to those specified and all other
 * components set to that of an identity matrix.
 */
Matrix.prototype.setToTranslation = function (x, y, z) {
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = x;
    this[4] = 0;
    this[5] = 1;
    this[6] = 0;
    this[7] = y;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = z;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;

    return this;
};

/**
 * Sets the translation components of this matrix to specified values.
 * @param {Number} x The X translation component.
 * @param {Number} y The Y translation component.
 * @param {Number} z The Z translation component.
 * @returns {Matrix} This matrix with its translation components set to the specified values and all other
 * components unmodified.
 */
Matrix.prototype.setTranslation = function (x, y, z) {
    this[3] = x;
    this[7] = y;
    this[11] = z;

    return this;
};

/**
 * Sets this matrix to a scale matrix with specified scale components.
 * @param {Number} xScale The X scale component.
 * @param {Number} yScale The Y scale component.
 * @param {Number} zScale The Z scale component.
 * @returns {Matrix} This matrix with its scale components set to those specified and all other
 * components set to that of an identity matrix.
 */
Matrix.prototype.setToScale = function (xScale, yScale, zScale) {
    this[0] = xScale;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = yScale;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = zScale;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;

    return this;
};

/**
 * Sets the scale components of this matrix to specified values.
 * @param {Number} xScale The X scale component.
 * @param {Number} yScale The Y scale component.
 * @param {Number} zScale The Z scale component.
 * @returns {Matrix} This matrix with its scale components set to the specified values and all other
 * components unmodified.
 */
Matrix.prototype.setScale = function (xScale, yScale, zScale) {
    this[0] = xScale;
    this[5] = yScale;
    this[10] = zScale;

    return this;
};

/**
 * Sets this matrix to the transpose of a specified matrix.
 * @param {Matrix} matrix The matrix whose transpose is to be copied.
 * @returns {Matrix} This matrix, with its values set to the transpose of the specified matrix.
 * @throws {ArgumentError} If the specified matrix in null or undefined.
 */
Matrix.prototype.setToTransposeOfMatrix = function (matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "setToTransposeOfMatrix", "missingMatrix"));
    }

    this[0] = matrix[0];
    this[1] = matrix[4];
    this[2] = matrix[8];
    this[3] = matrix[12];
    this[4] = matrix[1];
    this[5] = matrix[5];
    this[6] = matrix[9];
    this[7] = matrix[13];
    this[8] = matrix[2];
    this[9] = matrix[6];
    this[10] = matrix[10];
    this[11] = matrix[14];
    this[12] = matrix[3];
    this[13] = matrix[7];
    this[14] = matrix[11];
    this[15] = matrix[15];

    return this;
};

/**
 * Sets this matrix to the matrix product of two specified matrices.
 * @param {Matrix} matrixA The first matrix multiplicand.
 * @param {Matrix} matrixB The second matrix multiplicand.
 * @returns {Matrix} This matrix set to the product of matrixA x matrixB.
 * @throws {ArgumentError} If either specified matrix is null or undefined.
 */
Matrix.prototype.setToMultiply = function (matrixA, matrixB) {
    if (!matrixA || !matrixB) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "setToMultiply", "missingMatrix"));
    }

    var ma = matrixA,
        mb = matrixB;

    this[0] = ma[0] * mb[0] + ma[1] * mb[4] + ma[2] * mb[8] + ma[3] * mb[12];
    this[1] = ma[0] * mb[1] + ma[1] * mb[5] + ma[2] * mb[9] + ma[3] * mb[13];
    this[2] = ma[0] * mb[2] + ma[1] * mb[6] + ma[2] * mb[10] + ma[3] * mb[14];
    this[3] = ma[0] * mb[3] + ma[1] * mb[7] + ma[2] * mb[11] + ma[3] * mb[15];

    this[4] = ma[4] * mb[0] + ma[5] * mb[4] + ma[6] * mb[8] + ma[7] * mb[12];
    this[5] = ma[4] * mb[1] + ma[5] * mb[5] + ma[6] * mb[9] + ma[7] * mb[13];
    this[6] = ma[4] * mb[2] + ma[5] * mb[6] + ma[6] * mb[10] + ma[7] * mb[14];
    this[7] = ma[4] * mb[3] + ma[5] * mb[7] + ma[6] * mb[11] + ma[7] * mb[15];

    this[8] = ma[8] * mb[0] + ma[9] * mb[4] + ma[10] * mb[8] + ma[11] * mb[12];
    this[9] = ma[8] * mb[1] + ma[9] * mb[5] + ma[10] * mb[9] + ma[11] * mb[13];
    this[10] = ma[8] * mb[2] + ma[9] * mb[6] + ma[10] * mb[10] + ma[11] * mb[14];
    this[11] = ma[8] * mb[3] + ma[9] * mb[7] + ma[10] * mb[11] + ma[11] * mb[15];

    this[12] = ma[12] * mb[0] + ma[13] * mb[4] + ma[14] * mb[8] + ma[15] * mb[12];
    this[13] = ma[12] * mb[1] + ma[13] * mb[5] + ma[14] * mb[9] + ma[15] * mb[13];
    this[14] = ma[12] * mb[2] + ma[13] * mb[6] + ma[14] * mb[10] + ma[15] * mb[14];
    this[15] = ma[12] * mb[3] + ma[13] * mb[7] + ma[14] * mb[11] + ma[15] * mb[15];

    return this;
};

/**
 * Sets this matrix to the symmetric covariance Matrix computed from the x, y, z coordinates of a specified
 * points array.
 * <p/>
 * The computed covariance matrix represents the correlation between each pair of x-, y-, and z-coordinates as
 * they're distributed about the point array's arithmetic mean. Its layout is as follows:
 * <p/>
 * <code> C(x, x)  C(x, y)  C(x, z) <br/> C(x, y)  C(y, y)  C(y, z) <br/> C(x, z)  C(y, z)  C(z, z) </code>
 * <p/>
 * C(i, j) is the covariance of coordinates i and j, where i or j are a coordinate's dispersion about its mean
 * value. If any entry is zero, then there's no correlation between the two coordinates defining that entry. If the
 * returned matrix is diagonal, then all three coordinates are uncorrelated, and the specified point is
 * distributed evenly about its mean point.
 * @param {Float32Array | Float64Array | Number[]} points The points to consider.
 * @returns {Matrix} This matrix set to the covariance matrix for the specified list of points.
 * @throws {ArgumentError} If the specified array of points is null, undefined or empty.
 */
Matrix.prototype.setToCovarianceOfPoints = function (points) {
    if (!points || points.length < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "setToCovarianceOfPoints", "missingArray"));
    }

    var mean,
        dx,
        dy,
        dz,
        count = 0,
        c11 = 0,
        c22 = 0,
        c33 = 0,
        c12 = 0,
        c13 = 0,
        c23 = 0,
        vec = new Vec3(0, 0, 0);

    mean = Vec3.averageOfBuffer(points, new Vec3(0, 0, 0));

    for (var i = 0, len = points.length / 3; i < len; i++) {
        vec[0] = points[i * 3];
        vec[1] = points[i * 3 + 1];
        vec[2] = points[i * 3 + 2];

        dx = vec[0] - mean[0];
        dy = vec[1] - mean[1];
        dz = vec[2] - mean[2];

        ++count;
        c11 += dx * dx;
        c22 += dy * dy;
        c33 += dz * dz;
        c12 += dx * dy; // c12 = c21
        c13 += dx * dz; // c13 = c31
        c23 += dy * dz; // c23 = c32
    }

    // Row 1
    this[0] = c11 / count;
    this[1] = c12 / count;
    this[2] = c13 / count;
    this[3] = 0;

    // Row 2
    this[4] = c12 / count;
    this[5] = c22 / count;
    this[6] = c23 / count;
    this[7] = 0;

    // Row 3
    this[8] = c13 / count;
    this[9] = c23 / count;
    this[10] = c33 / count;
    this[11] = 0;

    // Row 4
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 0;

    return this;
};

/**
 * Multiplies this matrix by a translation matrix with specified translation values.
 * @param {Number} x The X translation component.
 * @param {Number} y The Y translation component.
 * @param {Number} z The Z translation component.
 * @returns {Matrix} This matrix multiplied by the translation matrix implied by the specified values.
 */
Matrix.prototype.multiplyByTranslation = function (x, y, z) {

    this.multiply(
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1);

    return this;
};

/**
 * Multiplies this matrix by a rotation matrix about a specified axis and angle.
 * @param {Number} x The X component of the rotation axis.
 * @param {Number} y The Y component of the rotation axis.
 * @param {Number} z The Z component of the rotation axis.
 * @param {Number} angleDegrees The angle to rotate, in degrees.
 * @returns {Matrix} This matrix multiplied by the rotation matrix implied by the specified values.
 */
Matrix.prototype.multiplyByRotation = function (x, y, z, angleDegrees) {

    var c = Math.cos(angleDegrees * Angle.DEGREES_TO_RADIANS),
        s = Math.sin(angleDegrees * Angle.DEGREES_TO_RADIANS);

    this.multiply(
        c + (1 - c) * x * x, (1 - c) * x * y - s * z, (1 - c) * x * z + s * y, 0,
        (1 - c) * x * y + s * z, c + (1 - c) * y * y, (1 - c) * y * z - s * x, 0,
        (1 - c) * x * z - s * y, (1 - c) * y * z + s * x, c + (1 - c) * z * z, 0,
        0, 0, 0, 1);

    return this;
};

/**
 * Multiplies this matrix by a scale matrix with specified values.
 * @param {Number} xScale The X scale component.
 * @param {Number} yScale The Y scale component.
 * @param {Number} zScale The Z scale component.
 * @returns {Matrix} This matrix multiplied by the scale matrix implied by the specified values.
 */
Matrix.prototype.multiplyByScale = function (xScale, yScale, zScale) {

    this.multiply(
        xScale, 0, 0, 0,
        0, yScale, 0, 0,
        0, 0, zScale, 0,
        0, 0, 0, 1);

    return this;
};

/**
 * Sets this matrix to one that flips and shifts the y-axis.
 * <p>
 * The resultant matrix maps Y=0 to Y=1 and Y=1 to Y=0. All existing values are overwritten. This matrix is
 * usually used to change the coordinate origin from an upper left coordinate origin to a lower left coordinate
 * origin. This is typically necessary to align the coordinate system of images (top-left origin) with that of
 * OpenGL (bottom-left origin).
 * @returns {Matrix} This matrix set to values described above.
 */
Matrix.prototype.setToUnitYFlip = function () {

    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = -1;
    this[6] = 0;
    this[7] = 1;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;

    return this;
};

/**
 * Multiplies this matrix by a local coordinate system transform for the specified globe.
 * <p>
 * The local coordinate system is defined such that the local origin (0, 0, 0) maps to the specified origin
 * point, the z axis maps to the globe's surface normal at the point, the y-axis maps to the north pointing
 * tangent, and the x-axis maps to the east pointing tangent.
 *
 * @param {Vec3} origin The local coordinate system origin, in model coordinates.
 * @param {Globe} globe The globe the coordinate system is relative to.
 *
 * @throws {ArgumentError} If either argument is null or undefined.
 */
Matrix.prototype.multiplyByLocalCoordinateTransform = function (origin, globe) {
    if (!origin) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "multiplyByLocalCoordinateTransform",
                "Origin vector is null or undefined"));
    }

    if (!globe) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "multiplyByLocalCoordinateTransform",
                "missingGlobe"));
    }

    var xAxis = new Vec3(0, 0, 0),
        yAxis = new Vec3(0, 0, 0),
        zAxis = new Vec3(0, 0, 0);

    WWMath.localCoordinateAxesAtPoint(origin, globe, xAxis, yAxis, zAxis);

    this.multiply(
        xAxis[0], yAxis[0], zAxis[0], origin[0],
        xAxis[1], yAxis[1], zAxis[1], origin[1],
        xAxis[2], yAxis[2], zAxis[2], origin[2],
        0, 0, 0, 1);

    return this;
};

/**
 * Multiplies this matrix by a texture transform for the specified texture.
 * <p>
 * A texture image transform maps the bottom-left corner of the texture's image data to coordinate [0,0] and maps the
 * top-right of the texture's image data to coordinate [1,1]. This correctly handles textures whose image data has
 * non-power-of-two dimensions, and correctly orients textures whose image data has its origin in the upper-left corner.
 *
 * @param {Texture} texture The texture to multiply a transform for.
 *
 * @throws {ArgumentError} If the texture is null or undefined.
 */
Matrix.prototype.multiplyByTextureTransform = function (texture) {
    if (!texture) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "multiplyByTextureTransform",
                "missingTexture"));
    }

    // Compute the scale necessary to map the edge of the image data to the range [0,1]. When the texture contains
    // power-of-two image data the scale is 1 and has no effect. Otherwise, the scale is computed such that the portion
    // of the texture containing image data maps to the range [0,1].
    var sx = texture.originalImageWidth / texture.imageWidth,
        sy = texture.originalImageHeight / texture.imageHeight;

    // Multiply this by a scaling matrix that maps the texture's image data to the range [0,1] and inverts the y axis.
    // We have precomputed the result here in order to avoid an unnecessary matrix multiplication.
    this.multiply(
        sx, 0, 0, 0,
        0, -sy, 0, sy,
        0, 0, 1, 0,
        0, 0, 0, 1);

    return this;
};

/**
 * Returns the translation components of this matrix.
 * @param {Vec3} result A pre-allocated {@link Vec3} in which to return the translation components.
 * @returns {Vec3} The specified result argument set to the translation components of this matrix.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Matrix.prototype.extractTranslation = function (result) {
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "extractTranslation", "missingResult"));
    }

    result[0] = this[3];
    result[1] = this[7];
    result[2] = this[11];

    return result;
};

/**
 * Returns the rotation angles of this matrix.
 * @param {Vec3} result A pre-allocated {@link Vec3} in which to return the rotation angles.
 * @returns {Vec3} The specified result argument set to the rotation angles of this matrix. The angles are in
 * degrees.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Matrix.prototype.extractRotationAngles = function (result) {
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "extractRotationAngles", "missingResult"));
    }

    // Taken from Extracting Euler Angles from a Rotation Matrix by Mike Day, Insomniac Games.
    // http://www.insomniacgames.com/mike-day-extracting-euler-angles-from-a-rotation-matrix/

    var x = Math.atan2(this[6], this[10]),
        y = Math.atan2(-this[2], Math.sqrt(this[0] * this[0] + this[1] * this[1])),
        cx = Math.cos(x),
        sx = Math.sin(x),
        z = Math.atan2(sx * this[8] - cx * this[4], cx * this[5] - sx * this[9]);

    result[0] = x * Angle.RADIANS_TO_DEGREES;
    result[1] = y * Angle.RADIANS_TO_DEGREES;
    result[2] = z * Angle.RADIANS_TO_DEGREES;

    return result;
};

/**
 * Multiplies this matrix by a first person viewing matrix for the specified globe.
 * <p>
 * A first person viewing matrix places the viewer's eye at the specified eyePosition. By default the viewer is looking
 * straight down at the globe's surface from the eye position, with the globe's normal vector coming out of the screen
 * and north pointing toward the top of the screen.
 * <p>
 * Heading specifies the viewer's azimuth, or its angle relative to North. Heading values range from -180 degrees to 180
 * degrees. A heading of 0 degrees looks North, 90 degrees looks East, +-180 degrees looks South, and -90 degrees looks
 * West.
 * <p>
 * Tilt specifies the viewer's angle relative to the surface. Tilt values range from -180 degrees to 180 degrees. A tilt
 * of 0 degrees looks straight down at the globe's surface, 90 degrees looks at the horizon, and 180 degrees looks
 * straight up. Tilt values greater than 180 degrees cause the viewer to turn upside down, and are therefore rarely used.
 * <p>
 * Roll specifies the viewer's angle relative to the horizon. Roll values range from -180 degrees to 180 degrees. A roll
 * of 0 degrees orients the viewer so that up is pointing to the top of the screen, at 90 degrees up is pointing to the
 * right, at +-180 degrees up is pointing to the bottom, and at -90 up is pointing to the left.
 *
 * @param {Position} eyePosition The viewer's geographic eye position relative to the specified globe.
 * @param {Number} heading The viewer's angle relative to north, in degrees.
 * @param {Number} tilt The viewer's angle relative to the surface, in degrees.
 * @param {Number} roll The viewer's angle relative to the horizon, in degrees.
 * @param {Globe} globe The globe the viewer is looking at.
 *
 * @throws {ArgumentError} If the specified position or globe is null or undefined.
 */
Matrix.prototype.multiplyByFirstPersonModelview = function (eyePosition, heading, tilt, roll, globe) {
    if (!eyePosition) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "multiplyByFirstPersonModelview", "missingPosition"));
    }

    if (!globe) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "multiplyByFirstPersonModelview", "missingGlobe"));
    }

    var c,
        s,
        ex, ey, ez,
        xx, xy, xz,
        yx, yy, yz,
        zx, zy, zz,
        eyePoint = new Vec3(0, 0, 0),
        xAxis = new Vec3(0, 0, 0),
        yAxis = new Vec3(0, 0, 0),
        zAxis = new Vec3(0, 0, 0);

    // Roll. Rotate the eye point in a counter-clockwise direction about the z axis. Note that we invert the sines used
    // in the rotation matrix in order to produce the counter-clockwise rotation. We invert only the cosines since
    // sin(-a) = -sin(a) and cos(-a) = cos(a).
    c = Math.cos(roll * Angle.DEGREES_TO_RADIANS);
    s = Math.sin(roll * Angle.DEGREES_TO_RADIANS);
    this.multiply(
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1);

    // Tilt. Rotate the eye point in a counter-clockwise direction about the x axis. Note that we invert the sines used
    // in the rotation matrix in order to produce the counter-clockwise rotation. We invert only the cosines since
    // sin(-a) = -sin(a) and cos(-a) = cos(a).
    c = Math.cos(tilt * Angle.DEGREES_TO_RADIANS);
    s = Math.sin(tilt * Angle.DEGREES_TO_RADIANS);
    this.multiply(1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1);

    // Heading. Rotate the eye point in a clockwise direction about the z axis again. This has a different effect than
    // roll when tilt is non-zero because the viewer is no longer looking down the z axis.
    c = Math.cos(heading * Angle.DEGREES_TO_RADIANS);
    s = Math.sin(heading * Angle.DEGREES_TO_RADIANS);
    this.multiply(c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1);

    // Compute the eye point in model coordinates. This point is mapped to the origin in the look at transform below.
    globe.computePointFromPosition(eyePosition.latitude, eyePosition.longitude, eyePosition.altitude, eyePoint);
    ex = eyePoint[0];
    ey = eyePoint[1];
    ez = eyePoint[2];

    // Transform the origin to the local coordinate system at the eye point.
    WWMath.localCoordinateAxesAtPoint(eyePoint, globe, xAxis, yAxis, zAxis);
    xx = xAxis[0];
    xy = xAxis[1];
    xz = xAxis[2];
    yx = yAxis[0];
    yy = yAxis[1];
    yz = yAxis[2];
    zx = zAxis[0];
    zy = zAxis[1];
    zz = zAxis[2];

    this.multiply(xx, xy, xz, -xx * ex - xy * ey - xz * ez,
        yx, yy, yz, -yx * ex - yy * ey - yz * ez,
        zx, zy, zz, -zx * ex - zy * ey - zz * ez,
        0, 0, 0, 1);

    return this;
};

/**
 * Multiplies this matrix by a look at viewing matrix for the specified globe.
 * <p>
 * A look at viewing matrix places the center of the screen at the specified lookAtPosition. By default the viewer is
 * looking straight down at the look at position from the specified range, with the globe's normal vector coming out of
 * the screen and north pointing toward the top of the screen.
 * <p>
 * Range specifies the distance between the look at position and the viewer's eye point. Range values may be any positive
 * real number. A range of 0 places the eye point at the look at point, while a positive range moves the eye point away
 * from but still looking at the look at point.
 * <p>
 * Heading specifies the viewer's azimuth, or its angle relative to North. Heading values range from -180 degrees to 180
 * degrees. A heading of 0 degrees looks North, 90 degrees looks East, +-180 degrees looks South, and -90 degrees looks
 * West.
 * <p>
 * Tilt specifies the viewer's angle relative to the surface. Tilt values range from -180 degrees to 180 degrees. A tilt
 * of 0 degrees looks straight down at the globe's surface, 90 degrees looks at the horizon, and 180 degrees looks
 * straight up. Tilt values greater than 180 degrees cause the viewer to turn upside down, and are therefore rarely used.
 * <p>
 * Roll specifies the viewer's angle relative to the horizon. Roll values range from -180 degrees to 180 degrees. A roll
 * of 0 degrees orients the viewer so that up is pointing to the top of the screen, at 90 degrees up is pointing to the
 * right, at +-180 degrees up is pointing to the bottom, and at -90 up is pointing to the left.
 *
 * @param {Position} lookAtPosition The viewer's geographic look at position relative to the specified globe.
 * @param {Number} range The distance between the eye point and the look at point, in model coordinates.
 * @param {Number} heading The viewer's angle relative to north, in degrees.
 * @param {Number} tilt The viewer's angle relative to the surface, in degrees.
 * @param {Number} roll The viewer's angle relative to the horizon, in degrees.
 * @param {Globe} globe The globe the viewer is looking at.
 *
 * @throws {ArgumentError} If either the specified look-at position or globe is null or undefined, or the
 * specified range is less than zero.
 */
Matrix.prototype.multiplyByLookAtModelview = function (lookAtPosition, range, heading, tilt, roll, globe) {
    if (!lookAtPosition) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "multiplyByLookAtModelview", "missingPosition"));
    }

    if (range < 0) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "multiplyByLookAtModelview",
                "Range is less than zero"));
    }

    if (!globe) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "multiplyByLookAtModelview", "missingGlobe"));
    }

    // Translate the eye point along the positive z axis while keeping the look at point in the center of the viewport.
    this.multiplyByTranslation(0, 0, -range);

    // Transform the origin to the local coordinate system at the look at position, and rotate the viewer by the
    // specified heading, tilt and roll.
    this.multiplyByFirstPersonModelview(lookAtPosition, heading, tilt, roll, globe);

    return this;
};

/**
 * Sets this matrix to a perspective projection matrix for the specified viewport dimensions and clip distances.
 * <p>
 * A perspective projection matrix maps points in eye coordinates into clip coordinates in a way that causes
 * distant objects to appear smaller, and preserves the appropriate depth information for each point. In model
 * coordinates, a perspective projection is defined by frustum originating at the eye position and extending
 * outward in the viewer's direction. The near distance and the far distance identify the minimum and maximum
 * distance, respectively, at which an object in the scene is visible. Near and far distances must be positive
 * and may not be equal.
 *
 * @param {Number} viewportWidth The viewport width, in screen coordinates.
 * @param {Number} viewportHeight The viewport height, in screen coordinates.
 * @param {Number} nearDistance The near clip plane distance, in model coordinates.
 * @param {Number} farDistance The far clip plane distance, in model coordinates.
 * @throws {ArgumentError} If the specified width or height is less than or equal to zero, if the near and far
 * distances are equal, or if either the near or far distance are less than or equal to zero.
 */
Matrix.prototype.setToPerspectiveProjection = function (viewportWidth, viewportHeight, nearDistance, farDistance) {
    if (viewportWidth <= 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "setToPerspectiveProjection",
            "invalidWidth"));
    }

    if (viewportHeight <= 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "setToPerspectiveProjection",
            "invalidHeight"));
    }

    if (nearDistance === farDistance) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "setToPerspectiveProjection",
            "Near and far distance are the same."));
    }

    if (nearDistance <= 0 || farDistance <= 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "setToPerspectiveProjection",
            "Near or far distance is less than or equal to zero."));
    }

    // Compute the dimensions of the viewport rectangle at the near distance.
    var nearRect = WWMath.perspectiveFrustumRectangle(viewportWidth, viewportHeight, nearDistance),
        left = nearRect.getMinX(),
        right = nearRect.getMaxX(),
        bottom = nearRect.getMinY(),
        top = nearRect.getMaxY();

    // Taken from Mathematics for 3D Game Programming and Computer Graphics, Second Edition, equation 4.52.

    // Row 1
    this[0] = 2 * nearDistance / (right - left);
    this[1] = 0;
    this[2] = (right + left) / (right - left);
    this[3] = 0;
    // Row 2
    this[4] = 0;
    this[5] = 2 * nearDistance / (top - bottom);
    this[6] = (top + bottom) / (top - bottom);
    this[7] = 0;
    // Row 3
    this[8] = 0;
    this[9] = 0;
    this[10] = -(farDistance + nearDistance) / (farDistance - nearDistance);
    this[11] = -2 * nearDistance * farDistance / (farDistance - nearDistance);
    // Row 4
    this[12] = 0;
    this[13] = 0;
    this[14] = -1;
    this[15] = 0;

    return this;
};

/**
 * Sets this matrix to a screen projection matrix for the specified viewport dimensions.
 * <p>
 * A screen projection matrix is an orthographic projection that assumes that points in model coordinates
 * represent a screen point and a depth. Screen projection matrices therefore map model coordinates directly
 * into screen coordinates without modification. A point's xy coordinates are interpreted as literal screen
 * coordinates and must be in the viewport to be visible. A point's z coordinate is interpreted as a depth value
 * that ranges from 0 to 1. Additionally, the screen projection matrix preserves the depth value returned by
 * [DrawContext.project]{@link DrawContext#project}.
 *
 * @param {Number} viewportWidth The viewport width, in screen coordinates.
 * @param {Number} viewportHeight The viewport height, in screen coordinates.
 * @throws {ArgumentError} If the specified width or height is less than or equal to zero.
 */
Matrix.prototype.setToScreenProjection = function (viewportWidth, viewportHeight) {
    if (viewportWidth <= 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "setToScreenProjection",
            "invalidWidth"));
    }

    if (viewportHeight <= 0) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "setToScreenProjection",
            "invalidHeight"));
    }

    // Taken from Mathematics for 3D Game Programming and Computer Graphics, Second Edition, equation 4.57.
    // Simplified to assume that the viewport origin is (0, 0).
    //
    // The third row of this projection matrix is configured so that points with z coordinates representing
    // depth values ranging from 0 to 1 are not modified after transformation into window coordinates. This
    // projection matrix maps z values in the range [0, 1] to the range [-1, 1] by applying the following
    // function to incoming z coordinates:
    //
    // zp = z0 * 2 - 1
    //
    // Where 'z0' is the point's z coordinate and 'zp' is the projected z coordinate. The GPU then maps the
    // projected z coordinate into window coordinates in the range [0, 1] by applying the following function:
    //
    // zw = zp * 0.5 + 0.5
    //
    // The result is that a point's z coordinate is effectively passed to the GPU without modification.

    // Row 1
    this[0] = 2 / viewportWidth;
    this[1] = 0;
    this[2] = 0;
    this[3] = -1;
    // Row 2
    this[4] = 0;
    this[5] = 2 / viewportHeight;
    this[6] = 0;
    this[7] = -1;
    // Row 3
    this[8] = 0;
    this[9] = 0;
    this[10] = 2;
    this[11] = -1;
    // Row 4
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;

    return this;
};

/**
 * Returns this viewing matrix's eye point.
 * <p>
 * This method assumes that this matrix represents a viewing matrix. If this does not represent a viewing matrix the
 * results are undefined.
 * <p>
 * In model coordinates, a viewing matrix's eye point is the point the viewer is looking from and maps to the center of
 * the screen.
 *
 * @param {Vec3} result A pre-allocated {@link Vec3} in which to return the extracted values.
 * @return {Vec3} The specified result argument containing the viewing matrix's eye point, in model coordinates.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Matrix.prototype.extractEyePoint = function (result) {
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "extractEyePoint", "missingResult"));
    }

    // The eye point of a modelview matrix is computed by transforming the origin (0, 0, 0, 1) by the matrix's inverse.
    // This is equivalent to transforming the inverse of this matrix's translation components in the rightmost column by
    // the transpose of its upper 3x3 components.
    result[0] = -(this[0] * this[3]) - this[4] * this[7] - this[8] * this[11];
    result[1] = -(this[1] * this[3]) - this[5] * this[7] - this[9] * this[11];
    result[2] = -(this[2] * this[3]) - this[6] * this[7] - this[10] * this[11];

    return result;
};

/**
 * Returns this viewing matrix's forward vector.
 * <p>
 * This method assumes that this matrix represents a viewing matrix. If this does not represent a viewing matrix the
 * results are undefined.
 *
 * @param {Vec3} result A pre-allocated {@link Vec3} in which to return the extracted values.
 * @return {Vec3} The specified result argument containing the viewing matrix's forward vector, in model coordinates.
 * @throws {ArgumentError} If the specified result argument is null or undefined.
 */
Matrix.prototype.extractForwardVector = function (result) {
    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "extractForwardVector", "missingResult"));
    }

    // The forward vector of a modelview matrix is computed by transforming the negative Z axis (0, 0, -1, 0) by the
    // matrix's inverse. We have pre-computed the result inline here to simplify this computation.
    result[0] = -this[8];
    result[1] = -this[9];
    result[2] = -this[10];

    return result;
};

/**
 * Extracts this viewing matrix's parameters given a viewing origin and a globe.
 * <p>
 * This method assumes that this matrix represents a viewing matrix. If this does not represent a viewing matrix the
 * results are undefined.
 * <p>
 * This returns a parameterization of this viewing matrix based on the specified origin and globe. The origin indicates
 * the model coordinate point that the view's orientation is relative to, while the globe provides the necessary model
 * coordinate context for the origin and the orientation. The origin should be either the view's eye point or a point on
 * the view's forward vector. The view's roll must be specified in order to disambiguate heading and roll when the view's
 * tilt is zero.
 * <p>
 * The following list outlines the returned key-value pairs and their meanings:
 * <ul>
 * <li> 'origin' - The geographic position corresponding to the origin point.</li>
 * <li> 'range' - The distance between the specified origin point and the view's eye point, in model coordinates.</li>
 * <li> 'heading' - The view's heading angle relative to the globe's north pointing tangent at the origin point, in degrees.</li>
 * <li> 'tilt' - The view's tilt angle relative to the globe's normal vector at the origin point, in degrees.</li>
 * <li> 'roll' - The view's roll relative to the globe's normal vector at the origin point, in degrees.</li>
 * </ul>
 * @param {Vec3} origin The origin of the viewing parameters, in model coordinates.
 * @param {Number} roll The view's roll, in degrees.
 * @param {Globe} globe The globe the viewer is looking at.
 * @param {Object} result A pre-allocated object in which to return the viewing parameters.
 *
 * @return {Object} The specified result argument containing a parameterization of this viewing matrix.
 *
 * @throws {ArgumentError} If either the specified origin or globe are null or undefined or the specified
 * result argument is null or undefined.
 */
Matrix.prototype.extractViewingParameters = function (origin, roll, globe, result) {
    if (!origin) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "extractViewingParameters",
                "The specified origin is null or undefined."));
    }

    if (!globe) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "extractViewingParameters", "missingGlobe"));
    }

    if (!result) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "extractViewingParameters", "missingResult"));
    }

    var originPos = new Position(0, 0, 0),
        modelviewLocal = Matrix.fromIdentity(),
        range,
        ct,
        st,
        tilt,
        cr, sr,
        ch, sh,
        heading;

    globe.computePositionFromPoint(origin[0], origin[1], origin[2], originPos);

    // Transform the modelview matrix to a local coordinate system at the origin. This eliminates the geographic
    // transform contained in the modelview matrix while maintaining rotation and translation relative to the origin.
    modelviewLocal.copy(this);
    modelviewLocal.multiplyByLocalCoordinateTransform(origin, globe);

    range = -modelviewLocal[11];
    ct = modelviewLocal[10];
    st = Math.sqrt(modelviewLocal[2] * modelviewLocal[2] + modelviewLocal[6] * modelviewLocal[6]);
    tilt = Math.atan2(st, ct) * Angle.RADIANS_TO_DEGREES;

    cr = Math.cos(roll * Angle.DEGREES_TO_RADIANS);
    sr = Math.sin(roll * Angle.DEGREES_TO_RADIANS);
    ch = cr * modelviewLocal[0] - sr * modelviewLocal[4];
    sh = sr * modelviewLocal[5] - cr * modelviewLocal[1];
    heading = Math.atan2(sh, ch) * Angle.RADIANS_TO_DEGREES;

    result['origin'] = originPos;
    result['range'] = range;
    result['heading'] = heading;
    result['tilt'] = tilt;
    result['roll'] = roll;

    return result;
};

/**
 * Applies a specified depth offset to this projection matrix.
 * <p>
 * This method assumes that this matrix represents a projection matrix. If this does not represent a projection
 * matrix the results are undefined. Projection matrices can be created by calling
 * [setToPerspectiveProjection]{@link Matrix#setToPerspectiveProjection} or [setToScreenProjection]{@link Matrix#setToScreenProjection}.
 * <p>
 * The depth offset may be any real number and is typically used to draw geometry slightly closer to the user's
 * eye in order to give those shapes visual priority over nearby or geometry. An offset of zero has no effect.
 * An offset less than zero brings depth values closer to the eye, while an offset greater than zero pushes
 * depth values away from the eye.
 * <p>
 * Depth offset may be applied to both perspective and orthographic projection matrices. The effect on each
 * projection type is outlined here:
 * <p>
 * <strong>Perspective Projection</strong>
 * <p>
 * The effect of depth offset on a perspective projection increases exponentially with distance from the eye.
 * This has the effect of adjusting the offset for the loss in depth precision with geometry drawn further from
 * the eye. Distant geometry requires a greater offset to differentiate itself from nearby geometry, while close
 * geometry does not.
 * <p>
 * <strong>Orthographic Projection</strong>
 * <p>
 * The effect of depth offset on an orthographic projection increases linearly with distance from the eye. While
 * it is reasonable to apply a depth offset to an orthographic projection, the effect is most appropriate when
 * applied to the projection used to draw the scene. For example, when an object's coordinates are projected by
 * a perspective projection into screen coordinates then drawn using an orthographic projection, it is best to
 * apply the offset to the original perspective projection. The method [DrawContext.project]{@link DrawContext#project} performs the
 * correct behavior for the projection type used to draw the scene.
 *
 * @param {Number} depthOffset The amount of offset to apply.
 * @returns {Matrix} This matrix with it's depth offset set to the specified offset.
 */
Matrix.prototype.offsetProjectionDepth = function (depthOffset) {

    this[10] *= 1 + depthOffset;

    return this;
};

/**
 * Multiplies this matrix by a specified matrix.
 *
 * @param {Matrix} matrix The matrix to multiply with this matrix.
 * @returns {Matrix} This matrix after multiplying it by the specified matrix.
 * @throws {ArgumentError} if the specified matrix is null or undefined.
 */
Matrix.prototype.multiplyMatrix = function (matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "multiplyMatrix", "missingMatrix"));
    }

    var ma = this,
        mb = matrix,
        ma0, ma1, ma2, ma3;

    // Row 1
    ma0 = ma[0];
    ma1 = ma[1];
    ma2 = ma[2];
    ma3 = ma[3];
    ma[0] = ma0 * mb[0] + ma1 * mb[4] + ma2 * mb[8] + ma3 * mb[12];
    ma[1] = ma0 * mb[1] + ma1 * mb[5] + ma2 * mb[9] + ma3 * mb[13];
    ma[2] = ma0 * mb[2] + ma1 * mb[6] + ma2 * mb[10] + ma3 * mb[14];
    ma[3] = ma0 * mb[3] + ma1 * mb[7] + ma2 * mb[11] + ma3 * mb[15];

    // Row 2
    ma0 = ma[4];
    ma1 = ma[5];
    ma2 = ma[6];
    ma3 = ma[7];
    ma[4] = ma0 * mb[0] + ma1 * mb[4] + ma2 * mb[8] + ma3 * mb[12];
    ma[5] = ma0 * mb[1] + ma1 * mb[5] + ma2 * mb[9] + ma3 * mb[13];
    ma[6] = ma0 * mb[2] + ma1 * mb[6] + ma2 * mb[10] + ma3 * mb[14];
    ma[7] = ma0 * mb[3] + ma1 * mb[7] + ma2 * mb[11] + ma3 * mb[15];

    // Row 3
    ma0 = ma[8];
    ma1 = ma[9];
    ma2 = ma[10];
    ma3 = ma[11];
    ma[8] = ma0 * mb[0] + ma1 * mb[4] + ma2 * mb[8] + ma3 * mb[12];
    ma[9] = ma0 * mb[1] + ma1 * mb[5] + ma2 * mb[9] + ma3 * mb[13];
    ma[10] = ma0 * mb[2] + ma1 * mb[6] + ma2 * mb[10] + ma3 * mb[14];
    ma[11] = ma0 * mb[3] + ma1 * mb[7] + ma2 * mb[11] + ma3 * mb[15];

    // Row 4
    ma0 = ma[12];
    ma1 = ma[13];
    ma2 = ma[14];
    ma3 = ma[15];
    ma[12] = ma0 * mb[0] + ma1 * mb[4] + ma2 * mb[8] + ma3 * mb[12];
    ma[13] = ma0 * mb[1] + ma1 * mb[5] + ma2 * mb[9] + ma3 * mb[13];
    ma[14] = ma0 * mb[2] + ma1 * mb[6] + ma2 * mb[10] + ma3 * mb[14];
    ma[15] = ma0 * mb[3] + ma1 * mb[7] + ma2 * mb[11] + ma3 * mb[15];

    return this;
};

/**
 * Multiplies this matrix by a matrix specified by individual components.
 *
 * @param {Number} m00 matrix element at row 1, column 1.
 * @param {Number} m01 matrix element at row 1, column 2.
 * @param {Number} m02 matrix element at row 1, column 3.
 * @param {Number} m03 matrix element at row 1, column 4.
 * @param {Number} m10 matrix element at row 2, column 1.
 * @param {Number} m11 matrix element at row 2, column 2.
 * @param {Number} m12 matrix element at row 2, column 3.
 * @param {Number} m13 matrix element at row 2, column 4.
 * @param {Number} m20 matrix element at row 3, column 1.
 * @param {Number} m21 matrix element at row 3, column 2.
 * @param {Number} m22 matrix element at row 3, column 3.
 * @param {Number} m23 matrix element at row 3, column 4.
 * @param {Number} m30 matrix element at row 4, column 1.
 * @param {Number} m31 matrix element at row 4, column 2.
 * @param {Number} m32 matrix element at row 4, column 3.
 * @param {Number} m33 matrix element at row 4, column 4.
 * @returns {Matrix} This matrix with its components multiplied by the specified values.
 */
Matrix.prototype.multiply = function (m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33) {

    var ma = this,
        ma0, ma1, ma2, ma3;

    // Row 1
    ma0 = ma[0];
    ma1 = ma[1];
    ma2 = ma[2];
    ma3 = ma[3];
    ma[0] = ma0 * m00 + ma1 * m10 + ma2 * m20 + ma3 * m30;
    ma[1] = ma0 * m01 + ma1 * m11 + ma2 * m21 + ma3 * m31;
    ma[2] = ma0 * m02 + ma1 * m12 + ma2 * m22 + ma3 * m32;
    ma[3] = ma0 * m03 + ma1 * m13 + ma2 * m23 + ma3 * m33;

    // Row 2
    ma0 = ma[4];
    ma1 = ma[5];
    ma2 = ma[6];
    ma3 = ma[7];
    ma[4] = ma0 * m00 + ma1 * m10 + ma2 * m20 + ma3 * m30;
    ma[5] = ma0 * m01 + ma1 * m11 + ma2 * m21 + ma3 * m31;
    ma[6] = ma0 * m02 + ma1 * m12 + ma2 * m22 + ma3 * m32;
    ma[7] = ma0 * m03 + ma1 * m13 + ma2 * m23 + ma3 * m33;

    // Row 3
    ma0 = ma[8];
    ma1 = ma[9];
    ma2 = ma[10];
    ma3 = ma[11];
    ma[8] = ma0 * m00 + ma1 * m10 + ma2 * m20 + ma3 * m30;
    ma[9] = ma0 * m01 + ma1 * m11 + ma2 * m21 + ma3 * m31;
    ma[10] = ma0 * m02 + ma1 * m12 + ma2 * m22 + ma3 * m32;
    ma[11] = ma0 * m03 + ma1 * m13 + ma2 * m23 + ma3 * m33;

    // Row 4
    ma0 = ma[12];
    ma1 = ma[13];
    ma2 = ma[14];
    ma3 = ma[15];
    ma[12] = ma0 * m00 + ma1 * m10 + ma2 * m20 + ma3 * m30;
    ma[13] = ma0 * m01 + ma1 * m11 + ma2 * m21 + ma3 * m31;
    ma[14] = ma0 * m02 + ma1 * m12 + ma2 * m22 + ma3 * m32;
    ma[15] = ma0 * m03 + ma1 * m13 + ma2 * m23 + ma3 * m33;

    return this;
};

/**
 * Inverts the specified matrix and stores the result in this matrix.
 * <p>
 * This throws an exception if the specified matrix is singular.
 * <p>
 * The result of this method is undefined if this matrix is passed in as the matrix to invert.
 *
 * @param {Matrix} matrix The matrix whose inverse is computed.
 * @returns {Matrix} This matrix set to the inverse of the specified matrix.
 *
 * @throws {ArgumentError} If the specified matrix is null, undefined or cannot be inverted.
 */
Matrix.prototype.invertMatrix = function (matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "invertMatrix", "missingMatrix"));
    }

    // Copy the specified matrix into a mutable two-dimensional array.
    var A = [[], [], [], []];
    A[0][0] = matrix[0];
    A[0][1] = matrix[1];
    A[0][2] = matrix[2];
    A[0][3] = matrix[3];
    A[1][0] = matrix[4];
    A[1][1] = matrix[5];
    A[1][2] = matrix[6];
    A[1][3] = matrix[7];
    A[2][0] = matrix[8];
    A[2][1] = matrix[9];
    A[2][2] = matrix[10];
    A[2][3] = matrix[11];
    A[3][0] = matrix[12];
    A[3][1] = matrix[13];
    A[3][2] = matrix[14];
    A[3][3] = matrix[15];

    var index = [],
        d = Matrix.ludcmp(A, index),
        i,
        j;

    // Compute the matrix's determinant.
    for (i = 0; i < 4; i += 1) {
        d *= A[i][i];
    }

    // The matrix is singular if its determinant is zero or very close to zero.
    if (Math.abs(d) < 1.0e-8)
        return null;

    var Y = [[], [], [], []],
        col = [];
    for (j = 0; j < 4; j += 1) {
        for (i = 0; i < 4; i += 1) {
            col[i] = 0.0;
        }

        col[j] = 1.0;
        Matrix.lubksb(A, index, col);

        for (i = 0; i < 4; i += 1) {
            Y[i][j] = col[i];
        }
    }

    this[0] = Y[0][0];
    this[1] = Y[0][1];
    this[2] = Y[0][2];
    this[3] = Y[0][3];
    this[4] = Y[1][0];
    this[5] = Y[1][1];
    this[6] = Y[1][2];
    this[7] = Y[1][3];
    this[8] = Y[2][0];
    this[9] = Y[2][1];
    this[10] = Y[2][2];
    this[11] = Y[2][3];
    this[12] = Y[3][0];
    this[13] = Y[3][1];
    this[14] = Y[3][2];
    this[15] = Y[3][3];

    return this;
};

/* Internal. Intentionally not documented.
 * Utility method to solve a linear system with an LU factorization of a matrix.
 * Solves Ax=b, where A is in LU factorized form.
 * Algorithm derived from "Numerical Recipes in C", Press et al., 1988.
 *
 * @param {Number[]} A An LU factorization of a matrix.
 * @param {Number[]} index Permutation vector of that LU factorization.
 * @param {Number[]} b Vector to be solved.
 */
// Method "lubksb" derived from "Numerical Recipes in C", Press et al., 1988
Matrix.lubksb = function (A, index, b) {
    var ii = -1,
        i,
        j,
        sum;
    for (i = 0; i < 4; i += 1) {
        var ip = index[i];
        sum = b[ip];
        b[ip] = b[i];

        if (ii != -1) {
            for (j = ii; j <= i - 1; j += 1) {
                sum -= A[i][j] * b[j];
            }
        }
        else if (sum != 0.0) {
            ii = i;
        }

        b[i] = sum;
    }

    for (i = 3; i >= 0; i -= 1) {
        sum = b[i];
        for (j = i + 1; j < 4; j += 1) {
            sum -= A[i][j] * b[j];
        }

        b[i] = sum / A[i][i];
    }
};

/* Internal. Intentionally not documented.
 * Utility method to perform an LU factorization of a matrix.
 * "ludcmp" is derived from "Numerical Recipes in C", Press et al., 1988.
 *
 * @param {Number[]} A matrix to be factored
 * @param {Number[]} index permutation vector
 * @returns {Number} Condition number of matrix.
 */
Matrix.ludcmp = function (A, index) {
    var TINY = 1.0e-20,
        vv = [], /* new double[4]; */
        d = 1.0,
        temp,
        i,
        j,
        k,
        big,
        sum,
        imax,
        dum;
    for (i = 0; i < 4; i += 1) {
        big = 0.0;
        for (j = 0; j < 4; j += 1) {
            if ((temp = Math.abs(A[i][j])) > big) {
                big = temp;
            }
        }

        if (big == 0.0) {
            return 0.0; // Matrix is singular if the entire row contains zero.
        }
        else {
            vv[i] = 1.0 / big;
        }
    }

    for (j = 0; j < 4; j += 1) {
        for (i = 0; i < j; i += 1) {
            sum = A[i][j];
            for (k = 0; k < i; k += 1) {
                sum -= A[i][k] * A[k][j];
            }

            A[i][j] = sum;
        }

        big = 0.0;
        imax = -1;
        for (i = j; i < 4; i += 1) {
            sum = A[i][j];
            for (k = 0; k < j; k++) {
                sum -= A[i][k] * A[k][j];
            }

            A[i][j] = sum;

            if ((dum = vv[i] * Math.abs(sum)) >= big) {
                big = dum;
                imax = i;
            }
        }

        if (j != imax) {
            for (k = 0; k < 4; k += 1) {
                dum = A[imax][k];
                A[imax][k] = A[j][k];
                A[j][k] = dum;
            }

            d = -d;
            vv[imax] = vv[j];
        }

        index[j] = imax;
        if (A[j][j] == 0.0)
            A[j][j] = TINY;

        if (j != 3) {
            dum = 1.0 / A[j][j];
            for (i = j + 1; i < 4; i += 1) {
                A[i][j] *= dum;
            }
        }
    }

    return d;
};

/**
 * Inverts the specified matrix and stores the result in this matrix.
 * <p>
 * The specified matrix is assumed to represent an orthonormal transform matrix. This matrix's upper 3x3 is
 * transposed, then its fourth column is transformed by the transposed upper 3x3 and negated.
 * <p>
 * The result of this method is undefined if this matrix is passed in as the matrix to invert.
 *
 * @param {Matrix} matrix The matrix whose inverse is computed. This matrix is assumed to represent an
 * orthonormal transform matrix.
 * @returns {Matrix} This matrix set to the inverse of the specified matrix.
 *
 * @throws {ArgumentError} If the specified matrix is null or undefined.
 */
Matrix.prototype.invertOrthonormalMatrix = function (matrix) {
    if (!matrix) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "invertOrthonormalMatrix", "missingMatrix"));
    }

    // 'a' is assumed to contain a 3D transformation matrix.
    // Upper-3x3 is inverted, translation is transformed by inverted-upper-3x3 and negated.

    var a = matrix;

    this[0] = a[0];
    this[1] = a[4];
    this[2] = a[8];
    this[3] = 0.0 - a[0] * a[3] - a[4] * a[7] - a[8] * a[11];

    this[4] = a[1];
    this[5] = a[5];
    this[6] = a[9];
    this[7] = 0.0 - a[1] * a[3] - a[5] * a[7] - a[9] * a[11];

    this[8] = a[2];
    this[9] = a[6];
    this[10] = a[10];
    this[11] = 0.0 - a[2] * a[3] - a[6] * a[7] - a[10] * a[11];

    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;

    return this;
};

/**
 * Computes the eigenvectors of this matrix.
 * <p>
 * The eigenvectors are returned sorted from the most prominent vector to the least prominent vector.
 * Each eigenvector has length equal to its corresponding eigenvalue.
 *
 * @param {Vec3} result1 A pre-allocated vector in which to return the most prominent eigenvector.
 * @param {Vec3} result2 A pre-allocated vector in which to return the second most prominent eigenvector.
 * @param {Vec3} result3 A pre-allocated vector in which to return the least prominent eigenvector.
 *
 * @throws {ArgumentError} if any argument is null or undefined or if this matrix is not symmetric.
 */
Matrix.prototype.eigensystemFromSymmetricMatrix = function (result1, result2, result3) {
    if (!result1 || !result2 || !result3) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "eigensystemFromSymmetricMatrix", "missingResult"));
    }

    if (this[1] != this[4] || this[2] != this[8] || this[6] != this[9]) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "eigensystemFromSymmetricMatrix",
                "Matrix is not symmetric"));
    }

    // Taken from Mathematics for 3D Game Programming and Computer Graphics, Second Edition, listing 14.6.

    var epsilon = 1.0e-10,
        // Since the matrix is symmetric m12=m21, m13=m31 and m23=m32, therefore we can ignore the values m21,
        // m32 and m32.
        m11 = this[0],
        m12 = this[1],
        m13 = this[2],
        m22 = this[5],
        m23 = this[6],
        m33 = this[10],
        r = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ],
        maxSweeps = 32,
        u, u2, u2p1, t, c, s, temp, i, i1, i2, i3;

    for (var a = 0; a < maxSweeps; a++) {
        // Exit if off-diagonal entries small enough
        if (WWMath.fabs(m12) < epsilon && WWMath.fabs(m13) < epsilon && WWMath.fabs(m23) < epsilon)
            break;

        // Annihilate (1,2) entry.
        if (m12 != 0) {
            u = (m22 - m11) * 0.5 / m12;
            u2 = u * u;
            u2p1 = u2 + 1;
            t = u2p1 != u2 ? (u < 0 ? -1 : 1) * (Math.sqrt(u2p1) - WWMath.fabs(u)) : 0.5 / u;
            c = 1 / Math.sqrt(t * t + 1);
            s = c * t;

            m11 -= t * m12;
            m22 += t * m12;
            m12 = 0;

            temp = c * m13 - s * m23;
            m23 = s * m13 + c * m23;
            m13 = temp;

            for (i = 0; i < 3; i++) {
                temp = c * r[i][0] - s * r[i][1];
                r[i][1] = s * r[i][0] + c * r[i][1];
                r[i][0] = temp;
            }
        }

        // Annihilate (1,3) entry.
        if (m13 != 0) {
            u = (m33 - m11) * 0.5 / m13;
            u2 = u * u;
            u2p1 = u2 + 1;
            t = u2p1 != u2 ? (u < 0 ? -1 : 1) * (Math.sqrt(u2p1) - WWMath.fabs(u)) : 0.5 / u;
            c = 1 / Math.sqrt(t * t + 1);
            s = c * t;

            m11 -= t * m13;
            m33 += t * m13;
            m13 = 0;

            temp = c * m12 - s * m23;
            m23 = s * m12 + c * m23;
            m12 = temp;

            for (i = 0; i < 3; i++) {
                temp = c * r[i][0] - s * r[i][2];
                r[i][2] = s * r[i][0] + c * r[i][2];
                r[i][0] = temp;
            }
        }

        // Annihilate (2,3) entry.
        if (m23 != 0) {
            u = (m33 - m22) * 0.5 / m23;
            u2 = u * u;
            u2p1 = u2 + 1;
            t = u2p1 != u2 ? (u < 0 ? -1 : 1) * (Math.sqrt(u2p1) - WWMath.fabs(u)) : 0.5 / u;
            c = 1 / Math.sqrt(t * t + 1);
            s = c * t;

            m22 -= t * m23;
            m33 += t * m23;
            m23 = 0;

            temp = c * m12 - s * m13;
            m13 = s * m12 + c * m13;
            m12 = temp;

            for (i = 0; i < 3; i++) {
                temp = c * r[i][1] - s * r[i][2];
                r[i][2] = s * r[i][1] + c * r[i][2];
                r[i][1] = temp;
            }
        }
    }

    i1 = 0;
    i2 = 1;
    i3 = 2;

    if (m11 < m22) {
        temp = m11;
        m11 = m22;
        m22 = temp;

        temp = i1;
        i1 = i2;
        i2 = temp;
    }

    if (m22 < m33) {
        temp = m22;
        m22 = m33;
        m33 = temp;

        temp = i2;
        i2 = i3;
        i3 = temp;
    }

    if (m11 < m22) {
        temp = m11;
        m11 = m22;
        m22 = temp;

        temp = i1;
        i1 = i2;
        i2 = temp;
    }

    result1[0] = r[0][i1];
    result1[1] = r[1][i1];
    result1[2] = r[2][i1];

    result2[0] = r[0][i2];
    result2[1] = r[1][i2];
    result2[2] = r[2][i2];

    result3[0] = r[0][i3];
    result3[1] = r[1][i3];
    result3[2] = r[2][i3];

    result1.normalize();
    result2.normalize();
    result3.normalize();

    result1.multiply(m11);
    result2.multiply(m22);
    result3.multiply(m33);
};

/**
 * Extracts and returns a new matrix whose upper 3x3 entries are identical to those of this matrix,
 * and whose fourth row and column are 0 except for a 1 in the diagonal position.
 * @returns {Matrix} The upper 3x3 matrix of this matrix.
 */
Matrix.prototype.upper3By3 = function () {
    var result = Matrix.fromIdentity();

    result[0] = this[0];
    result[1] = this[1];
    result[2] = this[2];

    result[4] = this[4];
    result[5] = this[5];
    result[6] = this[6];

    result[8] = this[8];
    result[9] = this[9];
    result[10] = this[10];

    return result;
};


/**
 * Transforms the specified screen point from WebGL screen coordinates to model coordinates. This method assumes
 * this matrix represents an inverse modelview-projection matrix. The result of this method is
 * undefined if this matrix is not an inverse modelview-projection matrix.
 * <p>
 * The screen point is understood to be in WebGL screen coordinates, with the origin in the bottom-left corner
 * and axes that extend up and to the right from the origin.
 * <p>
 * This function stores the transformed point in the result argument, and returns true or false to indicate whether the
 * transformation is successful. It returns false if the modelview or projection matrices
 * are malformed, or if the screenPoint is clipped by the near clipping plane or the far clipping plane.
 *
 * @param {Vec3} screenPoint The screen coordinate point to un-project.
 * @param {Rectangle} viewport The viewport defining the screen point's coordinate system
 * @param {Vec3} result A pre-allocated vector in which to return the unprojected point.
 * @returns {boolean} true if the transformation is successful, otherwise false.
 * @throws {ArgumentError} If either the specified point or result argument is null or undefined.
 */
Matrix.prototype.unProject = function (screenPoint, viewport, result) {
    if (!screenPoint) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "unProject",
            "missingPoint"));
    }

    if (!viewport) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "unProject",
            "missingViewport"));
    }

    if (!result) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Matrix", "unProject",
            "missingResult"));
    }

    var sx = screenPoint[0],
        sy = screenPoint[1],
        sz = screenPoint[2];

    // Convert the XY screen coordinates to coordinates in the range [0, 1]. This enables the XY coordinates to
    // be converted to clip coordinates.
    sx = (sx - viewport.x) / viewport.width;
    sy = (sy - viewport.y) / viewport.height;

    // Convert from coordinates in the range [0, 1] to clip coordinates in the range [-1, 1].
    sx = sx * 2 - 1;
    sy = sy * 2 - 1;
    sz = sz * 2 - 1;

    // Clip the point against the near and far clip planes. In clip coordinates the near and far clip planes are
    // perpendicular to the Z axis and are located at -1 and 1, respectively.
    if (sz < -1 || sz > 1) {
        return false;
    }

    // Transform the screen point from clip coordinates to model coordinates. This inverts the Z axis and stores
    // the negative of the eye coordinate Z value in the W coordinate.
    var
        x = this[0] * sx + this[1] * sy + this[2] * sz + this[3],
        y = this[4] * sx + this[5] * sy + this[6] * sz + this[7],
        z = this[8] * sx + this[9] * sy + this[10] * sz + this[11],
        w = this[12] * sx + this[13] * sy + this[14] * sz + this[15];

    if (w === 0) {
        return false;
    }

    // Complete the conversion from model coordinates to clip coordinates by dividing by W.
    result[0] = x / w;
    result[1] = y / w;
    result[2] = z / w;

    return true;
};

export default Matrix;


