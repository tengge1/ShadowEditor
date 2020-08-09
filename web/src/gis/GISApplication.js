import global from '../global';

/**
 * GISApplication is a GIS application based on CesiumJS.
 */
class GISApplication {
    constructor() {

    }

    start() {
        var viewer = new Cesium.Viewer(global.app.cesiumRef);
        var terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider({
            url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'
        });
        viewer.terrainProvider = terrainProvider;
    }
}

export default GISApplication;