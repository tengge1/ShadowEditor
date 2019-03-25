define(["world/Kernel", "world/TiledLayer"], function(Kernel, TiledLayer) {
  //使用代理
  var ArcGISTiledLayer = function(args) {
    TiledLayer.apply(this, arguments);
    this.service = "";
    if (args) {
      if (args.url) {
        this.service = args.url;
      }
    }
  };
  ArcGISTiledLayer.prototype = new TiledLayer();
  ArcGISTiledLayer.prototype.constructor = ArcGISTiledLayer;
  ArcGISTiledLayer.prototype.getImageUrl = function(level, row, column) {
    TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var url = Kernel.proxy + "?" + this.service + "/tile/" + level + "/" + row + "/" + column;
    return url;
  };
  return ArcGISTiledLayer;
});