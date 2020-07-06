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
 * @exports WorldWindowController
 */
import ArgumentError from './error/ArgumentError';
import Logger from './util/Logger';
import UnsupportedOperationError from './error/UnsupportedOperationError';


/**
 * Constructs a root window controller.
 * @alias WorldWindowController
 * @constructor
 * @abstract
 * @classDesc This class provides a base window controller with required properties and methods which sub-classes may
 * inherit from to create custom window controllers for controlling the globe via user interaction.
 * @param {WorldWindow} worldWindow The WorldWindow associated with this layer.
 * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
 */
function WorldWindowController(worldWindow) {
    if (!worldWindow) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowController", "constructor", "missingWorldWindow"));
    }

    /**
     * The WorldWindow associated with this controller.
     * @type {WorldWindow}
     * @readonly
     */
    this.wwd = worldWindow;

    // Intentionally not documented.
    this.allGestureListeners = [];
}

// Intentionally not documented.
WorldWindowController.prototype.onGestureEvent = function (event) {
    var handled = false;

    for (var i = 0; i < this.allGestureListeners.length && !handled; i++) {
        handled |= this.allGestureListeners[i].onGestureEvent(event);
    }

    return handled;
};

// Intentionally not documented.
WorldWindowController.prototype.gestureStateChanged = function (recognizer) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowController", "gestureStateChanged", "abstractInvocation"));
};

/**
 * Registers a gesture event listener on this controller. Registering event listeners using this function
 * enables applications to prevent the controller's default behavior.
 *
 * Listeners must implement an onGestureEvent method to receive event notifications. The onGestureEvent method will
 * receive one parameter containing the information about the gesture event. Returning true from onGestureEvent
 * indicates that the event was processed and will prevent any further handling of the event.
 *
 * When an event occurs, application event listeners are called before WorldWindowController event listeners.
 *
 * @param listener The function to call when the event occurs.
 * @throws {ArgumentError} If any argument is null or undefined.
 */
WorldWindowController.prototype.addGestureListener = function (listener) {
    if (!listener) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowController", "addGestureListener", "missingListener"));
    }

    this.allGestureListeners.push(listener);
};

/**
 * Removes a gesture event listener from this controller. The listener must be the same object passed to
 * addGestureListener. Calling removeGestureListener with arguments that do not identify a currently registered
 * listener has no effect.
 *
 * @param listener The listener to remove. Must be the same object passed to addGestureListener.
 * @throws {ArgumentError} If any argument is null or undefined.
 */
WorldWindowController.prototype.removeGestureListener = function (listener) {
    if (!listener) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowController", "removeGestureListener", "missingListener"));
    }

    var index = this.allGestureListeners.indexOf(listener);
    if (index !== -1) {
        this.allGestureListeners.splice(index, 1); // remove the listener from the list
    }
};

/**
 * Called by WorldWindow to allow the controller to enforce navigation limits. Implementation is not required by
 * sub-classes.
 */
WorldWindowController.prototype.applyLimits = function () {

};

export default WorldWindowController;

