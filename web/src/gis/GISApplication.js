import global from '../global';

/**
 * GISApplication is a GIS application based on CesiumJS.
 */
class GISApplication {
    start() {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDhkNjFjYy00MTA1LTRkYjAtYTliZi1jZGI2NWE3YTlhMzAiLCJpZCI6MjA3NTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzgyOTMxOTh9.8Xq0jpjeo0-3Jbfi_oWEtU5I-isAP9EBJeCElSfP_pU';
        var viewer = new Cesium.Viewer(global.app.cesiumRef);
        // viewer.scene.postProcessStages.fxaa.enabled = false;
        // viewer.scene.fxaa = false;
        // viewer.scene.globe.maximumScreenSpaceError = 5;
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
        var provider = new Cesium.BingMapsImageryProvider({
            url: 'https://dev.virtualearth.net',
            key: 'Amvk_1DmXPpb7VB7JIXtWHBIpXdK8ABDN7E2xiK8olFovcy5KcVjVfpsW8rxoeVZ',
            mapStyle: Cesium.BingMapsStyle.AERIAL
        });
        // sdmap
        // var provider = new Cesium.WebMapTileServiceImageryProvider({
        //     url: 'http://www.sdmap.gov.cn/tileservice/SDRasterPubMap',
        //     layer: 'SDRasterPubMap',
        //     style: 'default',
        //     format: 'image/jpeg',
        //     tileMatrixSetID: 'raster',
        //     maximumLevel: 18,
        //     credit: 'sdmap'
        // });
        // google
        // var provider = new Cesium.WebMapTileServiceImageryProvider({
        //     url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=36c59ede59e3760b6fff1cf5f8c37a01",
        //     layer: "img",
        //     style: "default",
        //     format: "tiles",
        //     tileMatrixSetID: "w",
        //     credit: new Cesium.Credit('tianditu'),
        //     subdomains: ['t0', "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        //     maximumLevel: 18,
        //     show: false
        // });
        var layer = new Cesium.ImageryLayer(provider);
        viewer.imageryLayers.add(layer);
    }
}

export default GISApplication;