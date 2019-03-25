/**
* 混合瓦片图层
*/
ZeroGIS.BlendTiledLayer = function (args) {
    ZeroGIS.TiledLayer.apply(this, arguments);
};

ZeroGIS.BlendTiledLayer.prototype = new ZeroGIS.TiledLayer();
ZeroGIS.BlendTiledLayer.prototype.constructor = ZeroGIS.BlendTiledLayer;

ZeroGIS.BlendTiledLayer.prototype.getImageUrl = function (level, row, column) {
    ZeroGIS.TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var array = [NokiaTiledLayer, GoogleTiledLayer, OsmTiledLayer];
    var sum = level + row + column;
    var idx = sum % 3;
    var url = array[idx].prototype.getImageUrl.apply(this, arguments);
    return url;
};