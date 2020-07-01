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

import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import Logger from './Logger';
import WWMath from './WWMath';


/**
 * Provides utilities for determining the Sun geographic and celestial location.
 * @exports SunPosition
 */
var SunPosition = {

    /**
     * Computes the geographic location of the sun for a given date
     * @param {Date} date
     * @throws {ArgumentError} if the date is missing
     * @return {{latitude: Number, longitude: Number}} the geographic location
     */
    getAsGeographicLocation: function (date) {
        if (date instanceof Date === false) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "SunPosition", "getAsGeographicLocation",
                    "missingDate"));
        }

        var celestialLocation = this.getAsCelestialLocation(date);
        return this.celestialToGeographic(celestialLocation, date);
    },

    /**
     * Computes the celestial location of the sun for a given julianDate
     * @param {Date} date
     * @throws {ArgumentError} if the date is missing
     * @return {{declination: Number, rightAscension: Number}} the celestial location
     */
    getAsCelestialLocation: function (date) {
        if (date instanceof Date === false) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "SunPosition", "getAsCelestialLocation",
                    "missingDate"));
        }

        var julianDate = this.computeJulianDate(date);

        //number of days (positive or negative) since Greenwich noon, Terrestrial Time, on 1 January 2000 (J2000.0)
        var numDays = julianDate - 2451545;

        var meanLongitude = WWMath.normalizeAngle360(280.460 + 0.9856474 * numDays);

        var meanAnomaly = WWMath.normalizeAngle360(357.528 + 0.9856003 * numDays) * Angle.DEGREES_TO_RADIANS;

        var eclipticLongitude = meanLongitude + 1.915 * Math.sin(meanAnomaly) + 0.02 * Math.sin(2 * meanAnomaly);
        var eclipticLongitudeRad = eclipticLongitude * Angle.DEGREES_TO_RADIANS;

        var obliquityOfTheEcliptic = (23.439 - 0.0000004 * numDays) * Angle.DEGREES_TO_RADIANS;

        var declination = Math.asin(Math.sin(obliquityOfTheEcliptic) * Math.sin(eclipticLongitudeRad)) *
            Angle.RADIANS_TO_DEGREES;

        var rightAscension = Math.atan(Math.cos(obliquityOfTheEcliptic) * Math.tan(eclipticLongitudeRad)) *
            Angle.RADIANS_TO_DEGREES;

        //compensate for atan result
        if (eclipticLongitude >= 90 && eclipticLongitude < 270) {
            rightAscension += 180;
        }
        rightAscension = WWMath.normalizeAngle360(rightAscension);

        return {
            declination: declination,
            rightAscension: rightAscension
        };
    },

    /**
     * Converts from celestial coordinates (declination and right ascension) to geographic coordinates
     * (latitude, longitude) for a given julian date
     * @param {{declination: Number, rightAscension: Number}} celestialLocation
     * @param {Date} date
     * @throws {ArgumentError} if celestialLocation or julianDate are missing
     * @return {{latitude: Number, longitude: Number}} the geographic location
     */
    celestialToGeographic: function (celestialLocation, date) {
        if (!celestialLocation) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "SunPosition", "celestialToGeographic",
                    "missingCelestialLocation"));
        }
        if (date instanceof Date === false) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "SunPosition", "celestialToGeographic", "missingDate"));
        }

        var julianDate = this.computeJulianDate(date);

        //number of days (positive or negative) since Greenwich noon, Terrestrial Time, on 1 January 2000 (J2000.0)
        var numDays = julianDate - 2451545;

        //Greenwich Mean Sidereal Time
        var GMST = WWMath.normalizeAngle360(280.46061837 + 360.98564736629 * numDays);

        //Greenwich Hour Angle
        var GHA = WWMath.normalizeAngle360(GMST - celestialLocation.rightAscension);

        var longitude = Angle.normalizedDegreesLongitude(-GHA);

        return {
            latitude: celestialLocation.declination,
            longitude: longitude
        };
    },

    /**
     * Computes the julian date from a javascript date object
     * @param {Date} date
     * @throws {ArgumentError} if the date is missing
     * @return {Number} the julian date
     */
    computeJulianDate: function (date) {
        if (date instanceof Date === false) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "SunPosition", "computeJulianDate", "missingDate"));
        }

        var year = date.getUTCFullYear();
        var month = date.getUTCMonth() + 1;
        var day = date.getUTCDate();
        var hour = date.getUTCHours();
        var minute = date.getUTCMinutes();
        var second = date.getUTCSeconds();

        var dayFraction = (hour + minute / 60 + second / 3600) / 24;

        if (month <= 2) {
            year -= 1;
            month += 12;
        }

        var A = Math.floor(year / 100);
        var B = 2 - A + Math.floor(A / 4);
        var JD0h = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;

        return JD0h + dayFraction;
    }

};

export default SunPosition;

