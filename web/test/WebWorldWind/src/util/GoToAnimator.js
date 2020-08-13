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
 * @exports GoToAnimator
 */
import Location from '../geom/Location';
import Logger from '../util/Logger';
import Position from '../geom/Position';
import Vec3 from '../geom/Vec3';

/**
 * Constructs a GoTo animator.
 * @alias GoToAnimator
 * @constructor
 * @classdesc Incrementally and smoothly moves a {@link Navigator} to a specified position.
 * @param {WorldWindow} worldWindow The WorldWindow in which to perform the animation.
 * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
 */
function GoToAnimator(worldWindow) {
    if (!worldWindow) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GoToAnimator", "constructor",
            "missingWorldWindow"));
    }

    /**
     * The WorldWindow associated with this animator.
     * @type {WorldWindow}
     * @readonly
     */
    this.wwd = worldWindow;

    /**
     * The frequency in milliseconds at which to animate the position change.
     * @type {Number}
     * @default 20
     */
    this.animationFrequency = 20;

    /**
     * The animation's duration, in milliseconds. When the distance is short, less than twice the viewport
     * size, the travel time is reduced proportionally to the distance to travel. It therefore takes less
     * time to move shorter distances.
     * @type {Number}
     * @default 3000
     */
    this.travelTime = 3000;

    /**
     * Indicates whether the current or most recent animation has been cancelled. Use the cancel() function
     * to cancel an animation.
     * @type {Boolean}
     * @default false
     * @readonly
     */
    this.cancelled = false;
}

// Stop the current animation.
GoToAnimator.prototype.cancel = function () {
    this.cancelled = true;
};

/**
 * Moves the navigator to a specified location or position.
 * @param {Location | Position} position The location or position to move the navigator to. If this
 * argument contains an "altitude" property, as {@link Position} does, the end point of the navigation is
 * at the specified altitude. Otherwise the end point is at the current altitude of the navigator.
 * @param {Function} completionCallback If not null or undefined, specifies a function to call when the
 * animation completes. The completion callback is called with a single argument, this animator.
 * @throws {ArgumentError} If the specified location or position is null or undefined.
 */
GoToAnimator.prototype.goTo = function (position, completionCallback) {
    if (!position) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GoToAnimator", "goTo",
            "missingPosition"));
    }

    this.completionCallback = completionCallback;

    // Reset the cancellation flag.
    this.cancelled = false;

    // Capture the target position and determine its altitude.
    this.targetPosition = new Position(position.latitude, position.longitude,
        position.altitude || this.wwd.navigator.range);

    // Capture the start position and start time.
    this.startPosition = new Position(
        this.wwd.navigator.lookAtLocation.latitude,
        this.wwd.navigator.lookAtLocation.longitude,
        this.wwd.navigator.range);
    this.startTime = Date.now();

    // Determination of the pan and range velocities requires the distance to be travelled.
    var animationDuration = this.travelTime,
        panDistance = Location.greatCircleDistance(this.startPosition, this.targetPosition),
        rangeDistance;

    // Determine how high we need to go to give the user context. The max altitude computed is approximately
    // that needed to fit the start and end positions in the same viewport assuming a 45 degree field of view.
    var pA = this.wwd.globe.computePointFromLocation(
        this.startPosition.latitude, this.startPosition.longitude, new Vec3(0, 0, 0)),
        pB = this.wwd.globe.computePointFromLocation(
            this.targetPosition.latitude, this.targetPosition.longitude, new Vec3(0, 0, 0));
    this.maxAltitude = pA.distanceTo(pB);

    // Determine an approximate viewport size in radians in order to determine whether we actually change
    // the range as we pan to the new location. We don't want to change the range if the distance between
    // the start and target positions is small relative to the current viewport.
    var viewportSize = this.wwd.pixelSizeAtDistance(this.startPosition.altitude)
        * this.wwd.canvas.clientWidth / this.wwd.globe.equatorialRadius;

    if (panDistance <= 2 * viewportSize) {
        // Start and target positions are close, so don't back out.
        this.maxAltitude = this.startPosition.altitude;
    }

    // We need to capture the time the max altitude is reached in order to begin decreasing the range
    // midway through the animation. If we're already above the max altitude, then that time is now since
    // we don't back out if the current altitude is above the computed max altitude.
    this.maxAltitudeReachedTime = this.maxAltitude <= this.wwd.navigator.range ? Date.now() : null;

    // Compute the total range to travel since we need that to compute the range velocity.
    // Note that the range velocity and pan velocity are computed so that the respective animations, which
    // operate independently, finish at the same time.
    if (this.maxAltitude > this.startPosition.altitude) {
        rangeDistance = Math.max(0, this.maxAltitude - this.startPosition.altitude);
        rangeDistance += Math.abs(this.targetPosition.altitude - this.maxAltitude);
    } else {
        rangeDistance = Math.abs(this.targetPosition.altitude - this.startPosition.altitude);
    }

    // Determine which distance governs the animation duration.
    var animationDistance = Math.max(panDistance, rangeDistance / this.wwd.globe.equatorialRadius);
    if (animationDistance === 0) {
        return; // current and target positions are the same
    }

    if (animationDistance < 2 * viewportSize) {
        // Start and target positions are close, so reduce the travel time based on the
        // distance to travel relative to the viewport size.
        animationDuration = Math.min(animationDistance / viewportSize * this.travelTime, this.travelTime);
    }

    // Don't let the animation duration go to 0.
    animationDuration = Math.max(1, animationDuration);

    // Determine the pan velocity, in radians per millisecond.
    this.panVelocity = panDistance / animationDuration;

    // Determine the range velocity, in meters per millisecond.
    this.rangeVelocity = rangeDistance / animationDuration; // meters per millisecond

    // Set up the animation timer.
    var thisAnimator = this;
    var timerCallback = function () {
        if (thisAnimator.cancelled) {
            if (thisAnimator.completionCallback) {
                thisAnimator.completionCallback(thisAnimator);
            }
            return;
        }

        if (thisAnimator.update()) {
            setTimeout(timerCallback, thisAnimator.animationFrequency);
        } else if (thisAnimator.completionCallback) {
            thisAnimator.completionCallback(thisAnimator);
        }
    };
    setTimeout(timerCallback, this.animationFrequency); // invoke it the first time
};

// Intentionally not documented.
GoToAnimator.prototype.update = function () {
    // This is the timer callback function. It invokes the range animator and the pan animator.

    var currentPosition = new Position(
        this.wwd.navigator.lookAtLocation.latitude,
        this.wwd.navigator.lookAtLocation.longitude,
        this.wwd.navigator.range);

    var continueAnimation = this.updateRange(currentPosition);
    continueAnimation = this.updateLocation(currentPosition) || continueAnimation;

    this.wwd.redraw();

    return continueAnimation;
};

// Intentionally not documented.
GoToAnimator.prototype.updateRange = function (currentPosition) {
    // This function animates the range.
    var continueAnimation = false,
        nextRange, elapsedTime;

    // If we haven't reached the maximum altitude, then step-wise increase it. Otherwise step-wise change
    // the range towards the target altitude.
    if (!this.maxAltitudeReachedTime) {
        elapsedTime = Date.now() - this.startTime;
        nextRange = Math.min(this.startPosition.altitude + this.rangeVelocity * elapsedTime, this.maxAltitude);
        // We're done if we get withing 1 meter of the desired range.
        if (Math.abs(this.wwd.navigator.range - nextRange) < 1) {
            this.maxAltitudeReachedTime = Date.now();
        }
        this.wwd.navigator.range = nextRange;
        continueAnimation = true;
    } else {
        elapsedTime = Date.now() - this.maxAltitudeReachedTime;
        if (this.maxAltitude > this.targetPosition.altitude) {
            nextRange = this.maxAltitude - this.rangeVelocity * elapsedTime;
            nextRange = Math.max(nextRange, this.targetPosition.altitude);
        } else {
            nextRange = this.maxAltitude + this.rangeVelocity * elapsedTime;
            nextRange = Math.min(nextRange, this.targetPosition.altitude);
        }
        this.wwd.navigator.range = nextRange;
        // We're done if we get withing 1 meter of the desired range.
        continueAnimation = Math.abs(this.wwd.navigator.range - this.targetPosition.altitude) > 1;
    }

    return continueAnimation;
};

// Intentionally not documented.
GoToAnimator.prototype.updateLocation = function (currentPosition) {
    // This function animates the pan to the desired location.
    var elapsedTime = Date.now() - this.startTime,
        distanceTravelled = Location.greatCircleDistance(this.startPosition, currentPosition),
        distanceRemaining = Location.greatCircleDistance(currentPosition, this.targetPosition),
        azimuthToTarget = Location.greatCircleAzimuth(currentPosition, this.targetPosition),
        distanceForNow = this.panVelocity * elapsedTime,
        nextDistance = Math.min(distanceForNow - distanceTravelled, distanceRemaining),
        nextLocation = Location.greatCircleLocation(currentPosition, azimuthToTarget, nextDistance,
            new Location(0, 0)),
        locationReached = false;

    this.wwd.navigator.lookAtLocation.latitude = nextLocation.latitude;
    this.wwd.navigator.lookAtLocation.longitude = nextLocation.longitude;

    // We're done if we're within a meter of the desired location.
    if (nextDistance < 1 / this.wwd.globe.equatorialRadius) {
        locationReached = true;
    }

    return !locationReached;
};

export default GoToAnimator;
