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
 * @exports ViewControlsLayer
 */
import Angle from '../geom/Angle';
import ArgumentError from '../error/ArgumentError';
import Layer from '../layer/Layer';
import Location from '../geom/Location';
import Logger from '../util/Logger';
import Offset from '../util/Offset';
import ScreenImage from '../shapes/ScreenImage';
import Vec2 from '../geom/Vec2';
        

        /**
         * Constructs a view controls layer.
         * @alias ViewControlsLayer
         * @constructor
         * @augments {Layer}
         * @classdesc Displays and manages view controls.
         * @param {WorldWindow} worldWindow The WorldWindow associated with this layer.
         * This layer may not be associated with more than one WorldWindow. Each WorldWindow must have it's own
         * instance of this layer if each window is to have view controls.
         *
         * <p>
         *     Placement of the controls within the WorldWindow is defined by the
         *     [placement]{@link ViewControlsLayer#placement} and [alignment]{@link ViewControlsLayer#alignment}
         *     properties. The default values of these properties place the view controls at the lower left corner
         *     of the WorldWindow. The placement property specifies the overall position of the controls within the
         *     WorldWindow. The alignment property specifies the alignment of the controls collection relative to
         *     the placement position. Some common combinations are:
         *     <table>
         *         <tr>
         *             <th>Location</th>
         *             <th>Placement</th>
         *             <th>Alignment</th>
         *         </tr>
         *         <tr>
         *             <td>Bottom Left</td>
         *             <td>WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0</td>
         *             <td>WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0</td>
         *         </tr>
         *         <tr>
         *             <td>Top Right</td>
         *             <td>WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 1</td>
         *             <td>WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 1</td>
         *         </tr>
         *         <tr>
         *             <td>Top Left</td>
         *             <td>WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 1</td>
         *             <td>WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 1</td>
         *         </tr>
         *         <tr>
         *             <td>Bottom Center</td>
         *             <td>WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0</td>
         *             <td>WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0</td>
         *         </tr>
         *         <tr>
         *             <td>Southeast</td>
         *             <td>WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.25</td>
         *             <td>WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.5</td>
         *         </tr>
         *     </table>
         * </p>
         * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
         */
        var ViewControlsLayer = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ViewControlsLayer", "constructor", "missingWorldWindow"));
            }

            Layer.call(this, "View Controls");

            /**
             * The WorldWindow associated with this layer.
             * @type {WorldWindow}
             * @readonly
             */
            this.wwd = worldWindow;

            /**
             * An {@link Offset} indicating where to place the controls on the screen.
             * @type {Offset}
             * @default The lower left corner of the window with an 11px margin.
             */
            this.placement = new Offset(WorldWind.OFFSET_PIXELS, 11, WorldWind.OFFSET_PIXELS, 11);

            /**
             * An {@link Offset} indicating the alignment of the control collection relative to the
             * [placement position]{@link ViewControlsLayer#placement}. A value of
             * {WorldWind.FRACTION, 0, WorldWind.Fraction 0} places the bottom left corner of the control collection
             * at the placement position.
             * @type {Offset}
             * @default The lower left corner of the control collection.
             */
            this.alignment = new Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0);

            /**
             * The incremental vertical exaggeration to apply each cycle.
             * @type {Number}
             * @default 0.01
             */
            this.exaggerationIncrement = 0.01;

            /**
             * The incremental amount to increase or decrease the eye distance (for zoom) each cycle.
             * @type {Number}
             * @default 0.04 (4%)
             */
            this.zoomIncrement = 0.04;

            /**
             * The incremental amount to increase or decrease the heading each cycle, in degrees.
             * @type {Number}
             * @default 1.0
             */
            this.headingIncrement = 1.0;

            /**
             * The incremental amount to increase or decrease the tilt each cycle, in degrees.
             * @type {Number}
             */
            this.tiltIncrement = 1.0;

            /**
             * The incremental amount to narrow or widen the field of view each cycle, in degrees.
             * @type {Number}
             * @default 0.1
             */
            this.fieldOfViewIncrement = 0.1;

            /**
             * The scale factor governing the pan speed. Increased values cause faster panning.
             * @type {Number}
             * @default 0.001
             */
            this.panIncrement = 0.001;

            // These are documented in their property accessors below.
            this._inactiveOpacity = 0.5;
            this._activeOpacity = 1.0;

            // Set the screen and image offsets of each control to the lower left corner.
            var screenOffset = new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0),
                imagePath = WorldWind.configuration.baseUrl + "images/view/";

            // These controls are all internal and intentionally not documented.
            this.panControl = new ScreenImage(screenOffset.clone(), imagePath + "view-pan-64x64.png");
            this.zoomInControl = new ScreenImage(screenOffset.clone(), imagePath + "view-zoom-in-32x32.png");
            this.zoomOutControl = new ScreenImage(screenOffset.clone(), imagePath + "view-zoom-out-32x32.png");
            this.headingLeftControl = new ScreenImage(screenOffset.clone(), imagePath + "view-heading-left-32x32.png");
            this.headingRightControl = new ScreenImage(screenOffset.clone(), imagePath + "view-heading-right-32x32.png");
            this.tiltUpControl = new ScreenImage(screenOffset.clone(), imagePath + "view-pitch-up-32x32.png");
            this.tiltDownControl = new ScreenImage(screenOffset.clone(), imagePath + "view-pitch-down-32x32.png");
            this.exaggerationUpControl = new ScreenImage(screenOffset.clone(), imagePath + "view-elevation-up-32x32.png");
            this.exaggerationDownControl = new ScreenImage(screenOffset.clone(), imagePath + "view-elevation-down-32x32.png");
            this.fovNarrowControl = new ScreenImage(screenOffset.clone(), imagePath + "view-fov-narrow-32x32.png");
            this.fovWideControl = new ScreenImage(screenOffset.clone(), imagePath + "view-fov-wide-32x32.png");

            // Disable the FOV controls by default.
            this.fovNarrowControl.enabled = false;
            this.fovWideControl.enabled = false;

            // Put the controls in an array so we can easily apply bulk operations.
            this.controls = [
                this.panControl,
                this.zoomInControl,
                this.zoomOutControl,
                this.headingLeftControl,
                this.headingRightControl,
                this.tiltUpControl,
                this.tiltDownControl,
                this.exaggerationUpControl,
                this.exaggerationDownControl,
                this.fovNarrowControl,
                this.fovWideControl
            ];

            // Set the default alignment and opacity for each control.
            for (var i = 0; i < this.controls.length; i++) {
                this.controls[i].imageOffset = screenOffset.clone();
                this.controls[i].opacity = this._inactiveOpacity;
                if (this.controls[i] === this.panControl) {
                    this.controls[i].size = 64;
                } else {
                    this.controls[i].size = 32;
                }
            }

            // Internal variable to keep track of pan control center for use during interaction.
            this.panControlCenter = new Vec2(0, 0);

            // No picking for this layer. It performs its own picking.
            this.pickEnabled = false;

            // Establish event handlers.
            this.wwd.worldWindowController.addGestureListener(this);
        };

        ViewControlsLayer.prototype = Object.create(Layer.prototype);

        Object.defineProperties(ViewControlsLayer.prototype, {
            /**
             * Indicates whether to display the pan control.
             * @type {Boolean}
             * @default true
             * @memberof ViewControlsLayer.prototype
             */
            showPanControl: {
                get: function () {
                    return this.panControl.enabled;
                },
                set: function (value) {
                    this.panControl.enabled = value;
                }
            },

            /**
             * Indicates whether to display the zoom control.
             * @type {Boolean}
             * @default true
             * @memberof ViewControlsLayer.prototype
             */
            showZoomControl: {
                get: function () {
                    return this.zoomInControl.enabled;
                },
                set: function (value) {
                    this.zoomInControl.enabled = value;
                    this.zoomOutControl.enabled = value;
                }
            },

            /**
             * Indicates whether to display the heading control.
             * @type {Boolean}
             * @default true
             * @memberof ViewControlsLayer.prototype
             */
            showHeadingControl: {
                get: function () {
                    return this.headingLeftControl.enabled;
                },
                set: function (value) {
                    this.headingLeftControl.enabled = value;
                    this.headingRightControl.enabled = value;
                }
            },

            /**
             * Indicates whether to display the tilt control.
             * @type {Boolean}
             * @default true
             * @memberof ViewControlsLayer.prototype
             */
            showTiltControl: {
                get: function () {
                    return this.tiltUpControl.enabled;
                },
                set: function (value) {
                    this.tiltUpControl.enabled = value;
                    this.tiltDownControl.enabled = value;
                }
            },

            /**
             * Indicates whether to display the vertical exaggeration control.
             * @type {Boolean}
             * @default true
             * @memberof ViewControlsLayer.prototype
             */
            showExaggerationControl: {
                get: function () {
                    return this.exaggerationUpControl.enabled;
                },
                set: function (value) {
                    this.exaggerationUpControl.enabled = value;
                    this.exaggerationDownControl.enabled = value;
                }
            },

            /**
             * Indicates whether to display the field of view control.
             * @type {Boolean}
             * @default false
             * @memberof ViewControlsLayer.prototype
             */
            showFieldOfViewControl: {
                get: function () {
                    return this.fovNarrowControl.enabled;
                },
                set: function (value) {
                    this.fovNarrowControl.enabled = value;
                    this.fovWideControl.enabled = value;
                }
            },

            /**
             * The opacity of the controls when they are not in use. The opacity should be a value between 0 and 1,
             * with 1 indicating fully opaque.
             * @type {Number}
             * @default 0.5
             * @memberof ViewControlsLayer.prototype
             */
            inactiveOpacity: {
                get: function () {
                    return this._inactiveOpacity;
                },
                set: function (value) {
                    this._inactiveOpacity = value;
                    for (var i = 0; i < this.controls.length; i++) {
                        this.controls[i].opacity = value;
                    }
                }
            },

            /**
             * The opacity of the controls when they are in use. The opacity should be a value between 0 and 1,
             * with 1 indicating fully opaque.
             * @type {Number}
             * @default 1
             * @memberof ViewControlsLayer.prototype
             */
            activeOpacity: {
                get: function () {
                    return this._activeOpacity;
                },
                set: function (value) {
                    this._activeOpacity = value;
                    for (var i = 0; i < this.controls.length; i++) {
                        this.controls[i].opacity = value;
                    }
                }
            }
        });

        // Documented in superclass.
        ViewControlsLayer.prototype.doRender = function (dc) {
            var controlPanelWidth = 0, controlPanelHeight = 64,
                panelOffset, screenOffset,
                x, y;

            this.inCurrentFrame = false; // to track whether any control is displayed this frame

            // Determine the dimensions of the control panel and whether any control is displayed.
            if (this.showPanControl) {
                controlPanelWidth += this.panControl.size;
                this.inCurrentFrame = true;
            }
            if (this.showZoomControl) {
                controlPanelWidth += this.zoomInControl.size;
                this.inCurrentFrame = true;
            }
            if (this.showHeadingControl) {
                controlPanelWidth += this.headingLeftControl.size;
                this.inCurrentFrame = true;
            }
            if (this.showTiltControl) {
                controlPanelWidth += this.tiltDownControl.size;
                this.inCurrentFrame = true;
            }
            if (this.showExaggerationControl) {
                controlPanelWidth += this.exaggerationDownControl.size;
                this.inCurrentFrame = true;
            }
            if (this.showFieldOfViewControl) {
                controlPanelWidth += this.fovNarrowControl.size;
                this.inCurrentFrame = true;
            }

            // Determine the lower-left corner position of the control collection.
            screenOffset = this.placement.offsetForSize(dc.viewport.width,
                dc.viewport.height);
            panelOffset = this.alignment.offsetForSize(controlPanelWidth, controlPanelHeight);
            x = screenOffset[0] - panelOffset[0];
            y = screenOffset[1] - panelOffset[1];

            // Determine the control positions and render the controls.

            if (this.showPanControl) {
                this.panControl.screenOffset.x = x;
                this.panControl.screenOffset.y = y;
                this.panControl.render(dc);
                this.panControlCenter[0] = x + this.panControl.size / 2;
                this.panControlCenter[1] = y + this.panControl.size / 2;
                x += this.panControl.size;
            }

            if (this.showZoomControl) {
                this.zoomOutControl.screenOffset.x = x;
                this.zoomOutControl.screenOffset.y = y;
                this.zoomInControl.screenOffset.x = x;
                this.zoomInControl.screenOffset.y = y + this.zoomOutControl.size;
                this.zoomOutControl.render(dc);
                this.zoomInControl.render(dc);
                x += this.zoomOutControl.size;
            }

            if (this.showHeadingControl) {
                this.headingRightControl.screenOffset.x = x;
                this.headingRightControl.screenOffset.y = y;
                this.headingLeftControl.screenOffset.x = x;
                this.headingLeftControl.screenOffset.y = y + this.headingLeftControl.size;
                this.headingRightControl.render(dc);
                this.headingLeftControl.render(dc);
                x += this.headingLeftControl.size;
            }

            if (this.showTiltControl) {
                this.tiltDownControl.screenOffset.x = x;
                this.tiltDownControl.screenOffset.y = y;
                this.tiltUpControl.screenOffset.x = x;
                this.tiltUpControl.screenOffset.y = y + this.tiltDownControl.size;
                this.tiltDownControl.render(dc);
                this.tiltUpControl.render(dc);
                x += this.tiltDownControl.size;
            }

            if (this.showExaggerationControl) {
                this.exaggerationDownControl.screenOffset.x = x;
                this.exaggerationDownControl.screenOffset.y = y;
                this.exaggerationUpControl.screenOffset.x = x;
                this.exaggerationUpControl.screenOffset.y = y + this.exaggerationDownControl.size;
                this.exaggerationUpControl.render(dc);
                this.exaggerationDownControl.render(dc);
                x += this.exaggerationDownControl.size;
            }

            if (this.showFieldOfViewControl) {
                this.fovNarrowControl.screenOffset.x = x;
                this.fovNarrowControl.screenOffset.y = y;
                this.fovWideControl.screenOffset.x = x;
                this.fovWideControl.screenOffset.y = y + this.fovNarrowControl.size;
                this.fovNarrowControl.render(dc);
                this.fovWideControl.render(dc);
            }
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.isPointerDown = function (e) {
            if (e.type === "pointerdown") {
                return true;
            }
            else if (e.type === "mousedown" && e.which === 1) {
                return true;
            }

            return false;
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.isPointerUp = function (e) {
            if (e.type === "pointerup") {
                return true;
            }
            else if (e.type === "mouseup" && e.which === 1) {
                return true;
            }

            return false;
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.isPointerMove = function (e) {
            if (e.type === "pointermove") {
                return true;
            }
            else if (e.type === "mousemove") {
                return true;
            }

            return false;
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.isTouchStart = function (e) {
            return e.type === "touchstart";
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.isTouchEnd = function (e) {
            return e.type === "touchend" || e.type === "touchcancel";
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.isTouchMove = function (e) {
            return e.type === "touchmove";
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.onGestureEvent = function (e) {
            var handled = false, topObject;

            if (!this.enabled) {
                return handled;
            }

            // Turn off any highlight. If a control is in use it will be highlighted later.
            if (this.highlightedControl) {
                this.highlight(this.highlightedControl, false);
                this.wwd.redraw();
            }

            var terminateActive = false;

            if (e.type && this.activeControl) {
                if (this.isPointerUp(e)) {
                    terminateActive = true;
                }
                else if (this.isTouchEnd(e) && this.isCurrentTouch(e)) {
                    terminateActive = true;
                }
                else {
                    topObject = this.pickControl(e);
                    if (this.activeControl !== topObject) {
                        terminateActive = true;
                    }
                }
            }

            // Terminate the active operation when the mouse button goes up or touches end.
            if (terminateActive) {
                this.activeControl = null;
                this.activeOperation = null;
                e.preventDefault();
            } else {
                // Perform the active operation, or determine it and then perform it.
                if (this.activeOperation) {
                    handled = this.activeOperation.call(this, e, null);
                    e.preventDefault();
                } else {
                    topObject = this.pickControl(e);
                    if (topObject) {
                        var operation = this.determineOperation(e, topObject);
                        if (operation) {
                            handled = operation.call(this, e, topObject);
                        }
                    }
                }

                // Determine and display the new highlight state.
                this.handleHighlight(e, topObject);
                this.wwd.redraw();
            }

            return handled;

        };

        // Intentionally not documented. Determines whether a picked object is a view control.
        ViewControlsLayer.prototype.isControl = function (controlCandidate) {
            for (var i = 0; i < this.controls.length; i++) {
                if (this.controls[i] == controlCandidate) {
                    return true;
                }
            }
            return false;
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.pickControl = function (e) {
            var cx, cy;

            if (e.changedTouches) {
                var touch = e.changedTouches.item(0);
                cx = touch.clientX;
                cy = touch.clientY;
            }
            else {
                cx = e.clientX;
                cy = e.clientY;
            }

            var pickPoint = this.wwd.canvasCoordinates(cx, cy);

            var x = pickPoint[0], y = this.wwd.canvas.height - pickPoint[1],
                control;

            // TODO: Performance optimizations
            for (var i = 0; i < this.controls.length; i++) {
                control = this.controls[i];

                if (control.enabled) {
                    if (x >= control.screenOffset.x && x <= (control.screenOffset.x + control.size)
                        && y >= control.screenOffset.y && y <= (control.screenOffset.y + control.size)) {
                        return control;
                    }
                }
            }

            return null;
        };

        // Intentionally not documented. Determines which operation to perform from the picked object.
        ViewControlsLayer.prototype.determineOperation = function (e, topObject) {
            var operation = null;

            if (topObject && (topObject instanceof ScreenImage)) {
                if (topObject === this.panControl) {
                    operation = this.handlePan;
                } else if (topObject === this.zoomInControl
                    || topObject === this.zoomOutControl) {
                    operation = this.handleZoom;
                } else if (topObject === this.headingLeftControl
                    || topObject === this.headingRightControl) {
                    operation = this.handleHeading;
                } else if (topObject === this.tiltUpControl
                    || topObject === this.tiltDownControl) {
                    operation = this.handleTilt;
                } else if (topObject === this.exaggerationUpControl
                    || topObject === this.exaggerationDownControl) {
                    operation = this.handleExaggeration;
                } else if (topObject === this.fovNarrowControl
                    || topObject === this.fovWideControl) {
                    operation = this.handleFov;
                }
            }

            return operation;
        };

        // Intentionally not documented. Determines whether an event represents the touch of the active operation.
        ViewControlsLayer.prototype.isCurrentTouch = function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches.item(i).identifier === this.currentTouchId) {
                    return true;
                }
            }

            return false;
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.handlePan = function (e, control) {
            var handled = false;

            // Capture the current position.
            if (this.isPointerDown(e) || this.isPointerMove(e)) {
                this.currentEventPoint = this.wwd.canvasCoordinates(e.clientX, e.clientY);
            } else if (this.isTouchStart(e) || this.isTouchMove(e)) {
                var touch = e.changedTouches.item(0);
                this.currentEventPoint = this.wwd.canvasCoordinates(touch.clientX, touch.clientY);
            }

            // Start an operation on left button down or touch start.
            if (this.isPointerDown(e) || this.isTouchStart(e)) {
                this.activeControl = control;
                this.activeOperation = this.handlePan;
                e.preventDefault();

                if (this.isTouchStart(e)) {
                    this.currentTouchId = e.changedTouches.item(0).identifier; // capture the touch identifier
                }

                // This function is called by the timer to perform the operation.
                var thisLayer = this; // capture 'this' for use in the function
                var setLookAtLocation = function () {
                    if (thisLayer.activeControl) {
                        var dx = thisLayer.panControlCenter[0] - thisLayer.currentEventPoint[0],
                            dy = thisLayer.panControlCenter[1]
                                - (thisLayer.wwd.viewport.height - thisLayer.currentEventPoint[1]),
                            oldLat = thisLayer.wwd.navigator.lookAtLocation.latitude,
                            oldLon = thisLayer.wwd.navigator.lookAtLocation.longitude,
                            // Scale the increment by a constant and the relative distance of the eye to the surface.
                            scale = thisLayer.panIncrement
                                * (thisLayer.wwd.navigator.range / thisLayer.wwd.globe.radiusAt(oldLat, oldLon)),
                            heading = thisLayer.wwd.navigator.heading + (Math.atan2(dx, dy) * Angle.RADIANS_TO_DEGREES),
                            distance = scale * Math.sqrt(dx * dx + dy * dy);

                        Location.greatCircleLocation(thisLayer.wwd.navigator.lookAtLocation, heading, -distance,
                            thisLayer.wwd.navigator.lookAtLocation);
                        thisLayer.wwd.redraw();
                        setTimeout(setLookAtLocation, 50);
                    }
                };
                setTimeout(setLookAtLocation, 50);

                handled = true;
            }

            return handled;
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.handleZoom = function (e, control) {
            var handled = false;

            // Start an operation on left button down or touch start.
            if (this.isPointerDown(e) || this.isTouchStart(e)) {
                this.activeControl = control;
                this.activeOperation = this.handleZoom;
                e.preventDefault();

                if (this.isTouchStart(e)) {
                    this.currentTouchId = e.changedTouches.item(0).identifier; // capture the touch identifier
                }

                // This function is called by the timer to perform the operation.
                var thisLayer = this; // capture 'this' for use in the function
                var setRange = function () {
                    if (thisLayer.activeControl) {
                        if (thisLayer.activeControl === thisLayer.zoomInControl) {
                            thisLayer.wwd.navigator.range *= (1 - thisLayer.zoomIncrement);
                        } else if (thisLayer.activeControl === thisLayer.zoomOutControl) {
                            thisLayer.wwd.navigator.range *= (1 + thisLayer.zoomIncrement);
                        }
                        thisLayer.wwd.redraw();
                        setTimeout(setRange, 50);
                    }
                };
                setTimeout(setRange, 50);

                handled = true;
            }

            return handled;
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.handleHeading = function (e, control) {
            var handled = false;

            // Start an operation on left button down or touch start.
            if (this.isPointerDown(e) || this.isTouchStart(e)) {
                this.activeControl = control;
                this.activeOperation = this.handleHeading;
                e.preventDefault();

                if (this.isTouchStart(e)) {
                    this.currentTouchId = e.changedTouches.item(0).identifier; // capture the touch identifier
                }

                // This function is called by the timer to perform the operation.
                var thisLayer = this; // capture 'this' for use in the function
                var setRange = function () {
                    if (thisLayer.activeControl) {
                        if (thisLayer.activeControl === thisLayer.headingLeftControl) {
                            thisLayer.wwd.navigator.heading += thisLayer.headingIncrement;
                        } else if (thisLayer.activeControl === thisLayer.headingRightControl) {
                            thisLayer.wwd.navigator.heading -= thisLayer.headingIncrement;
                        }
                        thisLayer.wwd.redraw();
                        setTimeout(setRange, 50);
                    }
                };
                setTimeout(setRange, 50);
                handled = true;
            }

            return handled;
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.handleTilt = function (e, control) {
            var handled = false;

            // Start an operation on left button down or touch start.
            if (this.isPointerDown(e) || this.isTouchStart(e)) {
                this.activeControl = control;
                this.activeOperation = this.handleTilt;
                e.preventDefault();

                if (this.isTouchStart(e)) {
                    this.currentTouchId = e.changedTouches.item(0).identifier; // capture the touch identifier
                }

                // This function is called by the timer to perform the operation.
                var thisLayer = this; // capture 'this' for use in the function
                var setRange = function () {
                    if (thisLayer.activeControl) {
                        if (thisLayer.activeControl === thisLayer.tiltUpControl) {
                            thisLayer.wwd.navigator.tilt =
                                Math.max(0, thisLayer.wwd.navigator.tilt - thisLayer.tiltIncrement);
                        } else if (thisLayer.activeControl === thisLayer.tiltDownControl) {
                            thisLayer.wwd.navigator.tilt =
                                Math.min(90, thisLayer.wwd.navigator.tilt + thisLayer.tiltIncrement);
                        }
                        thisLayer.wwd.redraw();
                        setTimeout(setRange, 50);
                    }
                };
                setTimeout(setRange, 50);

                handled = true;
            }

            return handled;
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.handleExaggeration = function (e, control) {
            var handled = false;

            // Start an operation on left button down or touch start.
            if (this.isPointerDown(e) || this.isTouchStart(e)) {
                this.activeControl = control;
                this.activeOperation = this.handleExaggeration;
                e.preventDefault();

                if (this.isTouchStart(e)) {
                    this.currentTouchId = e.changedTouches.item(0).identifier; // capture the touch identifier
                }

                // This function is called by the timer to perform the operation.
                var thisLayer = this; // capture 'this' for use in the function
                var setExaggeration = function () {
                    if (thisLayer.activeControl) {
                        if (thisLayer.activeControl === thisLayer.exaggerationUpControl) {
                            thisLayer.wwd.verticalExaggeration += thisLayer.exaggerationIncrement;
                        } else if (thisLayer.activeControl === thisLayer.exaggerationDownControl) {
                            thisLayer.wwd.verticalExaggeration =
                                Math.max(1, thisLayer.wwd.verticalExaggeration - thisLayer.exaggerationIncrement);
                        }
                        thisLayer.wwd.redraw();
                        setTimeout(setExaggeration, 50);
                    }
                };
                setTimeout(setExaggeration, 50);

                handled = true;
            }

            return handled;
        };

        // Intentionally not documented.
        ViewControlsLayer.prototype.handleFov = function (e, control) {
            var handled = false;

            // Start an operation on left button down or touch start.
            if (this.isPointerDown(e) || this.isTouchStart(e)) {
                this.activeControl = control;
                this.activeOperation = this.handleFov;
                e.preventDefault();

                if (this.isTouchStart(e)) {
                    this.currentTouchId = e.changedTouches.item(0).identifier; // capture the touch identifier
                }

                // This function is called by the timer to perform the operation.
                var thisLayer = this; // capture 'this' for use in the function
                var setRange = function () {
                    if (thisLayer.activeControl) {
                        if (thisLayer.activeControl === thisLayer.fovWideControl) {
                            thisLayer.wwd.navigator.fieldOfView =
                                Math.max(90, thisLayer.wwd.navigator.fieldOfView + thisLayer.fieldOfViewIncrement);
                        } else if (thisLayer.activeControl === thisLayer.fovNarrowControl) {
                            thisLayer.wwd.navigator.fieldOfView =
                                Math.min(0, thisLayer.wwd.navigator.fieldOfView - thisLayer.fieldOfViewIncrement);
                        }
                        thisLayer.wwd.redraw();
                        setTimeout(setRange, 50);
                    }
                };
                setTimeout(setRange, 50);
                handled = true;
            }

            return handled;
        };

        // Intentionally not documented. Determines whether to highlight a control.
        ViewControlsLayer.prototype.handleHighlight = function (e, topObject) {
            if (this.activeControl) {
                // Highlight the active control.
                this.highlight(this.activeControl, true);
            } else if (topObject && this.isControl(topObject)) {
                // Highlight the control under the cursor or finger.
                this.highlight(topObject, true);
            }
        };

        // Intentionally not documented. Sets the highlight state of a control.
        ViewControlsLayer.prototype.highlight = function (control, tf) {
            control.opacity = tf ? this._activeOpacity : this._inactiveOpacity;

            if (tf) {
                this.highlightedControl = control;
            } else {
                this.highlightedControl = null;
            }
        };

        export default ViewControlsLayer;
    