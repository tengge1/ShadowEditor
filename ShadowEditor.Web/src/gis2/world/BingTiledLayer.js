define(["world/Math", "world/TiledLayer"], function(MathUtils, TiledLayer) {
  //Bing地图
  var BingTiledLayer = function(args) {
    TiledLayer.apply(this, arguments);
  };
  BingTiledLayer.prototype = new TiledLayer();
  BingTiledLayer.prototype.constructor = BingTiledLayer;
  BingTiledLayer.prototype.getImageUrl = function(level, row, column) {
    TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var url = "";
    var tileX = column;
    var tileY = row;
    var strTileX2 = MathUtils.numerationSystemFrom10(2, tileX);
    var strTileY2 = MathUtils.numerationSystemFrom10(2, tileY);
    var delta = strTileX2.length - strTileY2.length;
    var i;
    if (delta > 0) {
      for (i = 0; i < delta; i++) {
        strTileY2 = '0' + strTileY2;
      }
    } else if (delta < 0) {
      delta = -delta;
      for (i = 0; i < delta; i++) {
        strTileX2 = '0' + strTileX2;
      }
    }
    var strMerge2 = "";
    for (i = 0; i < strTileY2.length; i++) {
      var charY = strTileY2[i];
      var charX = strTileX2[i];
      strMerge2 += charY + charX;
    }
    var strMerge4 = MathUtils.numerationSystemChange(2, 4, strMerge2);
    if (strMerge4.length < level) {
      delta = level - strMerge4.length;
      for (i = 0; i < delta; i++) {
        strMerge4 = '0' + strMerge4;
      }
    }
    var sum = level + row + column;
    var serverIdx = sum % 8; //0,1,2,3,4,5,6,7
    //var styles = ['a','r','h']
    url = "//ecn.t" + serverIdx + ".tiles.virtualearth.net/tiles/h" + strMerge4 + ".jpeg?g=1239&mkt=en-us";
    return url;
  };

  return BingTiledLayer;
});