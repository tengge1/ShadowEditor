/**
* 高德地图瓦片图层
*/
ZeroGIS.AutonaviTiledLayer = function (args) {
    ZeroGIS.TiledLayer.apply(this, arguments);
};

ZeroGIS.AutonaviTiledLayer.prototype = new ZeroGIS.TiledLayer();
ZeroGIS.AutonaviTiledLayer.prototype.constructor = ZeroGIS.AutonaviTiledLayer;

ZeroGIS.AutonaviTiledLayer.prototype.getImageUrl = function (level, row, column) {
    ZeroGIS.TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var sum = level + row + column;
    var serverIdx = 1 + sum % 4; //1、2、3、4
    var url = ZeroGIS.proxy + "?//webrd0" + serverIdx + ".is.autonavi.com/appmaptile?x=" + column + "&y=" + row + "&z=" + level + "&lang=zh_cn&size=1&scale=1&style=8";
    return url;
};