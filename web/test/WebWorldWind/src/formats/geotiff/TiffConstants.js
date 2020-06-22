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
 * @exports Tiff
 */

        

        /**
         * Provides all of the TIFF tag and subtag constants.
         * @alias TiffConstants
         * @constructor
         * @classdesc Contains all of the TIFF tags that are used to store TIFF information of any type.
         */
        var TiffConstants = {
            /**
             * An object containing all TIFF specific tags.
             * @memberof Tiff
             * @type {Object}
             */
            Tag: {
                'NEW_SUBFILE_TYPE': 254,
                'SUBFILE_TYPE': 255,
                'IMAGE_WIDTH': 256,
                'IMAGE_LENGTH': 257,
                'BITS_PER_SAMPLE': 258,
                'COMPRESSION': 259,
                'PHOTOMETRIC_INTERPRETATION': 262,
                'THRESHHOLDING': 263,
                'CELL_WIDTH': 264,
                'CELL_LENGTH': 265,
                'FILL_ORDER': 266,
                'DOCUMENT_NAME': 269,
                'IMAGE_DESCRIPTION': 270,
                'MAKE': 271,
                'MODEL': 272,
                'STRIP_OFFSETS': 273,
                'ORIENTATION': 274,
                'SAMPLES_PER_PIXEL': 277,
                'ROWS_PER_STRIP': 278,
                'STRIP_BYTE_COUNTS': 279,
                'MIN_SAMPLE_VALUE': 280,
                'MAX_SAMPLE_VALUE': 281,
                'X_RESOLUTION': 282,
                'Y_RESOLUTION': 283,
                'PLANAR_CONFIGURATION': 284,
                'PAGE_NAME': 285,
                'X_POSITION': 286,
                'Y_POSITION': 287,
                'FREE_OFFSETS': 288,
                'FREE_BYTE_COUNTS': 289,
                'GRAY_RESPONSE_UNIT': 290,
                'GRAY_RESPONSE_CURVE': 291,
                'T4_OPTIONS': 292,
                'T6_PTIONS': 293,
                'RESOLUTION_UNIT': 296,
                'PAGE_NUMBER': 297,
                'TRANSFER_FUNCTION': 301,
                'SOFTWARE': 305,
                'DATE_TIME': 306,
                'ARTIST': 315,
                'HOST_COMPUTER': 316,
                'PREDICTOR': 317,
                'WHITE_POINT': 318,
                'PRIMARY_CHROMATICITIES': 319,
                'COLOR_MAP': 320,
                'HALFTONE_HINTS': 321,
                'TILE_WIDTH': 322,
                'TILE_LENGTH': 323,
                'TILE_OFFSETS': 324,
                'TILE_BYTE_COUNTS': 325,
                'INK_SET': 332,
                'INK_NAMES': 333,
                'NUMBER_OF_INKS': 334,
                'DOT_RANGE': 336,
                'TARGET_PRINTER': 337,
                'EXTRA_SAMPLES': 338,
                'SAMPLE_FORMAT': 339,
                'S_MIN_SAMPLE_VALUE': 340,
                'S_MAX_SAMPLE_VALUE': 341,
                'TRANSFER_RANGE': 342,
                'JPEG_PROC': 512,
                'JPEG_INTERCHANGE_FORMAT': 513,
                'JPEG_INTERCHANGE_FORMAT_LENGTH': 514,
                'JPEG_RESTART_INTERVAL': 515,
                'JPEG_LOSSLESS_PREDICTORS': 517,
                'JPEG_POINT_TRANSFORMS': 518,
                'JPEG_Q_TABLES': 519,
                'JPEG_DC_TABLES': 520,
                'JPEG_AC_TABLES': 521,
                'Y_Cb_Cr_COEFFICIENTS': 529,
                'Y_Cb_Cr_SUB_SAMPLING': 530,
                'Y_Cb_Cr_POSITIONING': 531,
                'REFERENCE_BLACK_WHITE': 532,
                'COPYRIGHT': 33432
            },

            /**
             * An object containing all TIFF compression types.
             * @memberof Tiff
             * @type {Object}
             */
            Compression: {
                'UNCOMPRESSED': 1,
                'CCITT_1D': 2,
                'GROUP_3_FAX': 3,
                'GROUP_4_FAX': 4,
                'LZW': 5,
                'JPEG': 6,
                'PACK_BITS': 32773
            },

            /**
             * An object containing all TIFF orientation types.
             * @memberof Tiff
             * @type {Object}
             */
            Orientation: {
                'Row0_IS_TOP__Col0_IS_LHS': 1,
                'Row0_IS_TOP__Col0_IS_RHS': 2,
                'Row0_IS_BOTTOM__Col0_IS_RHS': 3,
                'Row0_IS_BOTTOM__Col0_IS_LHS': 4,
                'Row0_IS_LHS__Col0_IS_TOP': 5,
                'Row0_IS_RHS__Col0_IS_TOP': 6,
                'Row0_IS_RHS__Col0_IS_BOTTOM': 7,
                'Row0_IS_LHS__Col0_IS_BOTTOM': 8
            },

            /**
             * An object containing all TIFF photometric interpretation types.
             * @memberof Tiff
             * @type {Object}
             */
            PhotometricInterpretation: {
                'WHITE_IS_ZERO': 0,
                'BLACK_IS_ZERO': 1,
                'RGB': 2,
                'RGB_PALETTE': 3,
                'TRANSPARENCY_MASK': 4,
                'CMYK': 5,
                'Y_Cb_Cr': 6,
                'CIE_LAB': 7
            },

            /**
             * An object containing all TIFF planar configuration types.
             * @memberof Tiff
             * @type {Object}
             */
            PlanarConfiguration: {
                'CHUNKY': 1,
                'PLANAR': 2
            },

            /**
             * An object containing all TIFF resolution unit types.
             * @memberof Tiff
             * @type {Object}
             */
            ResolutionUnit: {
                'NONE': 1,
                'INCH': 2,
                'CENTIMETER': 3
            },

            /**
             * An object containing all TIFF sample format types.
             * @memberof Tiff
             * @type {Object}
             */
            SampleFormat: {
                'UNSIGNED': 1,
                'SIGNED': 2,
                'IEEE_FLOAT': 3,
                'UNDEFINED': 4,
                'DEFAULT': 1
            },

            /**
             * An object containing all TIFF field types.
             * @memberof Tiff
             * @type {Object}
             */
            Type: {
                'BYTE': 1,
                'ASCII': 2,
                'SHORT': 3,
                'LONG': 4,
                'RATIONAL': 5,
                'SBYTE': 6,
                'UNDEFINED': 7,
                'SSHORT': 8,
                'SLONG': 9,
                'SRATIONAL': 10,
                'FLOAT': 11,
                'DOUBLE': 12
            }
        };

        export default TiffConstants;
    