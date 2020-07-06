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
 * @exports GpuResourceCache
 */
import AbsentResourceList from '../util/AbsentResourceList';
import ArgumentError from '../error/ArgumentError';
import ImageSource from '../util/ImageSource';
import Logger from '../util/Logger';
import MemoryCache from '../cache/MemoryCache';
import Texture from '../render/Texture';


/**
 * Constructs a GPU resource cache for a specified size and low-water value.
 * @alias GpuResourceCache
 * @constructor
 * @classdesc Maintains a cache of GPU resources such as textures and GLSL programs.
 * Applications typically do not interact with this class unless they create their own shapes.
 * @param {Number} capacity The cache capacity, in bytes.
 * @param {Number} lowWater The number of bytes to clear the cache to when it exceeds its capacity.
 * @throws {ArgumentError} If the specified capacity is undefined, 0 or negative or the low-water value is
 * undefined, negative or not less than the capacity.
 */
function GpuResourceCache(capacity, lowWater) {
    if (!capacity || capacity < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "GpuResourceCache", "constructor",
                "Specified cache capacity is undefined, 0 or negative."));
    }

    if (!lowWater || lowWater < 0 || lowWater >= capacity) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "GpuResourceCache", "constructor",
                "Specified cache low-water value is undefined, negative or not less than the capacity."));
    }

    // Private. Holds the actual cache entries.
    this.entries = new MemoryCache(capacity, lowWater);

    // Private. Counter for generating cache keys.
    this.cacheKeyPool = 0;

    // Private. List of retrievals currently in progress.
    this.currentRetrievals = {};

    // Private. Identifies requested resources that whose retrieval failed.
    this.absentResourceList = new AbsentResourceList(3, 60e3);
}

Object.defineProperties(GpuResourceCache.prototype, {
    /**
     * Indicates the capacity of this cache in bytes.
     * @type {Number}
     * @readonly
     * @memberof GpuResourceCache.prototype
     */
    capacity: {
        get: function () {
            return this.entries.capacity;
        }
    },

    /**
     * Indicates the low-water value for this cache in bytes, the size this cache is cleared to when it
     * exceeds its capacity.
     * @type {Number}
     * @readonly
     * @memberof GpuResourceCache.prototype
     */
    lowWater: {
        get: function () {
            return this.entries.lowWater;
        }
    },

    /**
     * Indicates the number of bytes currently used by this cache.
     * @type {Number}
     * @readonly
     * @memberof GpuResourceCache.prototype
     */
    usedCapacity: {
        get: function () {
            return this.entries.usedCapacity;
        }
    },

    /**
     * Indicates the number of free bytes in this cache.
     * @type {Number}
     * @readonly
     * @memberof GpuResourceCache.prototype
     */
    freeCapacity: {
        get: function () {
            return this.entries.freeCapacity;
        }
    }
});

/**
 * Creates a cache key unique to this cache, typically for a resource about to be added to this cache.
 * @returns {String} The generated cache key.
 */
GpuResourceCache.prototype.generateCacheKey = function () {
    return "GpuResourceCache " + ++this.cacheKeyPool;
};

/**
 * Adds a specified resource to this cache. Replaces the existing resource for the specified key if the
 * cache currently contains a resource for that key.
 * @param {String|ImageSource} key The key or image source of the resource to add.
 * @param {Object} resource The resource to add to the cache.
 * @param {Number} size The resource's size in bytes. Must be greater than 0.
 * @throws {ArgumentError} If either the key or resource arguments is null or undefined
 * or if the specified size is less than 1.
 */
GpuResourceCache.prototype.putResource = function (key, resource, size) {
    if (!key) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "GpuResourceCache", "putResource", "missingKey."));
    }

    if (!resource) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "GpuResourceCache", "putResource", "missingResource."));
    }

    if (!size || size < 1) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "GpuResourceCache", "putResource",
                "The specified resource size is undefined or less than 1."));
    }

    var entry = {
        resource: resource
    };

    this.entries.putEntry(key instanceof ImageSource ? key.key : key, entry, size);
};

/**
 * Returns the resource associated with a specified key.
 * @param {String|ImageSource} key The key or image source of the resource to find.
 * @returns {Object} The resource associated with the specified key, or null if the resource is not in
 * this cache or the specified key is null or undefined.
 */
GpuResourceCache.prototype.resourceForKey = function (key) {
    var entry = key instanceof ImageSource
        ? this.entries.entryForKey(key.key) : this.entries.entryForKey(key);

    var resource = entry ? entry.resource : null;

    // This is faster than checking if the resource is a texture using instanceof.
    if (resource !== null && typeof resource.clearTexParameters === "function") {
        resource.clearTexParameters();
    }

    return resource;
};

/**
 * Sets a resource's aging factor (multiplier).
 * @param {String} key The key of the resource to modify. If null or undefined, the resource's cache entry is not modified.
 * @param {Number} agingFactor A multiplier applied to the age of the resource.
 */
GpuResourceCache.prototype.setResourceAgingFactor = function (key, agingFactor) {
    this.entries.setEntryAgingFactor(key, agingFactor);
};

/**
 * Indicates whether a specified resource is in this cache.
 * @param {String|ImageSource} key The key or image source of the resource to find.
 * @returns {Boolean} true If the resource is in this cache, false if the resource
 * is not in this cache or the specified key is null or undefined.
 */
GpuResourceCache.prototype.containsResource = function (key) {
    return this.entries.containsKey(key instanceof ImageSource ? key.key : key);
};

/**
 * Removes the specified resource from this cache. The cache is not modified if the specified key is null or
 * undefined or does not correspond to an entry in the cache.
 * @param {String|ImageSource} key The key or image source of the resource to remove.
 */
GpuResourceCache.prototype.removeResource = function (key) {
    this.entries.removeEntry(key instanceof ImageSource ? key.key : key);
};

/**
 * Removes all resources from this cache.
 */
GpuResourceCache.prototype.clear = function () {
    this.entries.clear(false);
};

/**
 * Retrieves an image and adds it to this cache when it arrives. If the specified image source is a URL, a
 * retrieval request for the image is made and this method returns immediately with a value of null. A redraw
 * event is generated when the image subsequently arrives and is added to this cache. If the image source is an
 * {@link ImageSource}, the image is used immediately and this method returns the {@link Texture} created and
 * cached for the image. No redraw event is generated in this case.
 * @param {WebGLRenderingContext} gl The current WebGL context.
 * @param {String|ImageSource} imageSource The image source, either a {@link ImageSource} or a String
 * giving the URL of the image.
 * @param {GLenum} wrapMode Optional. Specifies the wrap mode of the texture. Defaults to gl.CLAMP_TO_EDGE
 * @returns {Texture} The {@link Texture} created for the image if the specified image source is an
 * {@link ImageSource}, otherwise null.
 */
GpuResourceCache.prototype.retrieveTexture = function (gl, imageSource, wrapMode) {
    if (!imageSource) {
        return null;
    }

    if (imageSource instanceof ImageSource) {
        var t = new Texture(gl, imageSource.image, wrapMode);
        this.putResource(imageSource.key, t, t.size);
        return t;
    }

    if (this.currentRetrievals[imageSource] || this.absentResourceList.isResourceAbsent(imageSource)) {
        return null;
    }

    var cache = this,
        image = new Image();

    image.onload = function () {
        Logger.log(Logger.LEVEL_INFO, "Image retrieval succeeded: " + imageSource);

        var texture = new Texture(gl, image, wrapMode);

        cache.putResource(imageSource, texture, texture.size);

        delete cache.currentRetrievals[imageSource];
        cache.absentResourceList.unmarkResourceAbsent(imageSource);

        // Send an event to request a redraw.
        var e = document.createEvent('Event');
        e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
        window.dispatchEvent(e);
    };

    image.onerror = function () {
        delete cache.currentRetrievals[imageSource];
        cache.absentResourceList.markResourceAbsent(imageSource);
        Logger.log(Logger.LEVEL_WARNING, "Image retrieval failed: " + imageSource);
    };

    this.currentRetrievals[imageSource] = imageSource;
    image.crossOrigin = 'anonymous';
    image.src = imageSource;

    return null;
};

export default GpuResourceCache;
