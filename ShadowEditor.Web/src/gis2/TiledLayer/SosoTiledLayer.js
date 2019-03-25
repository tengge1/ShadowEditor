/**
* Soso瓦片图层
*/

ZeroGIS.SosoTiledLayer = function (args) {
    ZeroGIS.TiledLayer.apply(this, arguments);
};

ZeroGIS.SosoTiledLayer.prototype = new ZeroGIS.TiledLayer();
ZeroGIS.SosoTiledLayer.prototype.constructor = ZeroGIS.SosoTiledLayer;

ZeroGIS.SosoTiledLayer.prototype.getImageUrl = function (level, row, column) {
    ZeroGIS.TiledLayer.prototype.getImageUrl.apply(this, arguments);
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
