/**
* 瓦片图层
*/
ZeroGIS.TiledLayer = function (args) {
    ZeroGIS.Object3DComponents.apply(this, arguments);
};

ZeroGIS.TiledLayer.prototype = new ZeroGIS.Object3DComponents();
ZeroGIS.TiledLayer.prototype.constructor = ZeroGIS.TiledLayer;

ZeroGIS.TiledLayer.prototype.add = function (subTiledLayer) {
    if (!(subTiledLayer instanceof ZeroGIS.SubTiledLayer)) {
        throw "invalid subTiledLayer: not World.SubTiledLayer";
    }
    ZeroGIS.Object3DComponents.prototype.add.apply(this, arguments);
    subTiledLayer.tiledLayer = this;
};

//根据切片的层级以及行列号获取图片的url,抽象方法，供子类实现
ZeroGIS.TiledLayer.prototype.getImageUrl = function (level, row, column) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    return "";
};

//根据传入的level更新SubTiledLayer的数量
ZeroGIS.TiledLayer.prototype.updateSubLayerCount = function (level) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    var subLayerCount = this.children.length;
    var deltaLevel = level + 1 - subLayerCount;
    var i, subLayer;
    if (deltaLevel > 0) {
        //需要增加子图层
        for (i = 0; i < deltaLevel; i++) {
            var args = {
                level: i + subLayerCount
            };
            subLayer = new ZeroGIS.SubTiledLayer(args);
            this.add(subLayer);
        }
    } else if (deltaLevel < 0) {
        //需要删除多余的子图层
        deltaLevel *= -1;
        for (i = 0; i < deltaLevel; i++) {
            var removeLevel = this.children.length - 1;
            //第0级和第1级不删除
            if (removeLevel >= 2) {
                subLayer = this.children[removeLevel];
                this.remove(subLayer);
            } else {
                break;
            }
        }
    }
};