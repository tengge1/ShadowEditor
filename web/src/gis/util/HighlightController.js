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
 * @exports HighlightController
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';


/**
 * Constructs a highlight controller and associates it with a specified WorldWindow.
 * @alias HighlightController
 * @constructor
 * @classdesc Monitors mouse-move and touch-device tap events and highlights shapes they identify.
 * @param {WorldWindow} worldWindow The WorldWindow to monitor for mouse-move and tap events.
 * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
 */
function HighlightController(worldWindow) {
    if (!worldWindow) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "HighlightController", "constructor",
            "missingWorldWindow"));
    }

    /**
     * This controller's WorldWindow
     * @type {WorldWindow}
     * @readonly
     */
    this.worldWindow = worldWindow;

    var highlightedItems = [];

    var handlePick = function (o) {
        // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
        // the mouse or tap location.
        var x = o.clientX,
            y = o.clientY;

        var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previous shapes

        // De-highlight any previously highlighted shapes.
        for (var h = 0; h < highlightedItems.length; h++) {
            highlightedItems[h].highlighted = false;
        }
        highlightedItems = [];

        // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
        // relative to the upper left corner of the canvas rather than the upper left corner of the page.
        var pickList = worldWindow.pick(worldWindow.canvasCoordinates(x, y));
        if (pickList.objects.length > 0) {
            redrawRequired = true;
        }

        // Highlight the items picked by simply setting their highlight flag to true.
        if (pickList.objects.length > 0) {
            for (var p = 0; p < pickList.objects.length; p++) {
                if (!pickList.objects[p].isTerrain) {
                    pickList.objects[p].userObject.highlighted = true;

                    // Keep track of highlighted items in order to de-highlight them later.
                    highlightedItems.push(pickList.objects[p].userObject);
                }
            }
        }

        // Update the window if we changed anything.
        if (redrawRequired) {
            worldWindow.redraw(); // redraw to make the highlighting changes take effect on the screen
        }
    };

    // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
    this.worldWindow.addEventListener("mousemove", handlePick);

    // Listen for taps on mobile devices and highlight the placemarks that the user taps.
    var tapRecognizer = new WorldWind.TapRecognizer(this.worldWindow, handlePick);
}

export default HighlightController;
