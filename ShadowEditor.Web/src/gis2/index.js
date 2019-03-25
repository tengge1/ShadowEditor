// import 'ZeroGIS.js';
// import 'Enum.js';
// import 'Utils.js';
// import 'Vertice.js';
// import 'Vector.js';
// import 'Matrix.js';
// import 'Image.js';
// import 'Elevation.js';
// import 'Object3D/Object3D.js';
// import 'Object3D/ShaderContent.js';
// import 'Object3D/WebGLRenderer.js';
// import 'Object3D/Line.js';
// import 'Object3D/PerspectiveCamera.js';
// import 'Object3D/Object3DComponents.js';
// import 'Object3D/Scene.js';
// import 'Object3D/TextureMaterial.js';
// import 'Object3D/TileMaterial.js';
// import 'Object3D/Tile.js';
// import 'Object3D/TileGrid.js';
// import 'MathUtils.js';
// import 'Event.js';
// import 'Globe.js';
// import 'TiledLayer/TiledLayer.js';
// import 'TiledLayer/SubTiledLayer.js';
// import 'TiledLayer/GoogleTiledLayer.js';
// import 'TiledLayer/BingTiledLayer.js';
// import 'TiledLayer/OsmTiledLayer.js';
// import 'TiledLayer/SosoTiledLayer.js';
// import 'TiledLayer/TiandituTiledLayer.js';
// import 'TiledLayer/NokiaTiledLayer.js';
// import 'TiledLayer/ArcGISTiledLayer.js';
// import 'TiledLayer/AutonaviTiledLayer.js';
// import 'TiledLayer/BlendTiledLayer.js';

var globe;

function start() {
    var canvas = document.getElementById("container");
    globe = new ZeroGIS.Globe(canvas);
    var selector = document.getElementById("mapSelector");
    selector.onchange = changeTiledLayer;
    changeTiledLayer();
}

function changeTiledLayer() {
    var mapSelector = document.getElementById("mapSelector");
    mapSelector.blur();
    var newTiledLayer = null;
    var args = null;
    var value = mapSelector.value;
    switch (value) {
        case "google":
            newTiledLayer = new ZeroGIS.GoogleTiledLayer();
            break;
        case "bing":
            newTiledLayer = new ZeroGIS.BingTiledLayer();
            break;
        case "osm":
            newTiledLayer = new ZeroGIS.OsmTiledLayer();
            break;
        case "soso":
            newTiledLayer = new ZeroGIS.SosoTiledLayer();
            break;
        case "tianditu":
            newTiledLayer = new ZeroGIS.TiandituTiledLayer();
            break;
        default:
            break;
    }

    if (newTiledLayer) {
        globe.setTiledLayer(newTiledLayer);
    }
}

window.onload = start;