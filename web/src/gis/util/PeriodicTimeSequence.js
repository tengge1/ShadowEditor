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
 * @exports PeriodicTimeSequence
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';


/**
 * Constructs a time sequence from an ISO 8601 string.
 * @alias PeriodicTimeSequence
 * @constructor
 * @classdesc Represents a time sequence described as an ISO 8601 time-format string as required by WMS.
 * The string must be in the form start/end/period, where start and end are ISO 8601 time values and
 * period is an ISO 8601 period specification. This class provides iteration over the sequence in steps
 * specified by the period. If the start and end dates are different, iteration will start at the start
 * date and end at the end date. If the start and end dates are the same, iteration will start at the
 * specified date and will never end.
 * @param {String} sequenceString The string describing the time sequence.
 * @throws {ArgumentError} If the specified intervalString is null, undefined or not a valid time interval
 * string.
 */
function PeriodicTimeSequence(sequenceString) {
    if (!sequenceString) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "PeriodicTimeSequence", "constructor", "missingString"));
    }

    var intervalParts = sequenceString.split("/");
    if (intervalParts.length !== 3) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "PeriodicTimeSequence", "constructor",
                "The interval string " + sequenceString + " does not contain 3 elements."));
    }

    /**
     * This sequence's sequence string, as specified to the constructor.
     * @type {String}
     * @readonly
     */
    this.sequenceString = sequenceString;

    /**
     * This sequence's start time.
     * @type {Date}
     * @readonly
     */
    this.startTime = new Date(intervalParts[0]);

    /**
     * This sequence's end time.
     * @type {Date}
     * @readonly
     */
    this.endTime = new Date(intervalParts[1]);

    // Intentionally not documented.
    this.intervalMilliseconds = this.endTime.getTime() - this.startTime.getTime();

    // Documented with property accessor below.
    this._currentTime = this.startTime;

    /**
     * Indicates whether this sequence is an infinite sequence -- the start and end dates are the same.
     * @type {Boolean}
     * @readonly
     */
    this.infiniteInterval = this.startTime.getTime() == this.endTime.getTime();

    // Intentionally not documented. The array of sequence increments:
    // year, month, week, day, hours, minutes, seconds
    this.period = PeriodicTimeSequence.parsePeriodString(intervalParts[2], false);
}

Object.defineProperties(PeriodicTimeSequence.prototype, {
    /**
     * This sequence's current time.
     * @type {Date}
     * @default This sequence's start time.
     * @memberof PeriodicTimeSequence.prototype
     */
    currentTime: {
        get: function () {
            return this._currentTime;
        },
        set: function (value) {
            this._currentTime = value;
        }
    },
    /**
     * Indicates the position of this sequence's current time relative to the sequence's total interval,
     * in the range [0, 1]. A value of 0 indicates this sequence's start time. A value of 1 indicates
     * this sequence's end time. A value of 0.5 indicates a current time that's exactly mid-way between
     * this sequence's start time and end time.
     * @type {Number}
     * @memberof PeriodicTimeSequence.prototype
     */
    scaleForCurrentTime: {
        get: function () {
            if (!this.currentTime) {
                return 1;
            } else {
                return (this.currentTime.getTime() - this.startTime.getTime()) / this.intervalMilliseconds;
            }
        }
    }
});

/**
 * Sets this sequence's current time to the next time in the sequence and returns that time.
 * @returns {Date|null} The next time of this sequence, or null if no more times are in the sequence.
 * Use [reset]{@link PeriodicTimeSequence#reset} to re-start this sequence.
 * Use [previous]{@link PeriodicTimeSequence#previous} to step backwards through this sequence.
 */
PeriodicTimeSequence.prototype.next = function () {
    if (!this.currentTime) {
        this.currentTime = this.startTime;
    } else if (this.currentTime.getTime() >= this.endTime.getTime() && !this.infiniteInterval) {
        this.currentTime = null;
    } else {
        this.currentTime = PeriodicTimeSequence.incrementTime(this.currentTime, this.period);
    }

    return this.currentTime;
};

/**
 * Sets this sequence's current time to the previous time in the sequence and returns that time.
 * @returns {Date|null} The previous time of this sequence, or null if the sequence is currently at its start
 * time.
 * Use [next]{@link PeriodicTimeSequence#next} to step forwards through this sequence.
 */
PeriodicTimeSequence.prototype.previous = function () {
    if (!this.currentTime) {
        this.currentTime = this.endTime;
    } else if (this.currentTime.getTime() === this.startTime.getTime()) {
        this.currentTime = null;
    } else {
        this.currentTime = this.getTimeForScale(0.9999 * this.scaleForCurrentTime);
    }

    return this.currentTime;
};

/**
 * Resets this sequence's current time to its start time.
 * Use [next]{@link PeriodicTimeSequence#next} to step forwards through this sequence.
 * Use [previous]{@link PeriodicTimeSequence#previous} to step backwards through this sequence.
 */
PeriodicTimeSequence.prototype.reset = function () {
    this.currentTime = null;
};

/**
 * Returns the time associated with a specified value in the range [0, 1]. A value of 0 returns this
 * sequence's start time. A value of 1 returns this sequence's end time. A value of 0.5 returs a time
 * mid-way between this sequence's start and end times.
 * @param scale The scale value. This value is clamped to the range [0, 1] before the time is determined.
 * @returns {Date}
 */
PeriodicTimeSequence.prototype.getTimeForScale = function (scale) {
    if (scale <= 0) {
        return this.startTime;
    }

    if (scale >= 1) {
        return this.endTime;
    }

    var time = new Date(this.startTime.getTime()),
        previousTime = time,
        s = 0;

    for (s = 0; s < scale; s = (time.getTime() - this.startTime.getTime()) / this.intervalMilliseconds) {
        previousTime = time;
        time = PeriodicTimeSequence.incrementTime(time, this.period);
    }

    return previousTime;
};

// Intentionally not documented. Adds this sequence's period to a specified time.
PeriodicTimeSequence.incrementTime = function (currentTime, period) {
    var newTime = new Date(currentTime.getTime());

    if (period[0] != 0) {
        newTime.setUTCFullYear(newTime.getUTCFullYear() + period[0]);
    }

    if (period[1] != 0) {
        PeriodicTimeSequence.addMonths(newTime, period[1]);
    }

    if (period[2] != 0) {
        newTime.setUTCDate(newTime.getUTCDate() + 7 * period[2]);
    }

    if (period[3] != 0) {
        newTime.setUTCDate(newTime.getUTCDate() + period[3]);
    }

    if (period[4] != 0) {
        newTime.setUTCHours(newTime.getUTCHours() + period[4]);
    }

    if (period[5] != 0) {
        newTime.setUTCMinutes(newTime.getUTCMinutes() + period[5]);
    }

    if (period[6] != 0) {
        newTime.setUTCSeconds(newTime.getUTCSeconds() + period[6]);
    }

    return newTime;
};

// Intentionally not documented.
PeriodicTimeSequence.isLeapYear = function (year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
};

// Intentionally not documented.
PeriodicTimeSequence.getDaysInMonth = function (year, month) {
    return [31, PeriodicTimeSequence.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

// Intentionally not documented.
PeriodicTimeSequence.addMonths = function (date, numMonths) {
    var n = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() + numMonths);
    date.setUTCDate(Math.min(n, PeriodicTimeSequence.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth())));
    return date;
};

/*
 * Parses a ISO8601 period string.
 * @param {String} period iso8601 period string
 * @param {Boolean} distributeOverflow if 'true', the unit overflows are merge into the next higher units.
 */
PeriodicTimeSequence.parsePeriodString = function (period, distributeOverflow) {
    // Taken from https://github.com/nezasa/iso8601-js-period/blob/master/iso8601.js

    // regex splits as follows
    // grp0 omitted as it is equal to the sample
    //
    // | sample            | grp1   | grp2 | grp3 | grp4 | grp5 | grp6       | grp7 | grp8 | grp9 |
    // --------------------------------------------------------------------------------------------
    // | P1Y2M3W           | 1Y2M3W | 1Y   | 2M   | 3W   | 4D   | T12H30M17S | 12H  | 30M  | 17S  |
    // | P3Y6M4DT12H30M17S | 3Y6M4D | 3Y   | 6M   |      | 4D   | T12H30M17S | 12H  | 30M  | 17S  |
    // | P1M               | 1M     |      | 1M   |      |      |            |      |      |      |
    // | PT1M              | 3Y6M4D |      |      |      |      | T1M        |      | 1M   |      |
    // --------------------------------------------------------------------------------------------

    var _distributeOverflow = distributeOverflow ? distributeOverflow : false;
    var valueIndexes = [2, 3, 4, 5, 7, 8, 9];
    var duration = [0, 0, 0, 0, 0, 0, 0];
    var overflowLimits = [0, 12, 4, 7, 24, 60, 60];
    var struct;

    // upcase the string just in case people don't follow the letter of the law
    period = period.toUpperCase().trim();

    // input validation
    if (!period)
        return duration;
    else if (typeof period !== "string") {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "PeriodicTimeSequence", "parsePeriodString",
                "Invalid ISO8601 period string '" + period + "'"));
    }

    // parse the string
    if (struct = /^P((\d+Y)?(\d+M)?(\d+W)?(\d+D)?)?(T(\d+H)?(\d+M)?(\d+S)?)?$/.exec(period)) {

        // remove letters, replace by 0 if not defined
        for (var i = 0; i < valueIndexes.length; i++) {
            var structIndex = valueIndexes[i];
            duration[i] = struct[structIndex] ? +struct[structIndex].replace(/[A-Za-z]+/g, '') : 0;
        }
    }
    else {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "PeriodicTimeSequence", "parsePeriodString",
                "String '" + period + "' is not a valid ISO8601 period."));
    }

    if (_distributeOverflow) {
        // note: stop at 1 to ignore overflow of years
        for (i = duration.length - 1; i > 0; i--) {
            if (duration[i] >= overflowLimits[i]) {
                duration[i - 1] = duration[i - 1] + Math.floor(duration[i] / overflowLimits[i]);
                duration[i] = duration[i] % overflowLimits[i];
            }
        }
    }

    return duration;
};

export default PeriodicTimeSequence;
