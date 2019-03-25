define(["world/TiledLayer"], function(TiledLayer) {
  var TiandituTiledLayer = function(args) {
    TiledLayer.apply(this, arguments);
  };
  TiandituTiledLayer.prototype = new TiledLayer();
  TiandituTiledLayer.prototype.constructor = TiandituTiledLayer;
  TiandituTiledLayer.prototype.getImageUrl = function(level, row, column) {
    TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var url = "";
    var sum = level + row + column;
    var serverIdx = sum % 8;
    url = "//t" + serverIdx + ".tianditu.com/DataServer?T=vec_w&x=" + column + "&y=" + row + "&l=" + level;
    return url;
  };
  return TiandituTiledLayer;
});