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
 * @exports GeoTiffUtil
 */
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import TiffConstants from './TiffConstants';
        

        var GeoTiffUtil = {

            // Get bytes from an arraybuffer depending on the size. Internal use only.
            getBytes: function (geoTiffData, byteOffset, numOfBytes, isLittleEndian, isSigned) {
                if (numOfBytes <= 0) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "getBytes", "noBytesRequested"));
                } else if (numOfBytes <= 1) {
                    if (isSigned) {
                        return geoTiffData.getInt8(byteOffset, isLittleEndian);
                    }
                    else {
                        return geoTiffData.getUint8(byteOffset, isLittleEndian);
                    }
                } else if (numOfBytes <= 2) {
                    if (isSigned) {
                        return geoTiffData.getInt16(byteOffset, isLittleEndian);
                    }
                    else {
                        return geoTiffData.getUint16(byteOffset, isLittleEndian);
                    }
                } else if (numOfBytes <= 3) {
                    if (isSigned) {
                        return geoTiffData.getInt32(byteOffset, isLittleEndian) >>> 8;
                    }
                    else {
                        return geoTiffData.getUint32(byteOffset, isLittleEndian) >>> 8;
                    }
                } else if (numOfBytes <= 4) {
                    if (isSigned) {
                        return geoTiffData.getInt32(byteOffset, isLittleEndian);
                    }
                    else {
                        return geoTiffData.getUint32(byteOffset, isLittleEndian);
                    }
                } else if (numOfBytes <= 8) {
                    return geoTiffData.getFloat64(byteOffset, isLittleEndian);
                } else {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "getBytes", "tooManyBytesRequested"));
                }
            },

            // Get sample value from an arraybuffer depending on the sample format. Internal use only.
            getSampleBytes: function (geoTiffData, byteOffset, numOfBytes, sampleFormat, isLittleEndian) {
                var res;

                switch (sampleFormat) {
                    case TiffConstants.SampleFormat.UNSIGNED:
                        res = this.getBytes(geoTiffData, byteOffset, numOfBytes, isLittleEndian, false);
                        break;
                    case TiffConstants.SampleFormat.SIGNED:
                        res = this.getBytes(geoTiffData, byteOffset, numOfBytes, isLittleEndian, true);
                        break;
                    case TiffConstants.SampleFormat.IEEE_FLOAT:
                        if (numOfBytes == 3) {
                            res = geoTiffData.getFloat32(byteOffset, isLittleEndian) >>> 8;
                        } else if (numOfBytes == 4) {
                            res = geoTiffData.getFloat32(byteOffset, isLittleEndian);
                        } else if (numOfBytes == 8) {
                            res = geoTiffData.getFloat64(byteOffset, isLittleEndian);
                        }
                        else {
                            Logger.log(Logger.LEVEL_WARNING, "Do not attempt to parse the data  not handled: " +
                                numOfBytes);
                        }
                        break;
                    case TiffConstants.SampleFormat.UNDEFINED:
                    default:
                        res = this.getBytes(geoTiffData, byteOffset, numOfBytes, isLittleEndian, false);
                        break;
                }

                return res;
            },

            // Get RGBA fill style for a canvas context as a string. Internal use only.
            getRGBAFillValue: function (r, g, b, a) {
                if (typeof a === 'undefined') {
                    a = 1.0;
                }
                return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
            },

            // Clamp color sample from color sample value and number of bits per sample. Internal use only.
            clampColorSample: function (colorSample, bitsPerSample) {
                var multiplier = Math.pow(2, 8 - bitsPerSample);
                return Math.floor((colorSample * multiplier) + (multiplier - 1));
            }
        };

        export default GeoTiffUtil;
    