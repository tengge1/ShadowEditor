/**
* OpenStreetMap瓦片图层
*/
ZeroGIS.OsmTiledLayer = function (args) {
    ZeroGIS.TiledLayer.apply(this, arguments);
};

ZeroGIS.OsmTiledLayer.prototype = new ZeroGIS.TiledLayer();
ZeroGIS.OsmTiledLayer.prototype.constructor = ZeroGIS.OsmTiledLayer;

ZeroGIS.OsmTiledLayer.prototype.getImageUrl = function (level, row, column) {
    ZeroGIS.TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var sum = level + row + column;
    var idx = sum % 3;
    var server = ["a", "b", "c"][idx];
    var url = "//" + server + ".tile.openstreetmap.org/" + level + "/" + column + "/" + row + ".png";
    return url;
};