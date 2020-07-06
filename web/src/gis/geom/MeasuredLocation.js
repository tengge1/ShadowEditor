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
 * @exports MeasuredLocation
 */
import Angle from './Angle';
import Location from './Location';


/**
 * Constructs a measured location from a specified latitude and longitude in degrees associated with a measure.
 * @alias MeasuredLocation
 * @constructor
 * @classdesc Represents a latitude, longitude pair in degrees with an associated measure.
 * @augments Location
 * @param {Number} latitude The latitude in degrees.
 * @param {Number} longitude The longitude in degrees.
 * @param {Number} measure The measure in an arbitrary unit.
 */
function MeasuredLocation(latitude, longitude, measure) {
    Location.call(this, latitude, longitude);

    /**
     * The measure in an arbitrary unit.
     * @type {Number}
     */
    this.measure = measure;
}

MeasuredLocation.prototype = Object.create(Location.prototype);

/**
 * Creates a measured location from angles specified in radians.
 * @param {Number} latitudeRadians The latitude in radians.
 * @param {Number} longitudeRadians The longitude in radians.
 * @param {Number} measure The measure in an arbitrary unit.
 * @returns {Location} The new location with latitude and longitude in degrees.
 */
MeasuredLocation.fromRadians = function (latitudeRadians, longitudeRadians, measure) {
    return new MeasuredLocation(latitudeRadians * Angle.RADIANS_TO_DEGREES,
        longitudeRadians * Angle.RADIANS_TO_DEGREES,
        measure);
};

/**
 * Copies this measured location to the latitude, longitude and measure of a specified measured location.
 * @param {MeasuredLocation} measuredLocation The measured location to copy.
 * @return {MeasuredLocation} This measured location, set to the values of the specified measured location.
 * @throws {ArgumentError} If the specified measured location is null or undefined.
 */
MeasuredLocation.prototype.copy = function (measuredLocation) {
    Location.prototype.copy.call(this, measuredLocation);

    this.measure = measuredLocation.measure;

    return this;
};

/**
 * Sets this measured location to the latitude, longitude and measure.
 * @param {Number} latitude The latitude to set
 * @param {Number} longitude The longitude to set
 * @param {Number} measure The measure to set.
 * @return {MeasuredLocation} This measured location, set to the values of the specified latitude, longitude and
 * measure.
 */
MeasuredLocation.prototype.set = function (latitude, longitude, measure) {
    Location.prototype.set.call(this, latitude, longitude);

    this.measure = measure;

    return this;
};

/**
 * Indicates whether this measured location is equal to a specified measured location.
 * @param {MeasuredLocation} measuredLocation The measured location to compare this one to.
 * @returns {Boolean} <code>true</code> if this measured location is equal to the specified measured location,
 * otherwise <code>false</code>.
 */
MeasuredLocation.prototype.equals = function (measuredLocation) {
    return Location.prototype.equals.call(this, measuredLocation)
        && this.measure === measuredLocation.measure;
};

export default MeasuredLocation;
