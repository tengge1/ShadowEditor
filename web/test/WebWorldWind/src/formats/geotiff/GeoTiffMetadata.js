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
 * @exports GeoTiffMetadata
 */

        

        /**
         * Provides GeoTIFF metadata.
         * @alias GeoTiffMetadata
         * @constructor
         * @classdesc Contains all of the TIFF and GeoTIFF metadata for a geotiff file.
         */
        var GeoTiffMetadata = function () {

            // Documented in defineProperties below.
            this._bitsPerSample = null;

            // Documented in defineProperties below.
            this._colorMap = null;

            // Documented in defineProperties below.
            this._compression = null;

            // Documented in defineProperties below.
            this._extraSamples = null;

            // Documented in defineProperties below.
            this._imageDescription = null;

            // Documented in defineProperties below.
            this._imageLength = null;

            // Documented in defineProperties below.
            this._imageWidth = null;

            // Documented in defineProperties below.
            this._maxSampleValue = null;

            // Documented in defineProperties below.
            this._minSampleValue = null;

            // Documented in defineProperties below.
            this._orientation = 0;

            // Documented in defineProperties below.
            this._photometricInterpretation = null;

            // Documented in defineProperties below.
            this._planarConfiguration = null;

            // Documented in defineProperties below.
            this._resolutionUnit = null;

            // Documented in defineProperties below.
            this._rowsPerStrip = null;

            // Documented in defineProperties below.
            this._samplesPerPixel = null;

            // Documented in defineProperties below.
            this._sampleFormat = null;

            // Documented in defineProperties below.
            this._software = null;

            // Documented in defineProperties below.
            this._stripByteCounts = null;

            // Documented in defineProperties below.
            this._stripOffsets = null;

            // Documented in defineProperties below.
            this._tileByteCounts = null;

            // Documented in defineProperties below.
            this._tileOffsets = null;

            // Documented in defineProperties below.
            this._tileLength = null;

            // Documented in defineProperties below.
            this._tileWidth = null;

            // Documented in defineProperties below.
            this._xResolution = null;

            // Documented in defineProperties below.
            this._yResolution = null;

            // Documented in defineProperties below.
            this._geoAsciiParams = null;

            // Documented in defineProperties below.
            this._geoDoubleParams = null;

            // Documented in defineProperties below.
            this._geoKeyDirectory = null;

            // Documented in defineProperties below.
            this._modelPixelScale = null;

            // Documented in defineProperties below.
            this._modelTiepoint = null;

            // Documented in defineProperties below.
            this._modelTransformation = null;

            // Documented in defineProperties below.
            this._noData = null;

            // Documented in defineProperties below.
            this._metaData = null;

            // Documented in defineProperties below.
            this._bbox = null;

            // Documented in defineProperties below.
            this._gtModelTypeGeoKey = null;

            // Documented in defineProperties below.
            this._gtRasterTypeGeoKey = null;

            // Documented in defineProperties below.
            this._gtCitationGeoKey = null;

            // Documented in defineProperties below.
            this._geographicTypeGeoKey = null;

            // Documented in defineProperties below.
            this._geogCitationGeoKey = null;

            // Documented in defineProperties below.
            this._geogAngularUnitsGeoKey = null;

            // Documented in defineProperties below.
            this._geogAngularUnitSizeGeoKey = null;

            // Documented in defineProperties below.
            this._geogSemiMajorAxisGeoKey = null;

            // Documented in defineProperties below.
            this._geogInvFlatteningGeoKey = null;

            // Documented in defineProperties below.
            this._projectedCSType = null;

            // Documented in defineProperties below.
            this._projLinearUnits = null;
        };

        Object.defineProperties(GeoTiffMetadata.prototype, {

            /**
             * Contains the number of bits per component.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number[]}
             */
            bitsPerSample: {
                get: function () {
                    return this._bitsPerSample;
                },

                set: function(value){
                    this._bitsPerSample = value;
                }
            },

            /**
             * Defines a Red-Green-Blue color map (often called a lookup table) for palette color images.
             * In a palette-color image, a pixel value is used to index into an RGB-lookup table.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number[]}
             */
            colorMap: {
                get: function () {
                    return this._colorMap;
                },

                set: function(value){
                    this._colorMap = value;
                }
            },

            /**
             * Contains the compression type of geotiff data.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            compression: {
                get: function () {
                    return this._compression;
                },

                set: function(value){
                    this._compression = value;
                }
            },

            /**
             * Contains the description of extra components.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number[]}
             */
            extraSamples: {
                get: function () {
                    return this._extraSamples;
                },

                set: function(value){
                    this._extraSamples = value;
                }
            },

            /**
             * Contains the image description.
             * @memberof GeoTiffMetadata.prototype
             * @type {String}
             */
            imageDescription: {
                get: function () {
                    return this._imageDescription;
                },

                set: function(value){
                    this._imageDescription = value;
                }
            },

            /**
             * Contains the number of rows in the image.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            imageLength: {
                get: function () {
                    return this._imageLength;
                },

                set: function(value){
                    this._imageLength = value;
                }
            },

            /**
             * Contains the number of columns in the image.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            imageWidth: {
                get: function () {
                    return this._imageWidth;
                },

                set: function(value){
                    this._imageWidth = value;
                }
            },

            /**
             * Contains the maximum component value used.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            maxSampleValue: {
                get: function () {
                    return this._maxSampleValue;
                },

                set: function(value){
                    this._maxSampleValue = value;
                }
            },

            /**
             * Contains the minimum component value used.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            minSampleValue: {
                get: function () {
                    return this._minSampleValue;
                },

                set: function(value){
                    this._minSampleValue = value;
                }
            },

            /**
             * Contains the orientation of the image with respect to the rows and columns.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            orientation: {
                get: function () {
                    return this._orientation;
                },

                set: function(value){
                    this._orientation = value;
                }
            },

            /**
             * Contains the photometric interpretation type of the geotiff file.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            photometricInterpretation: {
                get: function () {
                    return this._photometricInterpretation;
                },

                set: function(value){
                    this._photometricInterpretation = value;
                }
            },

            /**
             * Contains the planar configuration type of the geotiff file.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            planarConfiguration: {
                get: function () {
                    return this._planarConfiguration;
                },

                set: function(value){
                    this._planarConfiguration = value;
                }
            },

            /**
             * Contains the unit of measurement for XResolution and YResolution. The specified values are:
             * <ul>
             *     <li>1 = No absolute unit of measurement</li>
             *     <li>2 = Inch</li>
             *     <li>3 = Centimeter</li>
             * </ul>
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            resolutionUnit: {
                get: function () {
                    return this._resolutionUnit;
                },

                set: function(value){
                    this._resolutionUnit = value;
                }
            },

            /**
             * Contains the number of rows per strip.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            rowsPerStrip: {
                get: function () {
                    return this._rowsPerStrip;
                },

                set: function(value){
                    this._rowsPerStrip = value;
                }
            },

            /**
             * Contains the number of components per pixel.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            samplesPerPixel: {
                get: function () {
                    return this._samplesPerPixel;
                },

                set: function(value){
                    this._samplesPerPixel = value;
                }
            },

            /**
             * This field specifies how to interpret each data sample in a pixel. Possible values are:
             * <ul>
             *     <li>unsigned integer data</li>
             *     <li>two's complement signed integer data</li>
             *     <li>IEEE floating point data</li>
             *     <li>undefined data format</li>
             * </ul>
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            sampleFormat: {
                get: function () {
                    return this._sampleFormat;
                },

                set: function(value){
                    this._sampleFormat = value;
                }
            },

            software: {
                get: function () {
                    return this._software;
                },

                set: function(value){
                    this._software = value;
                }
            },

            /**
             * Contains the number of bytes in that strip after any compression, for each strip.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number[]}
             */
            stripByteCounts: {
                get: function () {
                    return this._stripByteCounts;
                },

                set: function(value){
                    this._stripByteCounts = value;
                }
            },

            /**
             * Contains the byte offset of that strip, for each strip.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number[]}
             */
            stripOffsets: {
                get: function () {
                    return this._stripOffsets;
                },

                set: function(value){
                    this._stripOffsets = value;
                }
            },

            tileByteCounts: {
                get: function () {
                    return this._tileByteCounts;
                },

                set: function(value){
                    this._tileByteCounts = value;
                }
            },

            /**
             * Contains the byte offset of that tile, for each tile.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number[]}
             */
            tileOffsets: {
                get: function () {
                    return this._tileOffsets;
                },

                set: function(value){
                    this._tileOffsets = value;
                }
            },

            tileLength: {
                get: function () {
                    return this._tileLength;
                },

                set: function(value){
                    this._tileLength = value;
                }
            },

            tileWidth: {
                get: function () {
                    return this._tileWidth;
                },

                set: function(value){
                    this._tileWidth = value;
                }
            },

            //geotiff
            /**
             * Contains all of the ASCII valued GeoKeys, referenced by the GeoKeyDirectoryTag.
             * @memberof GeoTiffMetadata.prototype
             * @type {String[]}
             */
            geoAsciiParams: {
                get: function () {
                    return this._geoAsciiParams;
                },

                set: function(value){
                    this._geoAsciiParams = value;
                }
            },

            /**
             * Contains all of the DOUBLE valued GeoKeys, referenced by the GeoKeyDirectoryTag.
             * @memberof GeoTiffMetadata.prototype
             * @type {Nmber[]}
             */
            geoDoubleParams: {
                get: function () {
                    return this._geoDoubleParams;
                },

                set: function(value){
                    this._geoDoubleParams = value;
                }
            },

            /**
             * Contains the values of GeoKeyDirectoryTag.
             * @memberof GeoTiffMetadata.prototype
             * @type {Nmber[]}
             */
            geoKeyDirectory: {
                get: function () {
                    return this._geoKeyDirectory;
                },

                set: function(value){
                    this._geoKeyDirectory = value;
                }
            },

            /**
             * Contains the values of ModelPixelScaleTag. The ModelPixelScaleTag tag may be used to specify the size
             * of raster pixel spacing in the model space units, when the raster space can be embedded in the model
             * space coordinate system without rotation
             * @memberof GeoTiffMetadata.prototype
             * @type {Nmber[]}
             */
            modelPixelScale: {
                get: function () {
                    return this._modelPixelScale;
                },

                set: function(value){
                    this._modelPixelScale = value;
                }
            },

            /**
             * Stores raster->model tiepoint pairs in the order ModelTiepointTag = (...,I,J,K, X,Y,Z...),
             * where (I,J,K) is the point at location (I,J) in raster space with pixel-value K,
             * and (X,Y,Z) is a vector in model space.
             * @memberof GeoTiffMetadata.prototype
             * @type {Nmber[]}
             */
            modelTiepoint: {
                get: function () {
                    return this._modelTiepoint;
                },

                set: function(value){
                    this._modelTiepoint = value;
                }
            },

            /**
             * Contains the information that may be used to specify the transformation matrix between the raster space
             * (and its dependent pixel-value space) and the model space.
             * @memberof GeoTiffMetadata.prototype
             * @type {Nmber[]}
             */
            modelTransformation: {
                get: function () {
                    return this._modelTransformation;
                },

                set: function(value){
                    this._modelTransformation = value;
                }
            },

            /**
             * Contains the NODATA value.
             * @memberof GeoTiffMetadata.prototype
             * @type {String}
             */
            noData: {
                get: function () {
                    return this._noData;
                },

                set: function(value){
                    this._noData = value;
                }
            },

            /**
             * Contains the METADATA value.
             * @memberof GeoTiffMetadata.prototype
             * @type {String}
             */
            metaData: {
                get: function () {
                    return this._metaData;
                },

                set: function(value){
                    this._metaData = value;
                }
            },

            /**
             * Contains the extent of the geotiff.
             * @memberof GeoTiffMetadata.prototype
             * @type {Sector}
             */
            bbox: {
                get: function () {
                    return this._bbox;
                },

                set: function(value){
                    this._bbox = value;
                }
            },

            //geokeys
            /**
             * Contains an ID defining the crs model.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            gtModelTypeGeoKey: {
                get: function () {
                    return this._gtModelTypeGeoKey;
                },

                set: function(value){
                    this._gtModelTypeGeoKey = value;
                }
            },

            /**
             * Contains an ID defining the raster sample type.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            gtRasterTypeGeoKey: {
                get: function () {
                    return this._gtRasterTypeGeoKey;
                },

                set: function(value){
                    this._gtRasterTypeGeoKey = value;
                }
            },

            /**
             * Contains an ASCII reference to the overall configuration of the geotiff file.
             * @memberof GeoTiffMetadata.prototype
             * @type {String}
             */
            gtCitationGeoKey: {
                get: function () {
                    return this._gtCitationGeoKey;
                },

                set: function(value){
                    this._gtCitationGeoKey = value;
                }
            },

            /**
             * Contains a value to specify the code for geographic coordinate system used to map lat-long to a specific
             * ellipsoid over the earth
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            geographicTypeGeoKey: {
                get: function () {
                    return this._geographicTypeGeoKey;
                },

                set: function(value){
                    this._geographicTypeGeoKey = value;
                }
            },

            /**
             * Contains a value to specify the code for geographic coordinate system used to map lat-long to a specific
             * ellipsoid over the earth
             * @memberof GeoTiffMetadata.prototype
             * @type {String}
             */
            geogCitationGeoKey: {
                get: function () {
                    return this._geogCitationGeoKey;
                },

                set: function(value){
                    this._geogCitationGeoKey = value;
                }
            },

            /**
             * Allows the definition of geocentric CS Linear units for used-defined GCS and for ellipsoids
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            geogAngularUnitsGeoKey: {
                get: function () {
                    return this._geogAngularUnitsGeoKey;
                },

                set: function(value){
                    this._geogAngularUnitsGeoKey = value;
                }
            },

            /**
             * Allows the definition of user-defined angular geographic units, as measured in radians
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            geogAngularUnitSizeGeoKey: {
                get: function () {
                    return this._geogAngularUnitSizeGeoKey;
                },

                set: function(value){
                    this._geogAngularUnitSizeGeoKey = value;
                }
            },

            /**
             * Allows the specification of user-defined Ellipsoidal Semi-Major Axis
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            geogSemiMajorAxisGeoKey: {
                get: function () {
                    return this._geogSemiMajorAxisGeoKey;
                },

                set: function(value){
                    this._geogSemiMajorAxisGeoKey = value;
                }
            },

            /**
             * Allows the specification of the inverse of user-defined Ellipsoid's flattening parameter f.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            geogInvFlatteningGeoKey: {
                get: function () {
                    return this._geogInvFlatteningGeoKey;
                },

                set: function(value){
                    this._geogInvFlatteningGeoKey = value;
                }
            },

            /**
             * Contains the EPSG code of the geotiff.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            projectedCSType: {
                get: function () {
                    return this._projectedCSType;
                },

                set: function(value){
                    this._projectedCSType = value;
                }
            },

            /**
             * Contains the linear units of the geotiff.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            projLinearUnits: {
                get: function () {
                    return this._projLinearUnits;
                },

                set: function(value){
                    this._projLinearUnits = value;
                }
            },

            /**
             * Contains the number of pixels per resolution unit in the image width direction.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            xResolution: {
                get: function () {
                    return this._xResolution;
                },

                set: function(value){
                    this._xResolution = value;
                }
            },

            /**
             * Contains the number of pixels per resolution unit in the image length direction.
             * @memberof GeoTiffMetadata.prototype
             * @type {Number}
             */
            yResolution: {
                get: function () {
                    return this._yResolution;
                },

                set: function(value){
                    this._yResolution = value;
                }
            }
        });

        export default GeoTiffMetadata;
    