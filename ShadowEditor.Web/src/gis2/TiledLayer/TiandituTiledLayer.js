/**
* 天地图瓦片图层
*/
ZeroGIS.TiandituTiledLayer = function (args) {
    ZeroGIS.TiledLayer.apply(this, arguments);
};

ZeroGIS.TiandituTiledLayer.prototype = new ZeroGIS.TiledLayer();

ZeroGIS.TiandituTiledLayer.prototype.constructor = ZeroGIS.TiandituTiledLayer;

ZeroGIS.TiandituTiledLayer.prototype.getImageUrl = function (level, row, column) {
    ZeroGIS.TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var url = "";
    var sum = level + row + column;
    var serverIdx = sum % 8;
    url = "//t" + serverIdx + ".tianditu.com/DataServer?T=vec_w&x=" + column + "&y=" + row + "&l=" + level;
    return url;
};
