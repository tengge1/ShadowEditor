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
import AbstractError from './error/AbstractError';
import Annotation from './shapes/Annotation';
import AnnotationAttributes from './shapes/AnnotationAttributes';
import AreaMeasurer from './util/measure/AreaMeasurer';
import ArgumentError from './error/ArgumentError';
import AsterV2ElevationCoverage from './globe/AsterV2ElevationCoverage';
import AtmosphereLayer from './layer/AtmosphereLayer';
import AtmosphereProgram from './shaders/AtmosphereProgram';
import BasicProgram from './shaders/BasicProgram';
import BasicTextureProgram from './shaders/BasicTextureProgram';
import BasicTimeSequence from './util/BasicTimeSequence';
import BasicWorldWindowController from './BasicWorldWindowController';
import BoundingBox from './geom/BoundingBox';
import ClickRecognizer from './gesture/ClickRecognizer';
import Color from './util/Color';
import Compass from './shapes/Compass';
import DateWW from './util/Date';
import DragRecognizer from './gesture/DragRecognizer';
import DrawContext from './render/DrawContext';
import EarthElevationModel from './globe/EarthElevationModel';
import EarthRestElevationCoverage from './globe/EarthRestElevationCoverage';
import ElevationCoverage from './globe/ElevationCoverage';
import ElevationModel from './globe/ElevationModel';
import Font from './util/Font';
import FrameStatistics from './util/FrameStatistics';
import FramebufferTexture from './render/FramebufferTexture';
import FramebufferTile from './render/FramebufferTile';
import FramebufferTileController from './render/FramebufferTileController';
import Frustum from './geom/Frustum';
import GebcoElevationCoverage from './globe/GebcoElevationCoverage';
import GeographicMesh from './shapes/GeographicMesh';
import GeographicProjection from './projections/GeographicProjection';
import GeographicText from './shapes/GeographicText';
import GestureRecognizer from './gesture/GestureRecognizer';
import Globe from './globe/Globe';
import Globe2D from './globe/Globe2D';
import GoToAnimator from './util/GoToAnimator';
import GpuProgram from './shaders/GpuProgram';
import GpuResourceCache from './cache/GpuResourceCache';
import GpuShader from './shaders/GpuShader';
import GroundProgram from './shaders/GroundProgram';
import HashMap from './util/HashMap';
import HighlightController from './util/HighlightController';
import ImageSource from './util/ImageSource';
import ImageTile from './render/ImageTile';
import Insets from './util/Insets';
import Layer from './layer/Layer';
import LengthMeasurer from './util/measure/LengthMeasurer';
import Level from './util/Level';
import LevelRowColumnUrlBuilder from './util/LevelRowColumnUrlBuilder';
import LevelSet from './util/LevelSet';
import Line from './geom/Line';
import Location from './geom/Location';
import LookAtNavigator from './navigate/LookAtNavigator';
import Matrix from './geom/Matrix';
import MeasuredLocation from './geom/MeasuredLocation';
import MemoryCache from './cache/MemoryCache';
import MemoryCacheListener from './cache/MemoryCacheListener';
import MercatorTiledImageLayer from './layer/MercatorTiledImageLayer';
import Navigator from './navigate/Navigator';
import NominatimGeocoder from './util/NominatimGeocoder';
import NotYetImplementedError from './error/NotYetImplementedError';
import Offset from './util/Offset';
import PanRecognizer from './gesture/PanRecognizer';
import Path from './shapes/Path';
import PeriodicTimeSequence from './util/PeriodicTimeSequence';
import PickedObject from './pick/PickedObject';
import PickedObjectList from './pick/PickedObjectList';
import PinchRecognizer from './gesture/PinchRecognizer';
import Placemark from './shapes/Placemark';
import PlacemarkAttributes from './shapes/PlacemarkAttributes';
import Plane from './geom/Plane';
import Polygon from './shapes/Polygon';
import Position from './geom/Position';
import ProjectionEquirectangular from './projections/ProjectionEquirectangular';
import ProjectionGnomonic from './projections/ProjectionGnomonic';
import ProjectionMercator from './projections/ProjectionMercator';
import ProjectionPolarEquidistant from './projections/ProjectionPolarEquidistant';
import ProjectionUPS from './projections/ProjectionUPS';
import ProjectionWgs84 from './projections/ProjectionWgs84';
import Rectangle from './geom/Rectangle';
import Renderable from './render/Renderable';
import RotationRecognizer from './gesture/RotationRecognizer';
import ScreenImage from './shapes/ScreenImage';
import ScreenText from './shapes/ScreenText';
import Sector from './geom/Sector';
import ShapeAttributes from './shapes/ShapeAttributes';
import SkyProgram from './shaders/SkyProgram';
import StarFieldLayer from './layer/StarFieldLayer';
import StarFieldProgram from './shaders/StarFieldProgram';
import SurfaceImage from './shapes/SurfaceImage';
import SurfaceCircle from './shapes/SurfaceCircle';
import SurfaceEllipse from './shapes/SurfaceEllipse';
import SurfacePolygon from './shapes/SurfacePolygon';
import SurfacePolyline from './shapes/SurfacePolyline';
import SurfaceRectangle from './shapes/SurfaceRectangle';
import SurfaceRenderable from './render/SurfaceRenderable';
import SurfaceSector from './shapes/SurfaceSector';
import SurfaceShape from './shapes/SurfaceShape';
import SurfaceShapeTile from './shapes/SurfaceShapeTile';
import SurfaceShapeTileBuilder from './shapes/SurfaceShapeTileBuilder';
import SurfaceTile from './render/SurfaceTile';
import SurfaceTileRenderer from './render/SurfaceTileRenderer';
import SurfaceTileRendererProgram from './shaders/SurfaceTileRendererProgram';
import TapRecognizer from './gesture/TapRecognizer';
import Terrain from './globe/Terrain';
import TerrainTile from './globe/TerrainTile';
import TerrainTileList from './globe/TerrainTileList';
import Tessellator from './globe/Tessellator';
import Text from './shapes/Text';
import TextAttributes from './shapes/TextAttributes';
import TextRenderer from './render/TextRenderer';
import Texture from './render/Texture';
import TextureTile from './render/TextureTile';
import Tile from './util/Tile';
import TiledElevationCoverage from './globe/TiledElevationCoverage';
import TiledImageLayer from './layer/TiledImageLayer';
import TileFactory from './util/TileFactory';
import TiltRecognizer from './gesture/TiltRecognizer';
import Touch from './gesture/Touch';
import TriangleMesh from './shapes/TriangleMesh';
import UsgsNedElevationCoverage from './error/UnsupportedOperationError';
import UsgsNedHiElevationCoverage from './globe/UsgsNedElevationCoverage';
import UnsupportedOperationError from './globe/UsgsNedHiElevationCoverage';
import UrlBuilder from './util/UrlBuilder';
import Vec2 from './geom/Vec2';
import Vec3 from './geom/Vec3';
import WcsEarthElevationCoverage from './globe/WcsEarthElevationCoverage';
import WcsTileUrlBuilder from './util/WcsTileUrlBuilder';
import WmsUrlBuilder from './util/WmsUrlBuilder';
import WorldWindow from './WorldWindow';
import WorldWindowController from './WorldWindowController';
import WWMessage from './util/WWMessage';
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
     * The event name of WorldWind redraw events.
     */
    REDRAW_EVENT_TYPE: "WorldWindRedraw",

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

WorldWind['AbstractError'] = AbstractError;
WorldWind['Annotation'] = Annotation;
WorldWind['AnnotationAttributes'] = AnnotationAttributes;
WorldWind['AreaMeasurer'] = AreaMeasurer;
WorldWind['ArgumentError'] = ArgumentError;
WorldWind['AsterV2ElevationCoverage'] = AsterV2ElevationCoverage;
WorldWind['AtmosphereLayer'] = AtmosphereLayer;
WorldWind['AtmosphereProgram'] = AtmosphereProgram;
WorldWind['BasicProgram'] = BasicProgram;
WorldWind['BasicTextureProgram'] = BasicTextureProgram;
WorldWind['BasicTimeSequence'] = BasicTimeSequence;
WorldWind['BasicWorldWindowController'] = BasicWorldWindowController;
WorldWind['BoundingBox'] = BoundingBox;
WorldWind['ClickRecognizer'] = ClickRecognizer;
WorldWind['Color'] = Color;
WorldWind['Compass'] = Compass;
WorldWind['DateWW'] = DateWW;
WorldWind['DragRecognizer'] = DragRecognizer;
WorldWind['DrawContext'] = DrawContext;
WorldWind['EarthElevationModel'] = EarthElevationModel;
WorldWind['EarthRestElevationCoverage'] = EarthRestElevationCoverage;
WorldWind['ElevationCoverage'] = ElevationCoverage;
WorldWind['ElevationModel'] = ElevationModel;
WorldWind['Font'] = Font;
WorldWind['FrameStatistics'] = FrameStatistics;
WorldWind['FramebufferTexture'] = FramebufferTexture;
WorldWind['FramebufferTile'] = FramebufferTile;
WorldWind['FramebufferTileController'] = FramebufferTileController;
WorldWind['Frustum'] = Frustum;
WorldWind['GebcoElevationCoverage'] = GebcoElevationCoverage;
WorldWind['GeographicMesh'] = GeographicMesh;
WorldWind['GeographicProjection'] = GeographicProjection;
WorldWind['GeographicText'] = GeographicText;
WorldWind['GestureRecognizer'] = GestureRecognizer;
WorldWind['Globe'] = Globe;
WorldWind['Globe2D'] = Globe2D;
WorldWind['GoToAnimator'] = GoToAnimator;
WorldWind['GpuProgram'] = GpuProgram;
WorldWind['GpuResourceCache'] = GpuResourceCache;
WorldWind['GpuShader'] = GpuShader;
WorldWind['GroundProgram'] = GroundProgram;
WorldWind['HashMap'] = HashMap;
WorldWind['HighlightController'] = HighlightController;
WorldWind['ImageSource'] = ImageSource;
WorldWind['ImageTile'] = ImageTile;
WorldWind['Insets'] = Insets;
WorldWind['Layer'] = Layer;
WorldWind['LengthMeasurer'] = LengthMeasurer;
WorldWind['Level'] = Level;
WorldWind['LevelRowColumnUrlBuilder'] = LevelRowColumnUrlBuilder;
WorldWind['LevelSet'] = LevelSet;
WorldWind['Line'] = Line;
WorldWind['Location'] = Location;
WorldWind['LookAtNavigator'] = LookAtNavigator;
WorldWind['Matrix'] = Matrix;
WorldWind['MeasuredLocation'] = MeasuredLocation;
WorldWind['MemoryCache'] = MemoryCache;
WorldWind['MemoryCacheListener'] = MemoryCacheListener;
WorldWind['MercatorTiledImageLayer'] = MercatorTiledImageLayer;
WorldWind['Navigator'] = Navigator;
WorldWind['NominatimGeocoder'] = NominatimGeocoder;
WorldWind['NotYetImplementedError'] = NotYetImplementedError;
WorldWind['Offset'] = Offset;
WorldWind['PanRecognizer'] = PanRecognizer;
WorldWind['Path'] = Path;
WorldWind['PeriodicTimeSequence'] = PeriodicTimeSequence;
WorldWind['PickedObject'] = PickedObject;
WorldWind['PickedObjectList'] = PickedObjectList;
WorldWind['PinchRecognizer'] = PinchRecognizer;
WorldWind['Placemark'] = Placemark;
WorldWind['PlacemarkAttributes'] = PlacemarkAttributes;
WorldWind['Plane'] = Plane;
WorldWind['Polygon'] = Polygon;
WorldWind['Position'] = Position;
WorldWind['ProjectionEquirectangular'] = ProjectionEquirectangular;
WorldWind['ProjectionGnomonic'] = ProjectionGnomonic;
WorldWind['ProjectionMercator'] = ProjectionMercator;
WorldWind['ProjectionPolarEquidistant'] = ProjectionPolarEquidistant;
WorldWind['ProjectionUPS'] = ProjectionUPS;
WorldWind['ProjectionWgs84'] = ProjectionWgs84;
WorldWind['Rectangle'] = Rectangle;
WorldWind['Renderable'] = Renderable;
WorldWind['RotationRecognizer'] = RotationRecognizer;
WorldWind['ScreenText'] = ScreenText;
WorldWind['ScreenImage'] = ScreenImage;
WorldWind['Sector'] = Sector;
WorldWind['ShapeAttributes'] = ShapeAttributes;
WorldWind['SkyProgram'] = SkyProgram;
WorldWind['StarFieldLayer'] = StarFieldLayer;
WorldWind['StarFieldProgram'] = StarFieldProgram;
WorldWind['SurfaceImage'] = SurfaceImage;
WorldWind['SurfaceCircle'] = SurfaceCircle;
WorldWind['SurfaceEllipse'] = SurfaceEllipse;
WorldWind['SurfacePolygon'] = SurfacePolygon;
WorldWind['SurfacePolyline'] = SurfacePolyline;
WorldWind['SurfaceRectangle'] = SurfaceRectangle;
WorldWind['SurfaceRenderable'] = SurfaceRenderable;
WorldWind['SurfaceSector'] = SurfaceSector;
WorldWind['SurfaceShape'] = SurfaceShape;
WorldWind['SurfaceShapeTile'] = SurfaceShapeTile;
WorldWind['SurfaceShapeTileBuilder'] = SurfaceShapeTileBuilder;
WorldWind['SurfaceTile'] = SurfaceTile;
WorldWind['SurfaceTileRenderer'] = SurfaceTileRenderer;
WorldWind['SurfaceTileRendererProgram'] = SurfaceTileRendererProgram;
WorldWind['TapRecognizer'] = TapRecognizer;
WorldWind['Terrain'] = Terrain;
WorldWind['TerrainTile'] = TerrainTile;
WorldWind['TerrainTileList'] = TerrainTileList;
WorldWind['Tessellator'] = Tessellator;
WorldWind['Text'] = Text;
WorldWind['TextAttributes'] = TextAttributes;
WorldWind['TextRenderer'] = TextRenderer;
WorldWind['Texture'] = Texture;
WorldWind['TextureTile'] = TextureTile;
WorldWind['Tile'] = Tile;
WorldWind['TiledElevationCoverage'] = TiledElevationCoverage;
WorldWind['TiledImageLayer'] = TiledImageLayer;
WorldWind['TileFactory'] = TileFactory;
WorldWind['TiltRecognizer'] = TiltRecognizer;
WorldWind['Touch'] = Touch;
WorldWind['TriangleMesh'] = TriangleMesh;
WorldWind['UsgsNedElevationCoverage'] = UsgsNedElevationCoverage;
WorldWind['UsgsNedHiElevationCoverage'] = UsgsNedHiElevationCoverage;
WorldWind['UnsupportedOperationError'] = UnsupportedOperationError;
WorldWind['UrlBuilder'] = UrlBuilder;
WorldWind['Vec2'] = Vec2;
WorldWind['Vec3'] = Vec3;
WorldWind['WcsEarthElevationCoverage'] = WcsEarthElevationCoverage;
WorldWind['WcsTileUrlBuilder'] = WcsTileUrlBuilder;
WorldWind['WmsUrlBuilder'] = WmsUrlBuilder;
WorldWind['WWMessage'] = WWMessage;
WorldWind['WorldWindow'] = WorldWindow;
WorldWind['WorldWindowController'] = WorldWindowController;
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
    baseUrl: (WWUtil.worldwindlibLocation()) || (WWUtil.currentUrlSansFilePart() + '/'),
    layerRetrievalQueueSize: 16,
    coverageRetrievalQueueSize: 16,
    bingLogoPlacement: new Offset(WorldWind.OFFSET_INSET_PIXELS, 7, WorldWind.OFFSET_PIXELS, 7),
    bingLogoAlignment: new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0)
};

/**
 * Indicates the Bing Maps key to use when requesting Bing Maps resources.
 * @type {String}
 * @default null
 */
WorldWind.BingMapsKey = null;

window.WorldWind = WorldWind;

export default WorldWind;
