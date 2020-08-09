import global from '../global';

/**
 * GISApplication is a GIS application based on CesiumJS.
 */
class GISApplication {
    start() {
        var viewer = new Cesium.Viewer(global.app.cesiumRef);
        window.viewer = viewer;
        this.createTerrain(viewer);
    }

    createTerrain(viewer) {
        var url = 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer';
        if (global.app.options.enableCache) {
            url = `${global.app.options.server}/api/Map/Elevation`;
        }
        var terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider({
            url
        });
        viewer.terrainProvider = terrainProvider;
    }
}

export default GISApplication;