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
 * @exports Navigator
 */



/**
 * Constructs a base navigator.
 * @alias Navigator
 * @constructor
 * @classdesc Provides an abstract base class for navigators. This class is not meant to be instantiated
 * directly. See {@Link LookAtNavigator} for a concrete navigator.
 */
function Navigator() {
    /**
     * This navigator's heading, in degrees clockwise from north.
     * @type {Number}
     * @default 0
     */
    this.heading = 0;

    /**
     * This navigator's tilt, in degrees.
     * @type {Number}
     * @default 0
     */
    this.tilt = 0;

    /**
     * This navigator's roll, in degrees.
     * @type {Number}
     * @default 0
     */
    this.roll = 0;
}

export default Navigator;
