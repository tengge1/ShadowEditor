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
 * @exports DBaseFile
 */
import ArgumentError from '../../error/ArgumentError';
import ByteBuffer from '../../util/ByteBuffer';
import DBaseField from '../../formats/shapefile/DBaseField';
import DBaseRecord from '../../formats/shapefile/DBaseRecord';
import Logger from '../../util/Logger';
        

        /**
         * Constructs an object for dBase file at a specified URL. Applications typically do not call this constructor.
         * It is called by {@link {Shapefile} to read attributes for shapes.
         * @alias DBaseFile
         * @constructor
         * @classdesc Parses a dBase file.
         * @param {String} url The location of the dBase file.
         * @throws {ArgumentError} If the specified URL is null or undefined.
         */
        var DBaseFile = function(url) {
            if (!url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "DBaseFile", "constructor", "missingUrl"));
            }

            this.url = url;

            // Internal use only. Intentionally not documented.
            // DBase file data.
            this.header = null;
            this.fields = null;

            // Internal use only. Intentionally not documented.
            // The buffer descriptor to read records from.
            this.buffer = null;

            // Internal use only. Intentionally not documented.
            // Source read parameters.
            this.boolean = true;
            this.numRecordsRead = 0;

            this._completionCallback = null;
        };

        /**
         * The modification date of the the dBase file.
         * @returns {String} The modification date.
         */
        DBaseFile.prototype.getLastModificationDate = function() {
            return this.header.lastModificationDate;
        };

        /**
         * The number of records in the dBase file.
         * @returns {Number} The number of records.
         */
        DBaseFile.prototype.getNumberOfRecords = function() {
            return this.header.numberOfRecords;
        };

        /**
         * The length of the header of the dBase file.
         * @returns {Number} The length of the header.
         */
        DBaseFile.prototype.getHeaderLength = function() {
            return this.header.headerLength;
        };

        /**
         * The length of a record in the dBase file.
         * @returns {Number} The lenght of a recrod.
         */
        DBaseFile.prototype.getRecordLength = function() {
            return this.header.recordLength;
        };

        /**
         * The number of fields in a dBase file.
         * @returns {Number} The number of fields.
         */
        DBaseFile.prototype.getNumberOfFields = function() {
            return (this.header.headerLength - 1 - DBaseFile.FIXED_HEADER_LENGTH) / DBaseFile.FIELD_DESCRIPTOR_LENGTH;
        };

        /**
         * The field descriptors of the dBase file.
         * @returns {DBaseField[]} The field descriptors.
         */
        DBaseFile.prototype.getFields = function() {
            return this.fields;
        };

        /**
         * Indicates whether the dBase file has additional records to read.
         * @returns {Boolean} True if more records can be read.
         */
        DBaseFile.prototype.hasNext = function() {
            return this.numRecordsRead < this.header.numberOfRecords;
        };

        /**
         * Read the next record in the dBase file.
         * @returns {DBaseRecord} The next record.
         */
        DBaseFile.prototype.nextRecord = function() {
            if (this.numRecordsRead >= this.getNumberOfRecords()) {
                return null;
            }

            return this.readNextRecord(this._buffer, ++this.numRecordsRead);
        };

        //**************************************************************//
        //********************  Initialization  ************************//
        //**************************************************************//

        /**
         * Initiate loading of the dBase file.
         * @param completionCallback
         */
        DBaseFile.prototype.load = function(completionCallback) {
            this._completionCallback = completionCallback;

            this.requestUrl(this.url);
        };

        /**
         * Internal use only.
         * Request data from the URL.
         * @param {String} url The URL for the requested data.
         */
        DBaseFile.prototype.requestUrl = function(url) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        this._buffer = new ByteBuffer(xhr.response);

                        this.parse();

                        if (!!this._completionCallback) {
                            this._completionCallback(this);
                        }
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "DBaseFile retrieval failed (" + xhr.statusText + "): " + url);

                        if (!!this._completionCallback) {
                            this._completionCallback(this);
                        }
                    }
                }
            }).bind(this);

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "DBaseFile retrieval failed: " + url);

                if (!!this._completionCallback) {
                    this._completionCallback(this);
                }
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "DBaseFile retrieval timed out: " + url);

                if (!!this._completionCallback) {
                    this._completionCallback(this);
                }
            };

            xhr.send(null);
        };

        /**
         * Parse the dBase file.
         */
        DBaseFile.prototype.parse = function() {
            this.header = this.readHeader(this._buffer);
            this.fields = this.readFieldDescriptors(this._buffer, this.getNumberOfFields());
        };

        //**************************************************************//
        //********************  Header  ********************************//
        //**************************************************************//

        /**
         * Read the header of the dBase file.
         * @param {ByteBuffer} buffer The buffer descriptor to read from.
         * @returns {{
         *      fileCode: Number,
         *      lastModificationDate: {year: number, month: number, day: Number},
         *      numberOfRecords: Number,
         *      headerLength: Number,
         *      recordLength: Number
         * }}
         */
        DBaseFile.prototype.readHeader = function(buffer) {
            var pos = buffer.position;

            buffer.order(ByteBuffer.LITTLE_ENDIAN);

            // Read file code - first byte
            var fileCode = buffer.getByte();
            if (fileCode > 5) {
                // Let the caller catch and log the message.
                // TODO: ??? determine correct type of error
                throw new Error("???");
                //throw new WWUnrecognizedException(Logging.getMessage("SHP.UnrecognizedDBaseFile", fileCode));
            }

            // Last update date
            var yy = buffer.getByte();
            var mm = buffer.getByte();
            var dd = buffer.getByte();

            // Number of records
            var numRecords = buffer.getInt32();

            // Header struct length
            var headerLength = buffer.getInt16();

            // Record length
            var recordLength = buffer.getInt16();

            var date = {
                year: 1900 + yy,
                month: mm - 1,
                day: dd
            };

            // Assemble the header.
            var header = {
                'fileCode': fileCode,
                'lastModificationDate': date,
                'numberOfRecords': numRecords,
                'headerLength': headerLength,
                'recordLength': recordLength
            };

            buffer.seek(pos + DBaseFile.FIXED_HEADER_LENGTH); // Move to end of header.

            return header;
        };

        //**************************************************************//
        //********************  Fields  ********************************//
        //**************************************************************//

        /**
         * Reads a sequence of {@link DBaseField} descriptors from the given buffer;
         * <p/>
         * The buffer current position is assumed to be set at the start of the sequence and will be set to the end of the
         * sequence after this method has completed.
         *
         * @param {ByteBuffer} buffer    A byte buffer descriptor to read from.
         * @param {Number} numFields The number of DBaseFields to read.
         *
         * @return {DBaseField[]} An array of {@link DBaseField} instances.
         */
        DBaseFile.prototype.readFieldDescriptors = function(buffer, numFields) {
            var pos = buffer.position;

            var fields = [];

            for (var i = 0; i < numFields; i += 1) {
                fields[i] = new DBaseField(this, buffer);
            }

            var fieldsLength = this.header.headerLength - DBaseFile.FIXED_HEADER_LENGTH;
            buffer.seek(pos + fieldsLength); // Move to end of fields.

            return fields;
        };

        //**************************************************************//
        //********************  Records  *******************************//
        //**************************************************************//

        /**
         * Reads a {@link DBaseRecord} instance from the given buffer;
         * <p/>
         * The buffer current position is assumed to be set at the start of the record and will be set to the start of the
         * next record after this method has completed.
         *
         * @param {ByteBuffer} buffer       The buffer descriptor to read from.
         * @param {Number} recordNumber The record's sequence number.
         *
         * @return {DBaseRecord} A {@link DBaseRecord} instance.
         */
        DBaseFile.prototype.readNextRecord = function(buffer, recordNumber) {
            return new DBaseRecord(this, buffer, recordNumber);
        };

        //**************************************************************//
        //********************  String Parsing  ************************//
        //**************************************************************//

        /**
         * Read a null-terminated string.
         * @param {ByteBuffer} buffer A buffer descriptor to read from.
         * @param {Number} maxLength The number of maximum characters.
         * @returns {String}
         */
        DBaseFile.prototype.readNullTerminatedString = function(buffer, maxLength) {
            if (maxLength <= 0) {
                return 0;
            }

            var string = "";

            for (var length = 0; length < maxLength; length += 1) {
                var byte = buffer.getByte();
                if (byte == 0) {
                    break;
                }
                string += String.fromCharCode(byte);
            }

            if (this.isStringEmpty(string))
                return "";

            return string;
        };

        /**
         * Indicate whether the string is "logically" empty in the dBase sense.
         * @param {String} string The string of characters.
         * @returns {Boolean} True if the string is logically empty.
         */
        DBaseFile.prototype.isStringEmpty = function(string) {
            return string.length <= 0 ||
                DBaseFile.isStringFilled(string, 0x20) || // Space character.
                DBaseFile.isStringFilled(string, 0x2A); // Asterisk character.
        };

        /**
         * Indicates if the string is filled with constant data of a particular kind.
         * @param {String} string The string of characters.
         * @param {Number} fillValue The character value to test.
         * @returns {Boolean} True if the character array is filled with the specified value.
         */
        DBaseFile.isStringFilled = function(string, fillValue) {
            if (string.length <= 0) {
                return false;
            }

            for (var i = 0; i < string.length; i++) {
                if (string.charAt(i) != fillValue)
                    return false;
            }

            return true;
        };

        /**
         * The length of a dBase file header.
         * @type {Number}
         */
        DBaseFile.FIXED_HEADER_LENGTH = 32;

        /**
         * The length of a dBase file field descriptor.
         * @type {Number}
         */
        DBaseFile.FIELD_DESCRIPTOR_LENGTH = 32;

        export default DBaseFile;
    