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
import AAIGridConstants from './formats/aaigrid/AAIGridConstants';
import AAIGridMetadata from './formats/aaigrid/AAIGridMetadata';
import AAIGridReader from './formats/aaigrid/AAIGridReader';
import AbstractError from './error/AbstractError';
import Angle from './geom/Angle';
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
import BingAerialLayer from './layer/BingAerialLayer';
import BingAerialWithLabelsLayer from './layer/BingAerialWithLabelsLayer';
import BingRoadsLayer from './layer/BingRoadsLayer';
import BingWMSLayer from './layer/BingWMSLayer';
import BMNGLandsatLayer from './layer/BMNGLandsatLayer';
import BMNGLayer from './layer/BMNGLayer';
import BMNGOneImageLayer from './layer/BMNGOneImageLayer';
import BMNGRestLayer from './layer/BMNGRestLayer';
import BoundingBox from './geom/BoundingBox';
import ClickRecognizer from './gesture/ClickRecognizer';
import ColladaLoader from './formats/collada/ColladaLoader';
import Color from './util/Color';
import Compass from './shapes/Compass';
import CompassLayer from './layer/CompassLayer';
import CoordinatesDisplayLayer from './layer/CoordinatesDisplayLayer';
import DateWW from './util/Date';
import DigitalGlobeTiledImageLayer from './layer/DigitalGlobeTiledImageLayer';
import DragRecognizer from './gesture/DragRecognizer';
import DrawContext from './render/DrawContext';
import EarthElevationModel from './globe/EarthElevationModel';
import EarthRestElevationCoverage from './globe/EarthRestElevationCoverage';
import ElevationCoverage from './globe/ElevationCoverage';
import ElevationModel from './globe/ElevationModel';
import Font from './util/Font';
import FrameStatistics from './util/FrameStatistics';
import FrameStatisticsLayer from './layer/FrameStatisticsLayer';
import FramebufferTexture from './render/FramebufferTexture';
import FramebufferTile from './render/FramebufferTile';
import FramebufferTileController from './render/FramebufferTileController';
import Frustum from './geom/Frustum';
import GebcoElevationCoverage from './globe/GebcoElevationCoverage';
import GeographicMesh from './shapes/GeographicMesh';
import GeographicProjection from './projections/GeographicProjection';
import GeographicText from './shapes/GeographicText';
import GeoJSONExporter from './formats/geojson/GeoJSONExporter';
import GeoJSONGeometry from './formats/geojson/GeoJSONGeometry';
import GeoJSONGeometryCollection from './formats/geojson/GeoJSONGeometryCollection';
import GeoJSONGeometryLineString from './formats/geojson/GeoJSONGeometryLineString';
import GeoJSONGeometryMultiLineString from './formats/geojson/GeoJSONGeometryMultiLineString';
import GeoJSONGeometryMultiPoint from './formats/geojson/GeoJSONGeometryMultiPoint';
import GeoJSONGeometryMultiPolygon from './formats/geojson/GeoJSONGeometryMultiPolygon';
import GeoJSONGeometryPoint from './formats/geojson/GeoJSONGeometryPoint';
import GeoJSONGeometryPolygon from './formats/geojson/GeoJSONGeometryPolygon';
import GeoJSONParser from './formats/geojson/GeoJSONParser';
import GeoTiffReader from './formats/geotiff/GeoTiffReader';
import GestureRecognizer from './gesture/GestureRecognizer';
import Globe from './globe/Globe';
import Globe2D from './globe/Globe2D';
import GoToAnimator from './util/GoToAnimator';
import GpuProgram from './shaders/GpuProgram';
import GpuResourceCache from './cache/GpuResourceCache';
import GpuShader from './shaders/GpuShader';
import GroundProgram from './shaders/GroundProgram';
import HashMap from './util/HashMap';
import HeatMapColoredTile from './layer/heatmap/HeatMapColoredTile';
import HeatMapIntervalType from './layer/heatmap/HeatMapIntervalType';
import HeatMapLayer from './layer/heatmap/HeatMapLayer';
import HeatMapTile from './layer/heatmap/HeatMapTile';
import HighlightController from './util/HighlightController';
import ImageSource from './util/ImageSource';
import ImageTile from './render/ImageTile';
import Insets from './util/Insets';
import KmlAbstractView from './formats/kml/KmlAbstractView';
import KmlAttribute from './formats/kml/util/KmlAttribute';
import KmlBalloonStyle from './formats/kml/styles/KmlBalloonStyle';
import KmlCamera from './formats/kml/KmlCamera';
import KmlChange from './formats/kml/util/KmlChange';
import KmlColorStyle from './formats/kml/styles/KmlColorStyle';
import KmlContainer from './formats/kml/features/KmlContainer';
import KmlControls from './formats/kml/controls/KmlControls';
import KmlCreate from './formats/kml/util/KmlCreate';
import KmlDelete from './formats/kml/util/KmlDelete';
import KmlDocument from './formats/kml/features/KmlDocument';
import KmlElements from './formats/kml/KmlElements';
import KmlElementsFactory from './formats/kml/util/KmlElementsFactory';
import KmlElementsFactoryCached from './formats/kml/util/KmlElementsFactoryCached';
import KmlFeature from './formats/kml/features/KmlFeature';
import KmlFile from './formats/kml/KmlFile';
import KmlFileCache from './formats/kml/KmlFileCache';
import KmlFolder from './formats/kml/features/KmlFolder';
import KmlGeometry from './formats/kml/geom/KmlGeometry';
import KmlGroundOverlay from './formats/kml/features/KmlGroundOverlay';
import KmlHrefResolver from './formats/kml/util/KmlHrefResolver';
import KmlIcon from './formats/kml/KmlIcon';
import KmlIconStyle from './formats/kml/styles/KmlIconStyle';
import KmlImagePyramid from './formats/kml/util/KmlImagePyramid';
import KmlItemIcon from './formats/kml/util/KmlItemIcon';
import KmlLabelStyle from './formats/kml/styles/KmlLabelStyle';
import KmlLatLonAltBox from './formats/kml/KmlLatLonAltBox';
import KmlLatLonBox from './formats/kml/KmlLatLonBox';
import KmlLatLonQuad from './formats/kml/KmlLatLonQuad';
import KmlLinearRing from './formats/kml/geom/KmlLinearRing';
import KmlLineString from './formats/kml/geom/KmlLineString';
import KmlLineStyle from './formats/kml/styles/KmlLineStyle';
import KmlLink from './formats/kml/KmlLink';
import KmlListStyle from './formats/kml/styles/KmlListStyle';
import KmlLocation from './formats/kml/KmlLocation';
import KmlLod from './formats/kml/KmlLod';
import KmlLookAt from './formats/kml/KmlLookAt';
import KmlMultiGeometry from './formats/kml/geom/KmlMultiGeometry';
import KmlMultiTrack from './formats/kml/geom/KmlMultiTrack';
import KmlNetworkLink from './formats/kml/features/KmlNetworkLink';
import KmlNetworkLinkControl from './formats/kml/util/KmlNetworkLinkControl';
import KmlNodeTransformers from './formats/kml/util/KmlNodeTransformers';
import KmlObject from './formats/kml/KmlObject';
import KmlOrientation from './formats/kml/KmlOrientation';
import KmlOverlay from './formats/kml/features/KmlOverlay';
import KmlPair from './formats/kml/util/KmlPair';
import KmlPhotoOverlay from './formats/kml/features/KmlPhotoOverlay';
import KmlPlacemark from './formats/kml/features/KmlPlacemark';
import KmlPoint from './formats/kml/geom/KmlPoint';
import KmlPolygon from './formats/kml/geom/KmlPolygon';
import KmlPolyStyle from './formats/kml/styles/KmlPolyStyle';
import KmlRefreshListener from './formats/kml/util/KmlRefreshListener';
import KmlRegion from './formats/kml/KmlRegion';
import KmlRemoteFile from './formats/kml/util/KmlRemoteFile';
import KmlScale from './formats/kml/util/KmlScale';
import KmlSchema from './formats/kml/util/KmlSchema';
import KmlScreenOverlay from './formats/kml/features/KmlScreenOverlay';
import KmlStyle from './formats/kml/styles/KmlStyle';
import KmlStyleMap from './formats/kml/styles/KmlStyleMap';
import KmlStyleResolver from './formats/kml/util/KmlStyleResolver';
import KmlStyleSelector from './formats/kml/styles/KmlStyleSelector';
import KmlSubStyle from './formats/kml/styles/KmlSubStyle';
import KmlTimePrimitive from './formats/kml/KmlTimePrimitive';
import KmlTimeSpan from './formats/kml/KmlTimeSpan';
import KmlTimeStamp from './formats/kml/KmlTimeStamp';
import KmlTour from './formats/kml/features/KmlTour';
import KmlTrack from './formats/kml/geom/KmlTrack';
import KmlTreeKeyValueCache from './formats/kml/util/KmlTreeKeyValueCache';
import KmlTreeVisibility from './formats/kml/controls/KmlTreeVisibility';
import KmlUpdate from './formats/kml/util/KmlUpdate';
import KmlViewVolume from './formats/kml/util/KmlViewVolume';
import KmzFile from './formats/kml/KmzFile';
import LandsatRestLayer from './layer/LandsatRestLayer';
import Layer from './layer/Layer';
import LengthMeasurer from './util/measure/LengthMeasurer';
import Level from './util/Level';
import LevelRowColumnUrlBuilder from './util/LevelRowColumnUrlBuilder';
import LevelSet from './util/LevelSet';
import Line from './geom/Line';
import Location from './geom/Location';
import Logger from './util/Logger';
import LookAtNavigator from './navigate/LookAtNavigator';
import Matrix from './geom/Matrix';
import MeasuredLocation from './geom/MeasuredLocation';
import MeasurerUtils from './util/measure/MeasurerUtils';
import MemoryCache from './cache/MemoryCache';
import MemoryCacheListener from './cache/MemoryCacheListener';
import MercatorTiledImageLayer from './layer/MercatorTiledImageLayer';
import Navigator from './navigate/Navigator';
import NominatimGeocoder from './util/NominatimGeocoder';
import NotYetImplementedError from './error/NotYetImplementedError';
import Offset from './util/Offset';
import OpenStreetMapImageLayer from './layer/OpenStreetMapImageLayer';
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
import PolygonSplitter from './util/PolygonSplitter';
import Position from './geom/Position';
import ProjectionEquirectangular from './projections/ProjectionEquirectangular';
import ProjectionGnomonic from './projections/ProjectionGnomonic';
import ProjectionMercator from './projections/ProjectionMercator';
import ProjectionPolarEquidistant from './projections/ProjectionPolarEquidistant';
import ProjectionUPS from './projections/ProjectionUPS';
import ProjectionWgs84 from './projections/ProjectionWgs84';
import Rectangle from './geom/Rectangle';
import Renderable from './render/Renderable';
import RenderableLayer from './layer/RenderableLayer';
import RestTiledImageLayer from './layer/RestTiledImageLayer';
import RotationRecognizer from './gesture/RotationRecognizer';
import ScreenImage from './shapes/ScreenImage';
import ScreenText from './shapes/ScreenText';
import Sector from './geom/Sector';
import ShapeAttributes from './shapes/ShapeAttributes';
import Shapefile from './formats/shapefile/Shapefile';
import ShowTessellationLayer from './layer/ShowTessellationLayer';
import SkyProgram from './shaders/SkyProgram';
import StarFieldLayer from './layer/StarFieldLayer';
import StarFieldProgram from './shaders/StarFieldProgram';
import SunPosition from './util/SunPosition';
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
import TectonicPlatesLayer from './layer/TectonicPlatesLayer';
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
import ViewControlsLayer from './layer/ViewControlsLayer';
import WcsCapabilities from './ogc/wcs/WcsCapabilities';
import WcsCoverage from './ogc/wcs/WcsCoverage';
import WcsCoverageDescriptions from './ogc/wcs/WcsCoverageDescriptions';
import WcsEarthElevationCoverage from './globe/WcsEarthElevationCoverage';
import WcsTileUrlBuilder from './util/WcsTileUrlBuilder';
import WebCoverageService from './ogc/wcs/WebCoverageService';
import WfsCapabilities from './ogc/WfsCapabilities';
import Wkt from './formats/wkt/Wkt';
import WktElements from './formats/wkt/WktElements';
import WktExporter from './formats/wkt/WktExporter';
import WktGeometryCollection from './formats/wkt/geom/WktGeometryCollection';
import WktLineString from './formats/wkt/geom/WktLineString';
import WktMultiLineString from './formats/wkt/geom/WktMultiLineString';
import WktMultiPoint from './formats/wkt/geom/WktMultiPoint';
import WktMultiPolygon from './formats/wkt/geom/WktMultiPolygon';
import WktObject from './formats/wkt/geom/WktObject';
import WktPoint from './formats/wkt/geom/WktPoint';
import WktPolygon from './formats/wkt/geom/WktPolygon';
import WktTokens from './formats/wkt/WktTokens';
import WktTriangle from './formats/wkt/geom/WktTriangle';
import WktType from './formats/wkt/WktType';
import WmsCapabilities from './ogc/wms/WmsCapabilities';
import WmsLayer from './layer/WmsLayer';
import WmsLayerCapabilities from './ogc/wms/WmsLayerCapabilities';
import WmsTimeDimensionedLayer from './layer/WmsTimeDimensionedLayer';
import WmsUrlBuilder from './util/WmsUrlBuilder';
import WmtsCapabilities from './ogc/wmts/WmtsCapabilities';
import WmtsLayer from './layer/WmtsLayer';
import WmtsLayerCapabilities from './ogc/wmts/WmtsLayerCapabilities';
import WorldWindow from './WorldWindow';
import WorldWindowController from './WorldWindowController';
import WWMath from './util/WWMath';
import WWMessage from './util/WWMessage';
import WWUtil from './util/WWUtil';
import XmlDocument from './util/XmlDocument';
        
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

        WorldWind['AAIGridConstants'] = AAIGridConstants;
        WorldWind['AAIGridMetadata'] = AAIGridMetadata;
        WorldWind['AAIGridReader'] = AAIGridReader;
        WorldWind['AbstractError'] = AbstractError;
        WorldWind['Angle'] = Angle;
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
        WorldWind['BingAerialLayer'] = BingAerialLayer;
        WorldWind['BingAerialWithLabelsLayer'] = BingAerialWithLabelsLayer;
        WorldWind['BingRoadsLayer'] = BingRoadsLayer;
        WorldWind['BingWMSLayer'] = BingWMSLayer;
        WorldWind['BMNGLandsatLayer'] = BMNGLandsatLayer;
        WorldWind['BMNGLayer'] = BMNGLayer;
        WorldWind['BMNGOneImageLayer'] = BMNGOneImageLayer;
        WorldWind['BMNGRestLayer'] = BMNGRestLayer;
        WorldWind['BoundingBox'] = BoundingBox;
        WorldWind['ClickRecognizer'] = ClickRecognizer;
        WorldWind['ColladaLoader'] = ColladaLoader;
        WorldWind['Color'] = Color;
        WorldWind['Compass'] = Compass;
        WorldWind['CompassLayer'] = CompassLayer;
        WorldWind['CoordinatesDisplayLayer'] = CoordinatesDisplayLayer;
        WorldWind['DateWW'] = DateWW;
        WorldWind['DigitalGlobeTiledImageLayer'] = DigitalGlobeTiledImageLayer;
        WorldWind['DragRecognizer'] = DragRecognizer;
        WorldWind['DrawContext'] = DrawContext;
        WorldWind['EarthElevationModel'] = EarthElevationModel;
        WorldWind['EarthRestElevationCoverage'] = EarthRestElevationCoverage;
        WorldWind['ElevationCoverage'] = ElevationCoverage;
        WorldWind['ElevationModel'] = ElevationModel;
        WorldWind['Font'] = Font;
        WorldWind['FrameStatistics'] = FrameStatistics;
        WorldWind['FrameStatisticsLayer'] = FrameStatisticsLayer;
        WorldWind['FramebufferTexture'] = FramebufferTexture;
        WorldWind['FramebufferTile'] = FramebufferTile;
        WorldWind['FramebufferTileController'] = FramebufferTileController;
        WorldWind['Frustum'] = Frustum;
        WorldWind['GebcoElevationCoverage'] = GebcoElevationCoverage;
        WorldWind['GeographicMesh'] = GeographicMesh;
        WorldWind['GeographicProjection'] = GeographicProjection;
        WorldWind['GeographicText'] = GeographicText;
        WorldWind['GeoJSONExporter'] = GeoJSONExporter;
        WorldWind['GeoJSONGeometry'] = GeoJSONGeometry;
        WorldWind['GeoJSONGeometryCollection'] = GeoJSONGeometryCollection;
        WorldWind['GeoJSONGeometryLineString'] = GeoJSONGeometryLineString;
        WorldWind['GeoJSONGeometryMultiLineString'] = GeoJSONGeometryMultiLineString;
        WorldWind['GeoJSONGeometryMultiPoint'] = GeoJSONGeometryMultiPoint;
        WorldWind['GeoJSONGeometryMultiPolygon'] = GeoJSONGeometryMultiPolygon;
        WorldWind['GeoJSONGeometryPoint'] = GeoJSONGeometryPoint;
        WorldWind['GeoJSONGeometryPolygon'] = GeoJSONGeometryPolygon;
        WorldWind['GeoJSONParser'] = GeoJSONParser;
        WorldWind['GeoTiffReader'] = GeoTiffReader;
        WorldWind['GestureRecognizer'] = GestureRecognizer;
        WorldWind['Globe'] = Globe;
        WorldWind['Globe2D'] = Globe2D;
        WorldWind['GoToAnimator'] = GoToAnimator;
        WorldWind['GpuProgram'] = GpuProgram;
        WorldWind['GpuResourceCache'] = GpuResourceCache;
        WorldWind['GpuShader'] = GpuShader;
        WorldWind['GroundProgram'] = GroundProgram;
        WorldWind['HashMap'] = HashMap;
        WorldWind['HeatMapColoredTile'] = HeatMapColoredTile;
        WorldWind['HeatMapIntervalType'] = HeatMapIntervalType;
        WorldWind['HeatMapLayer'] = HeatMapLayer;
        WorldWind['HeatMapTile'] = HeatMapTile;
        WorldWind['HighlightController'] = HighlightController;
        WorldWind['ImageSource'] = ImageSource;
        WorldWind['ImageTile'] = ImageTile;
        WorldWind['Insets'] = Insets;
        WorldWind['KmlAbstractView'] = KmlAbstractView;
        WorldWind['KmlAttribute'] = KmlAttribute;
        WorldWind['KmlBalloonStyle'] = KmlBalloonStyle;
        WorldWind['KmlCamera'] = KmlCamera;
        WorldWind['KmlChange'] = KmlChange;
        WorldWind['KmlColorStyle'] = KmlColorStyle;
        WorldWind['KmlContainer'] = KmlContainer;
        WorldWind['KmlControls'] = KmlControls;
        WorldWind['KmlCreate'] = KmlCreate;
        WorldWind['KmlDelete'] = KmlDelete;
        WorldWind['KmlDocument'] = KmlDocument;
        WorldWind['KmlElements'] = KmlElements;
        WorldWind['KmlElementsFactory'] = KmlElementsFactory;
        WorldWind['KmlElementsFactoryCached'] = KmlElementsFactoryCached;
        WorldWind['KmlFeature'] = KmlFeature;
        WorldWind['KmlFile'] = KmlFile;
        WorldWind['KmlFileCache'] = KmlFileCache;
        WorldWind['KmlFolder'] = KmlFolder;
        WorldWind['KmlGeometry'] = KmlGeometry;
        WorldWind['KmlGroundOverlay'] = KmlGroundOverlay;
        WorldWind['KmlHrefResolver'] = KmlHrefResolver;
        WorldWind['KmlIcon'] = KmlIcon;
        WorldWind['KmlIconStyle'] = KmlIconStyle;
        WorldWind['KmlImagePyramid'] = KmlImagePyramid;
        WorldWind['KmlItemIcon'] = KmlItemIcon;
        WorldWind['KmlLabelStyle'] = KmlLabelStyle;
        WorldWind['KmlLatLonAltBox'] = KmlLatLonAltBox;
        WorldWind['KmlLatLonBox'] = KmlLatLonBox;
        WorldWind['KmlLatLonQuad'] = KmlLatLonQuad;
        WorldWind['KmlLinearRing'] = KmlLinearRing;
        WorldWind['KmlLineString'] = KmlLineString;
        WorldWind['KmlLineStyle'] = KmlLineStyle;
        WorldWind['KmlListStyle'] = KmlListStyle;
        WorldWind['KmlLink'] = KmlLink;
        WorldWind['KmlLocation'] = KmlLocation;
        WorldWind['KmlLod'] = KmlLod;
        WorldWind['KmlLookAt'] = KmlLookAt;
        WorldWind['KmlMultiGeometry'] = KmlMultiGeometry;
        WorldWind['KmlMultiTrack'] = KmlMultiTrack;
        WorldWind['KmlNetworkLink'] = KmlNetworkLink;
        WorldWind['KmlNetworkLinkControl'] = KmlNetworkLinkControl;
        WorldWind['KmlNodeTransformers'] = KmlNodeTransformers;
        WorldWind['KmlObject'] = KmlObject;
        WorldWind['KmlOrientation'] = KmlOrientation;
        WorldWind['KmlOverlay'] = KmlOverlay;
        WorldWind['KmlPair'] = KmlPair;
        WorldWind['KmlPhotoOverlay'] = KmlPhotoOverlay;
        WorldWind['KmlPlacemark'] = KmlPlacemark;
        WorldWind['KmlPoint'] = KmlPoint;
        WorldWind['KmlPolygon'] = KmlPolygon;
        WorldWind['KmlPolyStyle'] = KmlPolyStyle;
        WorldWind['KmlRefreshListener'] = KmlRefreshListener;
        WorldWind['KmlRegion'] = KmlRegion;
        WorldWind['KmlRemoteFile'] = KmlRemoteFile;
        WorldWind['KmlScale'] = KmlScale;
        WorldWind['KmlSchema'] = KmlSchema;
        WorldWind['KmlScreenOverlay'] = KmlScreenOverlay;
        WorldWind['KmlStyle'] = KmlStyle;
        WorldWind['KmlStyleMap'] = KmlStyleMap;
        WorldWind['KmlStyleResolver'] = KmlStyleResolver;
        WorldWind['KmlStyleSelector'] = KmlStyleSelector;
        WorldWind['KmlSubStyle'] = KmlSubStyle;
        WorldWind['KmlTimePrimitive'] = KmlTimePrimitive;
        WorldWind['KmlTimeSpan'] = KmlTimeSpan;
        WorldWind['KmlTimeStamp'] = KmlTimeStamp;
        WorldWind['KmlTour'] = KmlTour;
        WorldWind['KmlTrack'] = KmlTrack;
        WorldWind['KmlTreeKeyValueCache'] = KmlTreeKeyValueCache;
        WorldWind['KmlTreeVisibility'] = KmlTreeVisibility;
        WorldWind['KmlUpdate'] = KmlUpdate;
        WorldWind['KmlViewVolume'] = KmlViewVolume;
        WorldWind['KmzFile'] = KmzFile;
        WorldWind['LandsatRestLayer'] = LandsatRestLayer;
        WorldWind['Layer'] = Layer;
        WorldWind['LengthMeasurer'] = LengthMeasurer;
        WorldWind['Level'] = Level;
        WorldWind['LevelRowColumnUrlBuilder'] = LevelRowColumnUrlBuilder;
        WorldWind['LevelSet'] = LevelSet;
        WorldWind['Line'] = Line;
        WorldWind['Location'] = Location;
        WorldWind['Logger'] = Logger;
        WorldWind['LookAtNavigator'] = LookAtNavigator;
        WorldWind['Matrix'] = Matrix;
        WorldWind['MeasuredLocation'] = MeasuredLocation;
        WorldWind['MeasurerUtils'] = MeasurerUtils;
        WorldWind['MemoryCache'] = MemoryCache;
        WorldWind['MemoryCacheListener'] = MemoryCacheListener;
        WorldWind['MercatorTiledImageLayer'] = MercatorTiledImageLayer;
        WorldWind['Navigator'] = Navigator;
        WorldWind['NominatimGeocoder'] = NominatimGeocoder;
        WorldWind['NotYetImplementedError'] = NotYetImplementedError;
        WorldWind['Offset'] = Offset;
        WorldWind['OpenStreetMapImageLayer'] = OpenStreetMapImageLayer;
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
        WorldWind['PolygonSplitter'] = PolygonSplitter;
        WorldWind['Position'] = Position;
        WorldWind['ProjectionEquirectangular'] = ProjectionEquirectangular;
        WorldWind['ProjectionGnomonic'] = ProjectionGnomonic;
        WorldWind['ProjectionMercator'] = ProjectionMercator;
        WorldWind['ProjectionPolarEquidistant'] = ProjectionPolarEquidistant;
        WorldWind['ProjectionUPS'] = ProjectionUPS;
        WorldWind['ProjectionWgs84'] = ProjectionWgs84;
        WorldWind['Rectangle'] = Rectangle;
        WorldWind['Renderable'] = Renderable;
        WorldWind['RenderableLayer'] = RenderableLayer;
        WorldWind['RestTiledImageLayer'] = RestTiledImageLayer;
        WorldWind['RotationRecognizer'] = RotationRecognizer;
        WorldWind['ScreenText'] = ScreenText;
        WorldWind['ScreenImage'] = ScreenImage;
        WorldWind['Sector'] = Sector;
        WorldWind['ShapeAttributes'] = ShapeAttributes;
        WorldWind['Shapefile'] = Shapefile;
        WorldWind['ShowTessellationLayer'] = ShowTessellationLayer;
        WorldWind['SkyProgram'] = SkyProgram;
        WorldWind['StarFieldLayer'] = StarFieldLayer;
        WorldWind['StarFieldProgram'] = StarFieldProgram;
        WorldWind['SunPosition'] = SunPosition;
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
        WorldWind['TectonicPlatesLayer'] = TectonicPlatesLayer;
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
        WorldWind['ViewControlsLayer'] = ViewControlsLayer;
        WorldWind['WcsCapabilities'] = WcsCapabilities;
        WorldWind['WcsCoverage'] = WcsCoverage;
        WorldWind['WcsCoverageDescriptions'] = WcsCoverageDescriptions;
        WorldWind['WcsEarthElevationCoverage'] = WcsEarthElevationCoverage;
        WorldWind['WcsTileUrlBuilder'] = WcsTileUrlBuilder;
        WorldWind['WebCoverageService'] = WebCoverageService;
        WorldWind['WfsCapabilities'] = WfsCapabilities;
        WorldWind['Wkt'] = Wkt;
        WorldWind['WktElements'] = WktElements;
        WorldWind['WktExporter'] = WktExporter;
        WorldWind['WktGeometryCollection'] = WktGeometryCollection;
        WorldWind['WktLineString'] = WktLineString;
        WorldWind['WktMultiLineString'] = WktMultiLineString;
        WorldWind['WktMultiPoint'] = WktMultiPoint;
        WorldWind['WktMultiPolygon'] = WktMultiPolygon;
        WorldWind['WktObject'] = WktObject;
        WorldWind['WktPoint'] = WktPoint;
        WorldWind['WktPolygon'] = WktPolygon;
        WorldWind['WktTokens'] = WktTokens;
        WorldWind['WktTriangle'] = WktTriangle;
        WorldWind['WktType'] = WktType;
        WorldWind['WmsCapabilities'] = WmsCapabilities;
        WorldWind['WmsLayer'] = WmsLayer;
        WorldWind['WmsLayerCapabilities'] = WmsLayerCapabilities;
        WorldWind['WmsTimeDimensionedLayer'] = WmsTimeDimensionedLayer;
        WorldWind['WmsUrlBuilder'] = WmsUrlBuilder;
        WorldWind['WmtsCapabilities'] = WmtsCapabilities;
        WorldWind['WmtsLayer'] = WmtsLayer;
        WorldWind['WmtsLayerCapabilities'] = WmtsLayerCapabilities;
        WorldWind['WWMath'] = WWMath;
        WorldWind['WWMessage'] = WWMessage;
        WorldWind['WWUtil'] = WWUtil;
        WorldWind['WorldWindow'] = WorldWindow;
        WorldWind['WorldWindowController'] = WorldWindowController;

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
            baseUrl: (WWUtil.worldwindlibLocation()) || (WWUtil.currentUrlSansFilePart() + '/../'),
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
    