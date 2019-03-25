define(["world/TiledLayer"], function(TiledLayer) {
  var SosoTiledLayer = function(args) {
    TiledLayer.apply(this, arguments);
  };
  SosoTiledLayer.prototype = new TiledLayer();
  SosoTiledLayer.prototype.constructor = SosoTiledLayer;
  SosoTiledLayer.prototype.getImageUrl = function(level, row, column) {
    TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var url = "";
    var tileCount = Math.pow(2, level);
    var a = column;
    var b = tileCount - row - 1;
    var A = Math.floor(a / 16);
    var B = Math.floor(b / 16);
    var sum = level + row + column;
    var serverIdx = sum % 4; //0、1、2、3
    var sateUrl = "//p" + serverIdx + ".map.gtimg.com/sateTiles/" + level + "/" + A + "/" + B + "/" + a + "_" + b + ".jpg";
    //var maptileUrl = "http://p"+serverIdx+".map.soso.com/maptilesv2/"+level+"/"+A+"/"+B+"/"+a+"_"+b+".png";
    url = sateUrl;
    return url;
  };
  return SosoTiledLayer;
});