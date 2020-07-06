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
 * Descendant of Date.
 * @param dateInFormat {String} Any format of date accepted by the Date constructor.
 * @constructor
 * @alias DateWW
 */
function DateWW(dateInFormat) {
    if (dateInFormat) {
        this._date = new Date(dateInFormat);
    } else {
        this._date = new Date();
    }
}

DateWW.prototype = Object.create(Date.prototype);

DateWW.prototype.isAfter = function (date) {
    return this.compare(date) == -1;
};

DateWW.prototype.isBefore = function (date) {
    return this.compare(date) == 1;
};

DateWW.prototype.valueOf = function () {
    return this._date.valueOf();
};

DateWW.prototype.getTime = function () {
    return this._date.getTime();
};

DateWW.prototype.compare = function (date) {
    var currentDate = this._date.valueOf();
    var comparedDate = date.valueOf();

    if (currentDate > comparedDate) {
        return -1;
    } else if (currentDate < comparedDate) {
        return 1;
    } else {
        return 0;
    }
};

export default DateWW;
