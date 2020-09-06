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
import AtmosphereLayer from './layer/AtmosphereLayer';
import Offset from './util/Offset';
import StarFieldLayer from './layer/StarFieldLayer';
import WorldWindow from './WorldWindow';
import WWUtil from './util/WWUtil';
import XYZLayer from './layer/XYZLayer';

/**
 * This is the top-level WorldWind module. It is global.
 * @exports WorldWind
 * @global
 */
var WorldWind = {
    /**
     * The WorldWind version number.
     * @default "0.9.0"
     * @constant
     */
    VERSION: "0.9.0",

    // PLEASE KEEP THE ENTRIES BELOW IN ALPHABETICAL ORDER
    /**
     * Indicates an altitude mode relative to the globe's ellipsoid.
     * @constant
     */
    ABSOLUTE: "absolute",

    /**
     * Indicates that a redraw callback has been called immediately after a redraw.
     * @constant
     */
    AFTER_REDRAW: "afterRedraw",

    /**
     * Indicates that a redraw callback has been called immediately before a redraw.
     * @constant
     */
    BEFORE_REDRAW: "beforeRedraw",

    /**
     * The BEGAN gesture recognizer state. Continuous gesture recognizers transition to this state from the
     * POSSIBLE state when the gesture is first recognized.
     * @constant
     */
    BEGAN: "began",

    /**
     * The CANCELLED gesture recognizer state. Continuous gesture recognizers may transition to this state from
     * the BEGAN state or the CHANGED state when the touch events are cancelled.
     * @constant
     */
    CANCELLED: "cancelled",

    /**
     * The CHANGED gesture recognizer state. Continuous gesture recognizers transition to this state from the
     * BEGAN state or the CHANGED state, whenever an input event indicates a change in the gesture.
     * @constant
     */
    CHANGED: "changed",

    /**
     * Indicates an altitude mode always on the terrain.
     * @constant
     */
    CLAMP_TO_GROUND: "clampToGround",

    /**
     * The radius of Earth.
     * @constant
     * @deprecated Use WGS84_SEMI_MAJOR_AXIS instead.
     */
    EARTH_RADIUS: 6371e3,

    /**
     * Indicates the cardinal direction east.
     * @constant
     */
    EAST: "east",

    /**
     * The ENDED gesture recognizer state. Continuous gesture recognizers transition to this state from either
     * the BEGAN state or the CHANGED state when the current input no longer represents the gesture.
     * @constant
     */
    ENDED: "ended",

    /**
     * The FAILED gesture recognizer state. Gesture recognizers transition to this state from the POSSIBLE state
     * when the gesture cannot be recognized given the current input.
     * @constant
     */
    FAILED: "failed",

    /**
     * Indicates a linear filter.
     * @constant
     */
    FILTER_LINEAR: "filter_linear",

    /**
     * Indicates a nearest neighbor filter.
     * @constant
     */
    FILTER_NEAREST: "filter_nearest",

    /**
     * Indicates a great circle path.
     * @constant
     */
    GREAT_CIRCLE: "greatCircle",

    /**
     * Indicates a linear, straight line path.
     * @constant
     */
    LINEAR: "linear",

    /**
     * Indicates a multi-point shape, typically within a shapefile.
     */
    MULTI_POINT: "multiPoint",

    /**
     * Indicates the cardinal direction north.
     * @constant
     */
    NORTH: "north",

    /**
     * Indicates a null shape, typically within a shapefile.
     * @constant
     */
    NULL: "null",

    /**
     * Indicates that the associated parameters are fractional values of the virtual rectangle's width or
     * height in the range [0, 1], where 0 indicates the rectangle's origin and 1 indicates the corner
     * opposite its origin.
     * @constant
     */
    OFFSET_FRACTION: "fraction",

    /**
     * Indicates that the associated parameters are in units of pixels relative to the virtual rectangle's
     * corner opposite its origin corner.
     * @constant
     */
    OFFSET_INSET_PIXELS: "insetPixels",

    /**
     * Indicates that the associated parameters are in units of pixels relative to the virtual rectangle's
     * origin.
     * @constant
     */
    OFFSET_PIXELS: "pixels",

    /**
     * Indicates a point shape, typically within a shapefile.
     */
    POINT: "point",

    /**
     * Indicates a polyline shape, typically within a shapefile.
     */
    POLYLINE: "polyline",

    /**
     * Indicates a polygon shape, typically within a shapefile.
     */
    POLYGON: "polygon",

    /**
     * The POSSIBLE gesture recognizer state. Gesture recognizers in this state are idle when there is no input
     * event to evaluate, or are evaluating input events to determine whether or not to transition into another
     * state.
     * @constant
     */
    POSSIBLE: "possible",

    /**
     * The RECOGNIZED gesture recognizer state. Discrete gesture recognizers transition to this state from the
     * POSSIBLE state when the gesture is recognized.
     * @constant
     */
    RECOGNIZED: "recognized",

    /**
     * Indicates that the related value is specified relative to the globe.
     * @constant
     */
    RELATIVE_TO_GLOBE: "relativeToGlobe",

    /**
     * Indicates an altitude mode relative to the terrain.
     * @constant
     */
    RELATIVE_TO_GROUND: "relativeToGround",

    /**
     * Indicates that the related value is specified relative to the plane of the screen.
     * @constant
     */
    RELATIVE_TO_SCREEN: "relativeToScreen",

    /**
     * Indicates a rhumb path -- a path of constant bearing.
     * @constant
     */
    RHUMB_LINE: "rhumbLine",

    /**
     * Indicates the cardinal direction south.
     * @constant
     */
    SOUTH: "south",

    /**
     * Indicates the cardinal direction west.
     * @constant
     */
    WEST: "west",

    /**
     * WGS 84 reference value for Earth's semi-major axis: 6378137.0. Taken from NGA.STND.0036_1.0.0_WGS84,
     * section 3.4.1.
     * @constant
     */
    WGS84_SEMI_MAJOR_AXIS: 6378137.0,

    /**
     * WGS 84 reference value for Earth's inverse flattening: 298.257223563. Taken from
     * NGA.STND.0036_1.0.0_WGS84, section 3.4.2.
     * @constant
     */
    WGS84_INVERSE_FLATTENING: 298.257223563
};

WorldWind['AtmosphereLayer'] = AtmosphereLayer;
WorldWind['StarFieldLayer'] = StarFieldLayer;
WorldWind['WorldWindow'] = WorldWindow;
WorldWind['XYZLayer'] = XYZLayer;

/**
 * Holds configuration parameters for WorldWind. Applications may modify these parameters prior to creating
 * their first WorldWind objects. Configuration properties are:
 * <ul>
 *     <li><code>gpuCacheSize</code>: A Number indicating the size in bytes to allocate from GPU memory for
 *     resources such as textures, GLSL programs and buffer objects. Default is 250e6 (250 MB).</li>
 *     <li><code>baseUrl</code>: The URL of the directory containing the WorldWind Library and its resources.</li>
 *     <li><code>layerRetrievalQueueSize</code>: The number of concurrent tile requests allowed per layer. The default is 16.</li>
 *     <li><code>coverageRetrievalQueueSize</code>: The number of concurrent tile requests allowed per elevation coverage. The default is 16.</li>
 *     <li><code>bingLogoPlacement</code>: An {@link Offset} to place a Bing logo attribution. The default is a 7px margin inset from the lower right corner of the screen.</li>
 *     <li><code>bingLogoAlignment</code>: An {@link Offset} to align the Bing logo relative to its placement position. The default is the lower right corner of the logo.</li>
 * </ul>
 * @type {{gpuCacheSize: number}}
 */
WorldWind.configuration = {
    gpuCacheSize: 250e6,
    baseUrl: WWUtil.worldwindlibLocation() || WWUtil.currentUrlSansFilePart() + '/',
    layerRetrievalQueueSize: 16,
    coverageRetrievalQueueSize: 16,
    bingLogoPlacement: new Offset(WorldWind.OFFSET_INSET_PIXELS, 7, WorldWind.OFFSET_PIXELS, 7),
    bingLogoAlignment: new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0)
};

export default WorldWind;
