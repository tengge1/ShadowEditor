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
 * @exports DBaseRecord
 */
import ArgumentError from '../../error/ArgumentError';
import ByteBuffer from '../../util/ByteBuffer';
import DBaseField from '../../formats/shapefile/DBaseField';
import DBaseFile from '../../formats/shapefile/DBaseFile';
import Logger from '../../util/Logger';
        

        /**
         * Create a DBase record. Applications typically do not call this constructor. It is called by
         * {@link DBaseFile} as attribute records are read.
         * @param {DBaseFile} dbaseFile A dBase attribute file.
         * @param {ByteBuffer} buffer A buffer descriptor from which to parse a record.
         * @param {Number} recordNumber The number of the record to parse.
         * @returns {DBaseRecord} The DBase record that was parsed.
         * @constructor
         */
        var DBaseRecord = function(dbaseFile, buffer, recordNumber) {
            if (!dbaseFile) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "DBaseRecord", "constructor", "missingAttributeName")
                );
            }

            if (!buffer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "DBaseRecord", "constructor", "missingBuffer")
                );
            }

            /**
             * Indicates whether the record was deleted.
             * @type {Boolean}
             */
            this.deleted = false;

            /**
             * Indicates the current record number.
             * @type {Number}
             */
            this.recordNumber = recordNumber;

            //DateFormat dateformat = new SimpleDateFormat("yyyyMMdd");

            this.values = null;

            this.readFromBuffer(dbaseFile, buffer, recordNumber);
        };

        /**
         * Returned whether the record was deleted
         * @returns {Boolean} True if the record was deleted.
         */
        DBaseRecord.prototype.isDeleted = function() {
            return this.deleted;
        };

        /**
         * Returns the number of the record.
         * @returns {Number} The number of the record.
         */
        DBaseRecord.prototype.getRecordNumber = function() {
            return this.recordNumber;
        };

        /**
         * Reads a dBase record from the buffer.
         * @param {DBaseFile} dbaseFile The dBase file from which to read a record.
         * @param {ByteBuffer} buffer The buffer descriptor to read the record from.
         * @param {Number} recordNumber The record number to read.
         */
        DBaseRecord.prototype.readFromBuffer = function(dbaseFile, buffer, recordNumber) {
            buffer.order(ByteBuffer.LITTLE_ENDIAN);

            this.recordNumber = recordNumber;

            // Read deleted record flag.
            var b = buffer.getByte();
            this.deleted = (b == 0x2A);

            var fields = dbaseFile.getFields();

            this.values = {};

            for (var idx = 0, len = fields.length; idx < len; idx += 1) {
                var field = fields[idx];

                var key = field.getName();

                var value = dbaseFile.readNullTerminatedString(buffer, field.getLength()).trim();

                try {
                    if (field.getType() == DBaseField.TYPE_BOOLEAN) {
                        var firstChar = value.charAt(0);
                        this.values[key] = firstChar == 't' || firstChar == 'T' || firstChar == 'Y' || firstChar == 'y';
                    }
                    else if (field.getType() == DBaseField.TYPE_CHAR) {
                        this.values[key] = value;
                    }
                    else if (field.getType() == DBaseField.TYPE_DATE) {
                        this.values[key] = new Date(value);
                    }
                    else if (field.getType() == DBaseField.TYPE_NUMBER) {
                        this.values[key] = +value;
                    }
                }
                catch (e) {
                    // Log warning but keep reading.
                    Logger.log(Logger.LEVEL_WARNING,
                        "Shapefile attribute parsing error:" +
                        field.toString() +
                        " -> " +
                        value.toString() +
                        " [" + e + "]"
                    );
                }
            }
        };

        export default DBaseRecord;
    