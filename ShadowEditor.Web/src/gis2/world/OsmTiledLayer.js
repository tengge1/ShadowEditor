define(["world/TiledLayer"], function(TiledLayer) {
  //OpenStreetMap
  var OsmTiledLayer = function(args) {
    TiledLayer.apply(this, arguments);
  };
  OsmTiledLayer.prototype = new TiledLayer();
  OsmTiledLayer.prototype.constructor = OsmTiledLayer;
  OsmTiledLayer.prototype.getImageUrl = function(level, row, column) {
    TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var sum = level + row + column;
    var idx = sum % 3;
    var server = ["a","b","c"][idx];
    var url = "//"+server+".tile.openstreetmap.org/"+level+"/"+column+"/"+row+".png";
    return url;
  };
  return OsmTiledLayer;
});