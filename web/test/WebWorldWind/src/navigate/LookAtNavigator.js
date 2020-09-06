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
import Location from '../geom/Location';
import Navigator from '../navigate/Navigator';

/**
 * Constructs a look-at navigator.
 * @alias LookAtNavigator
 */
function LookAtNavigator() {
    Navigator.call(this);

    /**
     * The geographic location at the center of the viewport.
     * @type {Location}
     */
    this.lookAtLocation = new Location(37.145952371394245, 110.05951598184991);

    /**
     * The distance from this navigator's eye point to its look-at location.
     * @type {Number}
     * @default 10,000 kilometers
     */
    this.range = 67043860.7580466;
}

LookAtNavigator.prototype = Object.create(Navigator.prototype);

export default LookAtNavigator;
