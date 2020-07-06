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
 * @exports ByteBuffer
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';


/**
 * Constructs a wrapper around an array buffer that enables byte-level access to its data.
 * This wrapper strives to minimize secondary allocations when subarrays are accessed.
 * The one exception is when double precision floating point data is access that is not properly aligned.
 * @alias ByteBuffer
 * @classdesc A structured wrapper around an array buffer that provides byte-level access to its data.
 * @param {ArrayBuffer} array An array buffer containing source data.
 * @constructor
 */
function ByteBuffer(array) {
    if (!array) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "ByteBuffer", "constructor", "missingArray"));
    }

    /**
     * The raw data of the array buffer.
     * @type {ArrayBuffer}
     */
    this.array = array;

    /**
     * A data view on the array buffer.
     * This data view is used to extract integer and floating point data from that array buffer.
     * @type {DataView}
     */
    this.data = new DataView(array);

    /**
     * The current position in the array buffer.
     * This position is implicitly used to access all data.
     * @type {Number}
     */
    this.position = 0;

    /**
     * The byte order in which the data is encoded.
     * Byte order will either be big endian or little endian.
     * @type {Boolean}
     * @default ByteByffer.LITTLE_ENDIAN
     * @private
     */
    this._order = ByteBuffer.LITTLE_ENDIAN;
}

/**
 * Get a byte from the current position and advance the position.
 * @returns {Number}
 */
ByteBuffer.prototype.getByte = function () {
    var result = this.data.getUint8(this.position);
    this.position += ByteBuffer.BYTE_SIZE;
    return result;
};

/**
 * Get a byte array from the current position and advance the position.
 * To avoid secondary allocation, a TypedArray shadows the underlying ArrayBuffer.
 * @param {Number} numBytes The number of bytes in the desired array.
 * @returns {Uint8Array}
 */
ByteBuffer.prototype.getByteArray = function (numBytes) {
    var result = new Uint8Array(this.array, this.position, numBytes);
    this.position += ByteBuffer.BYTE_SIZE * numBytes;
    return result;
};

/**
 * Get a 16-bit integer from the current position and advance the position.
 * @returns {Number}
 */
ByteBuffer.prototype.getInt16 = function () {
    var result = this.data.getInt16(this.position, this._order);
    this.position += ByteBuffer.INT16_SIZE;
    return result;
};

/**
 * Get a 16-bit integer array from the current position and advance the position.
 * To avoid secondary allocation, a TypedArray shadows the underlying ArrayBuffer.
 * @param {Number} numInt16s The number of 16-bit integers in the desired array.
 * @returns {Int16Array}
 */
ByteBuffer.prototype.getInt16Array = function (numInt16s) {
    var result = new Int16Array(this.array, this.position, numInt16s);
    this.position += ByteBuffer.INT16_SIZE * numInt16s;
    return result;
};

/**
 * Get a 32-bit integer from the current position and advance the position.
 * @returns {Number}
 */
ByteBuffer.prototype.getInt32 = function () {
    var result = this.data.getInt32(this.position, this._order);
    this.position += ByteBuffer.INT32_SIZE;
    return result;
};

/**
 * Get a single precision floating point array from the current position and advance the position.
 * To avoid secondary allocation, a TypedArray shadows the underlying ArrayBuffer.
 * @param {Number} numInt32s The number of 32-bit integers in the desired array.
 * @returns {Int32Array}
 */
ByteBuffer.prototype.getInt32Array = function (numInt32s) {
    var result = new Int32Array(this.array, this.position, numInt32s);
    this.position += ByteBuffer.INT32_SIZE * numInt32s;
    return result;
};

/**
 * Get a single precision floating point number from the current position and advance the position.
 * @returns {Number}
 */
ByteBuffer.prototype.getFloat = function () {
    var result = this.data.getFloat32(this.position, this._order);
    this.position += ByteBuffer.FLOAT_SIZE;
    return result;
};

/**
 * Get a single precision floating point array from the current position and advance the position.
 * To avoid secondary allocation, a TypedArray shadows the underlying ArrayBuffer.
 * @param {Number} numFloats The number of single precision floating point numbers in the desired array.
 * @returns {Float32Array}
 */
ByteBuffer.prototype.getFloatArray = function (numFloats) {
    var result = new Float32Array(this.array, this.position, numFloats);
    this.position += ByteBuffer.FLOAT_SIZE * numFloats;
    return result;
};

/**
 * Get a double precision floating point number from the current position and advance the position.
 * @returns {Number}
 */
ByteBuffer.prototype.getDouble = function () {
    var result = this.data.getFloat64(this.position, this._order);
    this.position += ByteBuffer.DOUBLE_SIZE;
    return result;
};

/**
 * Get a single precision floating point array from the current position and advance the position.
 * To avoid secondary allocation, a TypedArray shadows the underlying ArrayBuffer.
 * @param {Number} numDoubles The number of double precision floating point numbers in the desired array.
 * @returns {Float64Array}
 */
ByteBuffer.prototype.getDoubleArray = function (numDoubles) {
    // Issue: Float64Array c'tor throws an exception if the starting offset is not a multiple of 8.
    // We see this in shapefiles.
    var result;
    // If the data is not DWORD aligned, ...
    if (this.position % 8 != 0) {
        var bytes = this.array.slice(this.position, this.position + numDoubles * ByteBuffer.DOUBLE_SIZE);
        result = new Float64Array(bytes);
    }
    else {
        result = new Float64Array(this.array, this.position, numDoubles);
    }
    this.position += ByteBuffer.DOUBLE_SIZE * numDoubles;
    return result;
};

/**
 * Skip over the specified number of bytes.
 * @param {Number} numBytes The number of bytes to skip.
 */
ByteBuffer.prototype.skipBytes = function (numBytes) {
    this.position += numBytes * ByteBuffer.BYTE_SIZE;
};

/**
 * Skip over the specified number of 16-bit integers.
 * @param {Number} numInt16s The number of 16-bit integers to skip.
 */
ByteBuffer.prototype.skipInt16s = function (numInt16s) {
    this.position += numInt16s * ByteBuffer.INT16_SIZE;
};

/**
 * Skip over the specified number of 32-bit integers.
 * @param {Number} numInt32s The number of 32-bit integers to skip.
 */
ByteBuffer.prototype.skipInt32s = function (numInt32s) {
    this.position += numInt32s * ByteBuffer.INT32_SIZE;
};

/**
 * Skip over the specified number of single precision floating point numbers.
 * @param {Number} numFloats The number of single precision floating point numbers to skip.
 */
ByteBuffer.prototype.skipFloats = function (numFloats) {
    this.position += numFloats * ByteBuffer.FLOAT_SIZE;
};

/**
 * Skip over the specified number of double precision floating point numbers.
 * @param {Number} numDoubles The number of double precision floating point numbers to skip.
 */
ByteBuffer.prototype.skipDoubles = function (numDoubles) {
    this.position += numDoubles * ByteBuffer.DOUBLE_SIZE;
};

/**
 * Advance to a specific position.
 * @param {Number} position The specified position.
 */
ByteBuffer.prototype.seek = function (position) {
    this.position = position;
};

/**
 * Set the byte order of the underlying data.
 * @param {Boolean} order The byte order of the underlying data.
 */
ByteBuffer.prototype.order = function (order) {
    this._order = order;
};

/**
 * Return the total size of the underlying data.
 * @returns {Number} The size of the underlying data.
 */
ByteBuffer.prototype.limit = function () {
    return this.data.byteLength;
};

/**
 * Indicates whether there remains any data to be accessed sequentially.
 * @returns {Boolean} True if more data can be accessed sequentially.
 */
ByteBuffer.prototype.hasRemaining = function () {
    return this.position < this.data.byteLength;
};

/**
 * Access the underlying data in big endian order, where the most significant bits of the data are encountered first.
 * @type {Boolean}
 * @constant
 */
ByteBuffer.BIG_ENDIAN = false;

/**
 * Access the underlying data in little endian order, where the least significant bits of the data are encountered first.
 * @type {Boolean}
 * @constant
 */
ByteBuffer.LITTLE_ENDIAN = true;

/**
 * The size of a byte.
 * @type {Number}
 * @constant
 */
ByteBuffer.BYTE_SIZE = 1;

/**
 * The size of a 16-bit integer.
 * @type {Number}
 * @constant
 */
ByteBuffer.INT16_SIZE = 2;

/**
 * The size of a 32-bit integer.
 * @type {Number}
 * @constant
 */
ByteBuffer.INT32_SIZE = 4;

/**
 * The size of a single precision floating point number.
 * @type {Number}
 * @constant
 */
ByteBuffer.FLOAT_SIZE = 4;

/**
 * The size of a double precision floating point number.
 * @type {Number}
 * @constant
 */
ByteBuffer.DOUBLE_SIZE = 8;

export default ByteBuffer;
