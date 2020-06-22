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
 * @exports DBaseField
 */
import ArgumentError from '../../error/ArgumentError';
import ByteBuffer from '../../util/ByteBuffer';
import DBaseFile from '../../formats/shapefile/DBaseFile';
import Logger from '../../util/Logger';
        

        /**
         * Constructs a dBase record field. Applications typically do not call this constructor. It is called by
         * {@link {DBaseRecord} as attribute fields are read.
         * @param {DBaseFile} dbaseFile A dBase attribute file.
         * @param {ByteBuffer} buffer A buffer descriptor from which to parse a field.
         * @returns {DBaseField} The dBase field that was parsed.
         * @constructor
         */
        var DBaseField = function(dbaseFile, buffer) {
            if (!dbaseFile) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "DBaseField", "constructor", "missingAttributeName")
                );
            }

            if (!buffer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "DBaseField", "constructor", "missingBuffer")
                );
            }

            /**
             * The name of the field.
             * @type {String}
             */
            this.name = null;

            /**
             * The type of the field.
             * @type {String}
             */
            this.type = null;

            /**
             * The code byte for the field.
             * @type {Number}
             */
            this.typeCode = -1;

            /**
             * The length of the field.
             * @type {Number}
             */
            this.length = -1;

            /**
             * The number of decimals in the field.
             * @type {Number}
             */
            this.decimals = -1;

            this.readFieldDescriptor(dbaseFile, buffer);
        };

        /**
         * The name of the field.
         * @returns {String} The name of the field.
         */
        DBaseField.prototype.getName = function() {
            return this.name;
        };

        /**
         * The type of the field.
         * @returns {String} The type of the field.
         */
        DBaseField.prototype.getType = function() {
            return this.type;
        };

        /**
         * The length of the field.
         * @returns {Number} The length of the field.
         */
        DBaseField.prototype.getLength = function() {
            return this.length;
        };

        /**
         * The number of decimal places in the field.
         * @returns {Number} The number of decimal places.
         */
        DBaseField.prototype.getDecimals = function() {
            return this.decimals;
        };

        /**
         * Read the field descriptor.
         * @param {DBaseFile} dbaseFile The dBase file to read.
         * @param {ByteBuffer} buffer The descriptor of the buffer to read from.
         */
        DBaseField.prototype.readFieldDescriptor = function(dbaseFile, buffer) {
            buffer.order(ByteBuffer.LITTLE_ENDIAN);

            var pos = buffer.position;

            this.name = dbaseFile.readNullTerminatedString(buffer, DBaseField.FIELD_NAME_LENGTH);

            buffer.seek(pos + DBaseField.FIELD_NAME_LENGTH);
            this.typeCode = String.fromCharCode(buffer.getByte());
            this.type = DBaseField.getFieldType(this.typeCode);
            if (this.type == null) {
                // TODO: firgure out type of error.
                throw new Error(
                    Logger.log(Logger.LEVEL_SEVERE, "Shapefile dBase encountered unsupported field type: " + this.typeCode)
                );
            }

            // Skip four byte field address.
            buffer.skipBytes(4);

            this.length = buffer.getByte();
            this.decimals = buffer.getByte();

            buffer.seek(pos + DBaseField.FIELD_DESCRIPTOR_LENGTH); // move to next field
        };

        /**
         * Indicate the type of the field.
         * @param {String} type The type of the field.
         * @returns {String} A description of the field type.
         */
        DBaseField.getFieldType = function(type) {
            switch (type) {
                case 'C':
                    return DBaseField.TYPE_CHAR;
                case 'D':
                    return DBaseField.TYPE_DATE;
                case 'F':
                    return DBaseField.TYPE_NUMBER;
                case 'L':
                    return DBaseField.TYPE_BOOLEAN;
                case 'N':
                    return DBaseField.TYPE_NUMBER;
                default:
                    return null;
            }
        };

        /**
         * Create a string from the field.
         * @returns {String} The dtring for the field.
         */
        DBaseField.prototype.toString = function() {
            return this.name + "(" + this.typeCode + ")";
        };

        /**
         * The description of a character field.
         * @type {String}
         */
        DBaseField.TYPE_CHAR = "DBase.FieldTypeChar";

        /**
         * The description of a number field.
         * @type {String}
         */
        DBaseField.TYPE_NUMBER = "DBase.FieldTypeNumber";

        /**
         * The description of a date field.
         * @type {String}
         */
        DBaseField.TYPE_DATE = "DBase.FieldTypeDate";

        /**
         * The description of a boolean field.
         * @type {String}
         */
        DBaseField.TYPE_BOOLEAN = "DBase.FieldTypeBoolean";

        /**
         * The length of the name field.
         * @type {Number}
         */
        DBaseField.FIELD_NAME_LENGTH = 11;

        /**
         * The length of a descriptor field.
         * @type {Number}
         */
        DBaseField.FIELD_DESCRIPTOR_LENGTH = 32;

        export default DBaseField;
