import TiledLayer from './TiledLayer';
import NokiaTiledLayer from './NokiaTiledLayer';
import GoogleTiledLayer from './GoogleTiledLayer';
import OsmTiledLayer from './OsmTiledLayer';

var BlendTiledLayer = function (args) {
    TiledLayer.apply(this, arguments);
};

BlendTiledLayer.prototype = new TiledLayer();
BlendTiledLayer.prototype.constructor = BlendTiledLayer;

BlendTiledLayer.prototype.getImageUrl = function (level, row, column) {
    TiledLayer.prototype.getImageUrl.apply(this, arguments);
    var array = [NokiaTiledLayer, GoogleTiledLayer, OsmTiledLayer];
    var sum = level + row + column;
    var idx = sum % 3;
    var url = array[idx].prototype.getImageUrl.apply(this, arguments);
    return url;
};

export default BlendTiledLayer;