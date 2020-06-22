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
     * Enumeration of different approaches towards the interval and color scales in case of HeatMap layer.
     * Continuous - The distribution of the colors in the color scale is even based on the measure. This is good for the
     *   data sets with even distribution.
     * Quantiles - The distribution of the colors in the color scale is uneven based on the value. It is distributed evenly
     *   based on the measure for the lowest 10%, 10% to 20% and so on. Basically it categorizes measures based on to which
     *   quantile the measure belongs. This is good for data sets with uneven distribution.
     * @exports HeatMapIntervalType
     * @type {{CONTINUOUS: number, QUANTILES: number}}
     */
    var HeatMapIntervalType = {
        CONTINUOUS: 0,
        QUANTILES: 1
    };

    export default HeatMapIntervalType;
