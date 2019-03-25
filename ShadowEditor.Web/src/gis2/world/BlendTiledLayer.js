define(["world/TiledLayer", "world/NokiaTiledLayer", "world/GoogleTiledLayer", "world/OsmTiledLayer"], function(TiledLayer) {
  var BlendTiledLayer = function(args) {
    TiledLayer.apply(this, arguments);
  };
  BlendTiledLayer.prototype = new TiledLayer();
  BlendTiledLayer.prototype.constructor = BlendTiledLayer;
  BlendTiledLayer.prototype.getImageUrl = function(level, row, column) {
    TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var array = [NokiaTiledLayer, GoogleTiledLayer, OsmTiledLayer];
    var sum = level + row + column;
    var idx = sum % 3;
    var url = array[idx].prototype.getImageUrl.apply(this, arguments);
    return url;
  };
  return BlendTiledLayer;
});