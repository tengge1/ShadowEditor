/**
* ArcGIS瓦片图层
*/
ZeroGIS.ArcGISTiledLayer = function (args) {
    ZeroGIS.TiledLayer.apply(this, arguments);
    this.service = "";
    if (args) {
        if (args.url) {
            this.service = args.url;
        }
    }
};

ZeroGIS.ArcGISTiledLayer.prototype = new ZeroGIS.TiledLayer();
ZeroGIS.ArcGISTiledLayer.prototype.constructor = ZeroGIS.ArcGISTiledLayer;

ZeroGIS.ArcGISTiledLayer.prototype.getImageUrl = function (level, row, column) {
    ZeroGIS.TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var url = ZeroGIS.proxy + "?" + this.service + "/tile/" + level + "/" + row + "/" + column;
    return url;
};
