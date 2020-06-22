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
 * @exports TiffIFDEntry
 */
import AbstractError from '../../error/AbstractError';
import ArgumentError from '../../error/ArgumentError';
import GeoTiffUtil from './GeoTiffUtil';
import Logger from '../../util/Logger';
import TiffConstants from './TiffConstants';
        

        /**
         * Constructs an image file directory entry. Applications typically do not call this constructor. It is called
         * by {@link GeoTiffReader} as GeoTIFF image file directories are read.
         * @alias TiffIFDEntry
         * @constructor
         * @classdesc Contains the data associated with a GeoTIFF image file directory. An image file directory
         * contains information about the image, as well as pointers to the actual image data.
         * @param {Number} tag The TIFF tag that identifies the field.
         * @param {Number} type The type of the field.
         * @param {Number} count The number of values, count of the indicated type.
         * @param {Number} valueOffset  The file offset (in bytes) of the Value for the field. This file offset may
         * point anywhere in the file, even after the image data.
         * @param {ArrayBuffer} geoTiffData The buffer descriptor of the geotiff file's content.
         * @param {Boolean} isLittleEndian Indicates whether the geotiff byte order is little endian.
         * @throws {ArgumentError} If either the specified tag, type, count, valueOffset, geoTiffData or isLittleEndian
         * are null or undefined.
         */
        var TiffIFDEntry = function (tag, type, count, valueOffset, geoTiffData, isLittleEndian) {
            if (!tag) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingTag"));
            }

            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingType"));
            }

            if (!count) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingCount"));
            }

            if (valueOffset === null || valueOffset === undefined) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingValueOffset"));
            }

            if (!geoTiffData) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingGeoTiffData"));
            }

            if (isLittleEndian === null || isLittleEndian === undefined) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingIsLittleEndian"));
            }

            // Documented in defineProperties below.
            this._tag = tag;

            // Documented in defineProperties below.
            this._type = type;

            // Documented in defineProperties below.
            this._count = count;

            // Documented in defineProperties below.
            this._valueOffset = valueOffset;

            // Documented in defineProperties below.
            this._geoTiffData = geoTiffData;

            // Documented in defineProperties below.
            this._isLittleEndian = isLittleEndian;
        };

        Object.defineProperties(TiffIFDEntry.prototype, {

            /**
             * The tag that identifies the field as specified to this TiffIFDEntry's constructor.
             * @memberof TiffIFDEntry.prototype
             * @type {Number}
             * @readonly
             */
            tag: {
                get: function () {
                    return this._tag;
                }
            },

            /**
             * The field type as specified to this TiffIFDEntry's constructor.
             * @memberof TiffIFDEntry.prototype
             * @type {Number}
             * @readonly
             */
            type: {
                get: function () {
                    return this._type;
                }
            },

            /**
             * The number of the values as specified to this TiffIFDEntry's constructor.
             * @memberof TiffIFDEntry.prototype
             * @type {Number}
             * @readonly
             */
            count: {
                get: function () {
                    return this._count;
                }
            },

            /**
             * The file offset as specified to this TiffIFDEntry's constructor.
             * @memberof TiffIFDEntry.prototype
             * @type {Number}
             * @readonly
             */
            valueOffset: {
                get: function () {
                    return this._valueOffset;
                }
            },

            /**
             * The geotiff buffer data as specified to this TiffIFDEntry's constructor.
             * @memberof TiffIFDEntry.prototype
             * @type {ArrayBuffer}
             * @readonly
             */
            geoTiffData: {
                get: function () {
                    return this._geoTiffData;
                }
            },

            /**
             * The little endian byte order flag as specified to this TiffIFDEntry's constructor.
             * @memberof TiffIFDEntry.prototype
             * @type {Boolean}
             * @readonly
             */
            isLittleEndian: {
                get: function () {
                    return this._isLittleEndian;
                }
            }
        });

        /**
         * Get the number of bytes of an image file directory depending on its type.
         * @returns {Number}
         */
        TiffIFDEntry.prototype.getIFDTypeLength = function () {
            switch(this.type){
                case TiffConstants.Type.BYTE:
                case TiffConstants.Type.ASCII:
                case TiffConstants.Type.SBYTE:
                case TiffConstants.Type.UNDEFINED:
                    return 1;
                case TiffConstants.Type.SHORT:
                case TiffConstants.Type.SSHORT:
                    return 2;
                case TiffConstants.Type.LONG:
                case TiffConstants.Type.SLONG:
                case TiffConstants.Type.FLOAT:
                    return 4;
                case TiffConstants.Type.RATIONAL:
                case TiffConstants.Type.SRATIONAL:
                case TiffConstants.Type.DOUBLE:
                    return 8;
                default:
                    return -1;
            }
        }

        /**
         * Get the value of an image file directory.
         * @returns {Number[]}
         */
        TiffIFDEntry.prototype.getIFDEntryValue = function () {
            var ifdValues = [];
            var value = null;
            var ifdTypeLength = this.getIFDTypeLength();
            var ifdValueSize = ifdTypeLength * this.count;

            if (ifdValueSize <= 4) {
                if (this.isLittleEndian === false) {
                    value = this.valueOffset >>> ((4 - ifdTypeLength) * 8);
                } else {
                    value = this.valueOffset;
                }
                ifdValues.push(value);
            } else {
                for (var i = 0; i < this.count; i++) {
                    var indexOffset = ifdTypeLength * i;

                    if (ifdTypeLength >= 8) {
                        if (this.type === TiffConstants.Type.RATIONAL || this.type === TiffConstants.Type.SRATIONAL) {
                            // Numerator
                            ifdValues.push(GeoTiffUtil.getBytes(this.geoTiffData, this.valueOffset + indexOffset, 4,
                                this.isLittleEndian));
                            // Denominator
                            ifdValues.push(GeoTiffUtil.getBytes(this.geoTiffData, this.valueOffset + indexOffset + 4, 4,
                                this.isLittleEndian));
                        } else if (this.type === TiffConstants.Type.DOUBLE) {
                            ifdValues.push(GeoTiffUtil.getBytes(this.geoTiffData, this.valueOffset + indexOffset, 8,
                                this.isLittleEndian));
                        } else {
                            throw new AbstractError(
                                Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "parse", "invalidTypeOfIFD"));
                        }
                    } else {
                        ifdValues.push(GeoTiffUtil.getBytes(this.geoTiffData, this.valueOffset + indexOffset,
                            ifdTypeLength, this.isLittleEndian));
                    }
                }
            }

            if (this.type === TiffConstants.Type.ASCII) {
                ifdValues.forEach(function (element, index, array) {
                    if (element === 0){
                        array.splice(index, 1);
                    }
                    else{
                        array[index] = String.fromCharCode(element);
                    }
                });

                return ifdValues.join("");
            }

            return ifdValues;
        };

        export default TiffIFDEntry;
    