define(["world/Kernel", "world/TiledLayer"], function(Kernel, TiledLayer) {
  //使用代理
  var AutonaviTiledLayer = function(args) {
    TiledLayer.apply(this, arguments);
  };
  AutonaviTiledLayer.prototype = new TiledLayer();
  AutonaviTiledLayer.prototype.constructor = AutonaviTiledLayer;
  AutonaviTiledLayer.prototype.getImageUrl = function(level, row, column) {
    TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var sum = level + row + column;
    var serverIdx = 1 + sum % 4; //1、2、3、4
    var url = Kernel.proxy + "?//webrd0" + serverIdx + ".is.autonavi.com/appmaptile?x=" + column + "&y=" + row + "&z=" + level + "&lang=zh_cn&size=1&scale=1&style=8";
    return url;
  };
  return AutonaviTiledLayer;
});