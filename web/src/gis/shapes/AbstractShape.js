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
 * @exports AbstractShape
 */
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import MemoryCache from '../cache/MemoryCache';
import Renderable from '../render/Renderable';
import ShapeAttributes from '../shapes/ShapeAttributes';
import UnsupportedOperationError from '../error/UnsupportedOperationError';
import Vec3 from '../geom/Vec3';


/**
 * Constructs an abstract shape instance. Meant to be called only by subclasses.
 * @alias AbstractShape
 * @constructor
 * @augments Renderable
 * @protected
 * @classdesc Provides a base class for shapes other than surface shapes. Implements common attribute handling
 * and rendering flow. This is an abstract class and is meant to be instantiated only by subclasses.
 * <p>
 *     In order to support simultaneous use of this shape by multiple windows and 2D globes, this shape
 *     maintains a cache of data computed relative to the globe displayed in each window. During rendering,
 *     the data for the currently active globe, as indicated in the draw context, is made current.
 *     Subsequently called methods rely on the existence of this data cache entry.
 *
 * @param {ShapeAttributes} attributes The attributes to associate with this shape. May be null, in which case
 * default attributes are associated.
 */
function AbstractShape(attributes) {

    Renderable.call(this);

    // Documented with its property accessor below.
    this._attributes = attributes ? attributes : new ShapeAttributes(null);

    // Documented with its property accessor below.
    this._highlightAttributes = null;

    /**
     * Indicates whether this shape uses its normal attributes or its highlight attributes when displayed.
     * If true, the highlight attributes are used, otherwise the normal attributes are used. The normal
     * attributes are also used if no highlight attributes have been specified.
     * @type {Boolean}
     * @default false
     */
    this.highlighted = false;

    // Private. See defined property below for documentation.
    this._altitudeMode = WorldWind.ABSOLUTE;

    // Internal use only. Intentionally not documented.
    // A position used to compute relative coordinates for the shape.
    this.referencePosition = null;

    // Internal use only. Intentionally not documented.
    // Holds the per-globe data generated during makeOrderedRenderable.
    this.shapeDataCache = new MemoryCache(3, 2);

    // Internal use only. Intentionally not documented.
    // The shape-data-cache data that is for the currently active globe. This field is made current prior to
    // calls to makeOrderedRenderable and doRenderOrdered.
    this.currentData = null;

    // Internal use only. Intentionally not documented.
    this.activeAttributes = null;

    /**
     * Indicates how long to use terrain-specific shape data before regenerating it, in milliseconds. A value
     * of zero specifies that shape data should be regenerated every frame. While this causes the shape to
     * adapt more frequently to the terrain, it decreases performance.
     * @type {Number}
     * @default 2000 (milliseconds)
     */
    this.expirationInterval = 2000;

    /**
     * Indicates whether to use a surface shape to represent this shape when drawn on a 2D globe.
     * @type {Boolean}
     * @default false
     */
    this.useSurfaceShapeFor2D = false;

    this.scratchMatrix = Matrix.fromIdentity(); // scratch variable
}

AbstractShape.prototype = Object.create(Renderable.prototype);

Object.defineProperties(AbstractShape.prototype, {
    /**
     * This shape's normal (non-highlight) attributes.
     * @type {ShapeAttributes}
     * @memberof AbstractShape.prototype
     */
    attributes: {
        get: function () {
            return this._attributes;
        },
        set: function (value) {
            this._attributes = value;

            if (this.surfaceShape) {
                this.surfaceShape.attributes = this._attributes;
            }
        }
    },

    /**
     * This shape's highlight attributes. If null or undefined and this shape's highlight flag is true, this
     * shape's normal attributes are used. If they in turn are null or undefined, this shape is not drawn.
     * @type {ShapeAttributes}
     * @default null
     * @memberof AbstractShape.prototype
     */
    highlightAttributes: {
        get: function () {
            return this._highlightAttributes;
        },
        set: function (value) {
            this._highlightAttributes = value;

            if (this.surfaceShape) {
                this.surfaceShape.highlightAttributes = this._highlightAttributes;
            }
        }
    },

    /**
     * The altitude mode to use when drawing this shape. Recognized values are:
     * <ul>
     *     <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
     *     <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
     *     <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
     * </ul>
     * @type {String}
     * @default WorldWind.ABSOLUTE
     * @memberof AbstractShape.prototype
     */
    altitudeMode: {
        get: function () {
            return this._altitudeMode;
        },
        set: function (altitudeMode) {
            if (!altitudeMode) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "AbstractShape",
                    "altitudeMode", "missingAltitudeMode"));
            }

            this._altitudeMode = altitudeMode;
            this.reset();
        }
    }
});

/**
 * Clears this shape's data cache. Should be called by subclasses when state changes invalidate
 * cached data.
 * @protected
 */
AbstractShape.prototype.reset = function () {
    this.shapeDataCache.clear(false);
    this.surfaceShape = null;
};

AbstractShape.prototype.updateSurfaceShape = function () {
    // Synchronize this AbstractShape's properties with its SurfaceShape's properties. Note that the attributes
    // and the highlightAttributes are synchronized separately.
    this.surfaceShape.displayName = this.displayName;
    this.surfaceShape.highlighted = this.highlighted;
    this.surfaceShape.enabled = this.enabled;
    this.surfaceShape.pathType = this.pathType;
    this.surfaceShape.pickDelegate = this.pickDelegate ? this.pickDelegate : this;
};

AbstractShape.prototype.createSurfaceShape = function () {
    return null;
};

AbstractShape.prototype.render = function (dc) {
    if (!this.enabled) {
        return;
    }

    if (!dc.accumulateOrderedRenderables) {
        return;
    }

    if (dc.globe.is2D() && this.useSurfaceShapeFor2D) {
        if (!this.surfaceShape) {
            this.surfaceShape = this.createSurfaceShape();
            if (this.surfaceShape) {
                this.surfaceShape.attributes = this._attributes;
                this.surfaceShape.highlightAttributes = this._highlightAttributes;
            }
        }

        if (this.surfaceShape) {
            this.updateSurfaceShape();
            this.surfaceShape.render(dc);
            return;
        }
    }

    if (!dc.terrain && this.altitudeMode != WorldWind.ABSOLUTE) {
        return;
    }

    this.establishCurrentData(dc);

    if (dc.globe.projectionLimits && !this.isWithinProjectionLimits(dc)) {
        return;
    }

    // Use the last computed extent to see if this shape is out of view.
    if (this.currentData.extent && !this.intersectsFrustum(dc)) {
        return;
    }

    this.determineActiveAttributes(dc);
    if (!this.activeAttributes) {
        return;
    }

    var orderedRenderable = this.makeOrderedRenderable(dc);
    if (orderedRenderable) {

        // Use the updated extent to see if this shape is out of view.
        if (!this.intersectsFrustum(dc)) {
            return;
        }

        if (dc.isSmall(this.currentData.extent, 1)) {
            return;
        }

        orderedRenderable.layer = dc.currentLayer;
        dc.addOrderedRenderable(orderedRenderable, this.currentData.eyeDistance);
    }
};

/**
 * Draws this shape during ordered rendering. Implements the {@link OrderedRenderable} interface.
 * This method is called by the WorldWindow and is not intended to be called by applications.
 * @param {DrawContext} dc The current draw context.
 */
AbstractShape.prototype.renderOrdered = function (dc) {
    this.currentData = this.shapeDataCache.entryForKey(dc.globeStateKey);

    this.beginDrawing(dc);
    try {
        this.doRenderOrdered(dc);
    } finally {
        this.endDrawing(dc);
    }
};

// Internal. Intentionally not documented.
AbstractShape.prototype.makeOrderedRenderable = function (dc) {
    var or = this.doMakeOrderedRenderable(dc);
    this.currentData.verticalExaggeration = dc.verticalExaggeration;

    return or;
};

/**
 * Called during rendering. Subclasses must override this method with one that creates and enques an
 * ordered renderable for this shape if this shape is to be displayed. Applications do not call this method.
 * @param {DrawContext} dc The current draw context.
 * @protected
 */
AbstractShape.prototype.doMakeOrderedRenderable = function (dc) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "AbstractShape", "makeOrderedRenderable", "abstractInvocation"));
};

/**
 * Called during ordered rendering. Subclasses must override this method to render the shape using the current
 * shape data.
 * @param {DrawContext} dc The current draw context.
 * @protected
 */
AbstractShape.prototype.doRenderOrdered = function (dc) {
    throw new UnsupportedOperationError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "AbstractShape", "doRenderOrdered", "abstractInvocation"));
};

/**
 * Called during ordered rendering. Subclasses may override this method in order to perform operations prior
 * to drawing the shape. Applications do not call this method.
 * @param {DrawContext} dc The current draw context.
 * @protected
 */
AbstractShape.prototype.beginDrawing = function (dc) {
};

/**
 * Called during ordered rendering. Subclasses may override this method in order to perform operations after
 * the shape is drawn. Applications do not call this method.
 * @param {DrawContext} dc The current draw context.
 * @protected
 */
AbstractShape.prototype.endDrawing = function (dc) {
};

// Internal. Intentionally not documented.
AbstractShape.prototype.intersectsFrustum = function (dc) {
    if (this.currentData && this.currentData.extent) {
        if (dc.pickingMode) {
            return this.currentData.extent.intersectsFrustum(dc.pickFrustum);
        } else {
            return this.currentData.extent.intersectsFrustum(dc.frustumInModelCoordinates);
        }
    } else {
        return true;
    }
};

// Internal. Intentionally not documented.
AbstractShape.prototype.establishCurrentData = function (dc) {
    this.currentData = this.shapeDataCache.entryForKey(dc.globeStateKey);
    if (!this.currentData) {
        this.currentData = this.createShapeDataObject();
        this.resetExpiration(this.currentData);
        this.shapeDataCache.putEntry(dc.globeStateKey, this.currentData, 1);
    }

    this.currentData.isExpired = !this.isShapeDataCurrent(dc, this.currentData);
};

/**
 * Creates a new shape data object for the current globe state. Subclasses may override this method to
 * modify the shape data object that this method creates, but must also call this method on this base class.
 * Applications do not call this method.
 * @returns {Object} The shape data object.
 * @protected
 */
AbstractShape.prototype.createShapeDataObject = function () {
    return {
        transformationMatrix: Matrix.fromIdentity(),
        referencePoint: new Vec3(0, 0, 0)
    };
};

// Intentionally not documented.
AbstractShape.prototype.resetExpiration = function (shapeData) {
    // The random addition in the line below prevents all shapes from regenerating during the same frame.
    shapeData.expiryTime = Date.now() + this.expirationInterval + 1e3 * Math.random();
};

/**
 * Indicates whether a specified shape data object is current. Subclasses may override this method to add
 * criteria indicating whether the shape data object is current, but must also call this method on this base
 * class. Applications do not call this method.
 * @param {DrawContext} dc The current draw context.
 * @param {Object} shapeData The object to validate.
 * @returns {Boolean} true if the object is current, otherwise false.
 * @protected
 */
AbstractShape.prototype.isShapeDataCurrent = function (dc, shapeData) {
    return shapeData.verticalExaggeration === dc.verticalExaggeration
        && shapeData.expiryTime > Date.now();
};

// Internal. Intentionally not documented.
AbstractShape.prototype.determineActiveAttributes = function (dc) {
    if (this.highlighted && this._highlightAttributes) {
        this.activeAttributes = this.highlightAttributes;
    } else {
        this.activeAttributes = this._attributes;
    }
};

/**
 * Indicates whether this shape is within the current globe's projection limits. Subclasses may implement
 * this method to perform the test. The default implementation returns true. Applications do not call this
 * method.
 * @param {DrawContext} dc The current draw context.
 * @returns {Boolean} true if this shape is is within or intersects the current globe's projection limits,
 * otherwise false.
 * @protected
 */
AbstractShape.prototype.isWithinProjectionLimits = function (dc) {
    return true;
};

/**
 * Apply the current navigator's model-view-projection matrix.
 * @param {DrawContext} dc The current draw context.
 * @protected
 */
AbstractShape.prototype.applyMvpMatrix = function (dc) {
    this.scratchMatrix.copy(dc.modelviewProjection);
    this.scratchMatrix.multiplyMatrix(this.currentData.transformationMatrix);
    dc.currentProgram.loadModelviewProjection(dc.currentGlContext, this.scratchMatrix);
};

/**
 * Apply the current navigator's model-view-projection matrix with an offset to make this shape's outline
 * stand out.
 * @param {DrawContext} dc The current draw context.
 * @protected
 */
AbstractShape.prototype.applyMvpMatrixForOutline = function (dc) {
    // Causes the outline to stand out from the interior.
    this.scratchMatrix.copy(dc.projection);
    this.scratchMatrix.offsetProjectionDepth(-0.001);
    this.scratchMatrix.multiplyMatrix(dc.modelview);
    this.scratchMatrix.multiplyMatrix(this.currentData.transformationMatrix);
    dc.currentProgram.loadModelviewProjection(dc.currentGlContext, this.scratchMatrix);
};

export default AbstractShape;
