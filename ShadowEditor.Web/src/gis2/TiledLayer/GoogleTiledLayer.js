/**
* 谷歌瓦片图层
*/
ZeroGIS.GoogleTiledLayer = function (args) {
    ZeroGIS.TiledLayer.apply(this, arguments);
};

ZeroGIS.GoogleTiledLayer.prototype = new ZeroGIS.TiledLayer();
ZeroGIS.GoogleTiledLayer.prototype.constructor = ZeroGIS.GoogleTiledLayer;

ZeroGIS.GoogleTiledLayer.prototype.getImageUrl = function (level, row, column) {
    ZeroGIS.TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var sum = level + row + column;
    var idx = 1 + sum % 3;
    var url = "//mt" + idx + ".google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x=" + column + "&y=" + row + "&z=" + level + "&s=Galil";
    return url;
};
