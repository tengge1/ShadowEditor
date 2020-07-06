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
 * @exports StarFieldLayer
 */
import Layer from './Layer';
import Logger from '../util/Logger';
import Matrix from '../geom/Matrix';
import StarFieldProgram from '../shaders/StarFieldProgram';
import SunPosition from '../util/SunPosition';


/**
 * Constructs a layer showing stars and the Sun around the Earth.
 * If used together with the AtmosphereLayer, the StarFieldLayer must be inserted before the AtmosphereLayer.
 *
 * If you want to use your own star data, the file provided must be .json
 * and the fields 'ra', 'dec' and 'vmag' must be present in the metadata.
 * ra and dec must be expressed in degrees.
 *
 * This layer uses J2000.0 as the ref epoch.
 *
 * If the star data .json file is too big, consider enabling gzip compression on your web server.
 * For more info about enabling gzip compression consult the configuration for your web server.
 *
 * @alias StarFieldLayer
 * @constructor
 * @classdesc Provides a layer showing stars, and the Sun around the Earth
 * @param {URL} starDataSource optional url for the stars data
 * @augments Layer
 */
function StarFieldLayer(starDataSource) {
    Layer.call(this, 'StarField');

    // The StarField Layer is not pickable.
    this.pickEnabled = false;

    /**
     * The size of the Sun in pixels.
     * This can not exceed the maximum allowed pointSize of the GPU.
     * A warning will be given if the size is too big and the allowed max size will be used.
     * @type {Number}
     * @default 128
     */
    this.sunSize = 128;

    /**
     * Indicates weather to show or hide the Sun
     * @type {Boolean}
     * @default true
     */
    this.showSun = true;

    //Documented in defineProperties below.
    this._starDataSource = starDataSource || WorldWind.configuration.baseUrl + 'images/stars.json';
    this._sunImageSource = WorldWind.configuration.baseUrl + 'images/sunTexture.png';

    //Internal use only.
    //The MVP matrix of this layer.
    this._matrix = Matrix.fromIdentity();

    //Internal use only.
    //gpu cache key for the stars vbo.
    this._starsPositionsVboCacheKey = null;

    //Internal use only.
    this._numStars = 0;

    //Internal use only.
    this._starData = null;

    //Internal use only.
    this._minMagnitude = Number.MAX_VALUE;
    this._maxMagnitude = Number.MIN_VALUE;

    //Internal use only.
    //A flag to indicate the star data is currently being retrieved.
    this._loadStarted = false;

    //Internal use only.
    this._minScale = 10e6;

    //Internal use only.
    this._sunPositionsCacheKey = '';
    this._sunBufferView = new Float32Array(4);

    //Internal use only.
    this._MAX_GL_POINT_SIZE = 0;
}

StarFieldLayer.prototype = Object.create(Layer.prototype);

Object.defineProperties(StarFieldLayer.prototype, {
    /**
     * Url for the stars data.
     * @memberof StarFieldLayer.prototype
     * @type {URL}
     */
    starDataSource: {
        get: function () {
            return this._starDataSource;
        },
        set: function (value) {
            this._starDataSource = value;
            this.invalidateStarData();
        }
    },

    /**
     * Url for the sun texture image.
     * @memberof StarFieldLayer.prototype
     * @type {URL}
     */
    sunImageSource: {
        get: function () {
            return this._sunImageSource;
        },
        set: function (value) {
            this._sunImageSource = value;
        }
    }
});

// Documented in superclass.
StarFieldLayer.prototype.doRender = function (dc) {
    if (dc.globe.is2D()) {
        return;
    }

    if (!this.haveResources(dc)) {
        this.loadResources(dc);
        return;
    }

    this.beginRendering(dc);
    try {
        this.doDraw(dc);
    }
    finally {
        this.endRendering(dc);
    }
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.haveResources = function (dc) {
    var sunTexture = dc.gpuResourceCache.resourceForKey(this._sunImageSource);
    return (
        this._starData != null &&
        sunTexture != null
    );
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.loadResources = function (dc) {
    var gl = dc.currentGlContext;
    var gpuResourceCache = dc.gpuResourceCache;

    if (!this._starData) {
        this.fetchStarData();
    }

    var sunTexture = gpuResourceCache.resourceForKey(this._sunImageSource);
    if (!sunTexture) {
        gpuResourceCache.retrieveTexture(gl, this._sunImageSource);
    }
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.beginRendering = function (dc) {
    var gl = dc.currentGlContext;
    dc.findAndBindProgram(StarFieldProgram);
    gl.enableVertexAttribArray(0);
    gl.depthMask(false);
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.doDraw = function (dc) {
    this.loadCommonUniforms(dc);
    this.renderStars(dc);
    if (this.showSun) {
        this.renderSun(dc);
    }
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.loadCommonUniforms = function (dc) {
    var gl = dc.currentGlContext;
    var program = dc.currentProgram;

    var eyePoint = dc.eyePoint;
    var eyePosition = dc.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], {});
    var scale = Math.max(eyePosition.altitude * 1.5, this._minScale);
    this._matrix.copy(dc.modelviewProjection);
    this._matrix.multiplyByScale(scale, scale, scale);
    program.loadModelviewProjection(gl, this._matrix);

    //this subtraction does not work properly on the GPU, it must be done on the CPU
    //possibly due to precision loss
    //number of days (positive or negative) since Greenwich noon, Terrestrial Time, on 1 January 2000 (J2000.0)
    var julianDate = SunPosition.computeJulianDate(this.time || new Date());
    program.loadNumDays(gl, julianDate - 2451545.0);
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.renderStars = function (dc) {
    var gl = dc.currentGlContext;
    var gpuResourceCache = dc.gpuResourceCache;
    var program = dc.currentProgram;

    if (!this._starsPositionsVboCacheKey) {
        this._starsPositionsVboCacheKey = gpuResourceCache.generateCacheKey();
    }
    var vboId = gpuResourceCache.resourceForKey(this._starsPositionsVboCacheKey);
    if (!vboId) {
        vboId = gl.createBuffer();
        var positions = this.createStarsGeometry();
        gpuResourceCache.putResource(this._starsPositionsVboCacheKey, vboId, positions.length * 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }
    else {
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
    }
    dc.frameStatistics.incrementVboLoadCount(1);

    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);

    program.loadMagnitudeRange(gl, this._minMagnitude, this._maxMagnitude);
    program.loadTextureEnabled(gl, false);

    gl.drawArrays(gl.POINTS, 0, this._numStars);
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.renderSun = function (dc) {
    var gl = dc.currentGlContext;
    var program = dc.currentProgram;
    var gpuResourceCache = dc.gpuResourceCache;

    if (!this._MAX_GL_POINT_SIZE) {
        this._MAX_GL_POINT_SIZE = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1];
    }
    if (this.sunSize > this._MAX_GL_POINT_SIZE) {
        Logger.log(Logger.LEVEL_WARNING, 'StarFieldLayer - sunSize is to big, max size allowed is: ' +
            this._MAX_GL_POINT_SIZE);
    }

    var sunCelestialLocation = SunPosition.getAsCelestialLocation(this.time || new Date());

    //.x = declination
    //.y = right ascension
    //.z = point size
    //.w = magnitude
    this._sunBufferView[0] = sunCelestialLocation.declination;
    this._sunBufferView[1] = sunCelestialLocation.rightAscension;
    this._sunBufferView[2] = Math.min(this.sunSize, this._MAX_GL_POINT_SIZE);
    this._sunBufferView[3] = 1;

    if (!this._sunPositionsCacheKey) {
        this._sunPositionsCacheKey = gpuResourceCache.generateCacheKey();
    }
    var vboId = gpuResourceCache.resourceForKey(this._sunPositionsCacheKey);
    if (!vboId) {
        vboId = gl.createBuffer();
        gpuResourceCache.putResource(this._sunPositionsCacheKey, vboId, this._sunBufferView.length * 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
        gl.bufferData(gl.ARRAY_BUFFER, this._sunBufferView, gl.DYNAMIC_DRAW);
    }
    else {
        gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._sunBufferView);
    }
    dc.frameStatistics.incrementVboLoadCount(1);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);

    program.loadTextureEnabled(gl, true);

    var sunTexture = dc.gpuResourceCache.resourceForKey(this._sunImageSource);
    sunTexture.bind(dc);

    gl.drawArrays(gl.POINTS, 0, 1);
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.endRendering = function (dc) {
    var gl = dc.currentGlContext;
    gl.depthMask(true);
    gl.disableVertexAttribArray(0);
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.fetchStarData = function () {
    if (this._loadStarted) {
        return;
    }

    this._loadStarted = true;
    var self = this;
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
            try {
                self._starData = JSON.parse(this.response);
                self.sendRedrawRequest();
            }
            catch (e) {
                Logger.log(Logger.LEVEL_SEVERE, 'StarFieldLayer unable to parse JSON for star data ' +
                    e.toString());
            }
        }
        else {
            Logger.log(Logger.LEVEL_SEVERE, 'StarFieldLayer unable to fetch star data. Status: ' +
                this.status + ' ' + this.statusText);
        }
        self._loadStarted = false;
    };

    xhr.onerror = function () {
        Logger.log(Logger.LEVEL_SEVERE, 'StarFieldLayer unable to fetch star data');
        self._loadStarted = false;
    };

    xhr.ontimeout = function () {
        Logger.log(Logger.LEVEL_SEVERE, 'StarFieldLayer fetch star data has timeout');
        self._loadStarted = false;
    };

    xhr.open('GET', this._starDataSource, true);
    xhr.send();
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.createStarsGeometry = function () {
    var indexes = this.parseStarsMetadata(this._starData.metadata);

    if (indexes.raIndex === -1) {
        throw new Error(
            Logger.logMessage(Logger.LEVEL_SEVERE, 'StarFieldLayer', 'createStarsGeometry',
                'Missing ra field in star data.'));
    }
    if (indexes.decIndex === -1) {
        throw new Error(
            Logger.logMessage(Logger.LEVEL_SEVERE, 'StarFieldLayer', 'createStarsGeometry',
                'Missing dec field in star data.'));
    }
    if (indexes.magIndex === -1) {
        throw new Error(
            Logger.logMessage(Logger.LEVEL_SEVERE, 'StarFieldLayer', 'createStarsGeometry',
                'Missing vmag field in star data.'));
    }

    var data = this._starData.data;
    var positions = [];

    this._minMagnitude = Number.MAX_VALUE;
    this._maxMagnitude = Number.MIN_VALUE;

    for (var i = 0, len = data.length; i < len; i++) {
        var starInfo = data[i];
        var declination = starInfo[indexes.decIndex]; //for latitude
        var rightAscension = starInfo[indexes.raIndex]; //for longitude
        var magnitude = starInfo[indexes.magIndex];
        var pointSize = magnitude < 2 ? 2 : 1;

        positions.push(declination, rightAscension, pointSize, magnitude);

        this._minMagnitude = Math.min(this._minMagnitude, magnitude);
        this._maxMagnitude = Math.max(this._maxMagnitude, magnitude);
    }
    this._numStars = Math.floor(positions.length / 4);

    return positions;
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.parseStarsMetadata = function (metadata) {
    var raIndex = -1,
        decIndex = -1,
        magIndex = -1;
    for (var i = 0, len = metadata.length; i < len; i++) {
        var starMetaInfo = metadata[i];
        if (starMetaInfo.name === 'ra') {
            raIndex = i;
        }
        if (starMetaInfo.name === 'dec') {
            decIndex = i;
        }
        if (starMetaInfo.name === 'vmag') {
            magIndex = i;
        }
    }
    return {
        raIndex: raIndex,
        decIndex: decIndex,
        magIndex: magIndex
    };
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.invalidateStarData = function () {
    this._starData = null;
    this._starsPositionsVboCacheKey = null;
};

// Internal. Intentionally not documented.
StarFieldLayer.prototype.sendRedrawRequest = function () {
    var e = document.createEvent('Event');
    e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
    window.dispatchEvent(e);
};

export default StarFieldLayer;

