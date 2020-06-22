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
import Logger from '../../../util/Logger';
    
    /**
     * Every control used by the KML should inherit from this class. It contains common functionality and basically
     * serves as a reference to what needs to be implemented in the descendants.
     * @alias KmlControls
     * @constructor
     */
    var KmlControls = function() {

    };

    /**
     * Controls added to the KML document will be notified by the update of the Kml document. Hook is method which is
     * called once, when the element is updated. It is necessary to be careful and hook the element only once. The
     * other solution is to make sure the ids will be used correctly.
     */
    KmlControls.prototype.hook = function() {
        Logger.logMessage(Logger.LEVEL_WARNING, "KmlControls", "hook", "Every KML controls should override hook" +
            " method.");
    };

    export default KmlControls;
