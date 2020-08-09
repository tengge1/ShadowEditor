import global from '../global';

/**
 * GISApplication is a GIS application based on CesiumJS.
 */
class GISApplication {
    start() {
        var viewer = new Cesium.Viewer(global.app.cesiumRef);
        window.viewer = viewer;
        this.createTerrain(viewer);
        this.createLayers(viewer);
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

    createLayers(viewer) {
        viewer.imageryLayers.removeAll();
        // bing
        var bing = new Cesium.BingMapsImageryProvider({
            url: 'https://dev.virtualearth.net',
            key: 'Amvk_1DmXPpb7VB7JIXtWHBIpXdK8ABDN7E2xiK8olFovcy5KcVjVfpsW8rxoeVZ',
            mapStyle: Cesium.BingMapsStyle.AERIAL
        });
        var layer = new Cesium.ImageryLayer(bing);
        viewer.imageryLayers.add(layer);
    }
}

export default GISApplication;