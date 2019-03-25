/**
* 子瓦片图层
*/
ZeroGIS.SubTiledLayer = function (args) {
    ZeroGIS.Object3DComponents.apply(this, arguments);
    this.level = -1;
    //该级要请求的高程数据的层级，7[8,9,10];10[11,12,13];13[14,15,16];16[17,18,19]
    this.elevationLevel = -1;
    this.tiledLayer = null;
    if (args) {
        if (args.level !== undefined) {
            this.level = args.level;
            this.elevationLevel = ZeroGIS.Elevation.getAncestorElevationLevel(this.level);
        }
    }
};

ZeroGIS.SubTiledLayer.prototype = new ZeroGIS.Object3DComponents();

ZeroGIS.SubTiledLayer.prototype.constructor = ZeroGIS.SubTiledLayer;

ZeroGIS.SubTiledLayer.prototype.draw = function (camera) {
    if (this.level >= ZeroGIS.TERRAIN_LEVEL && ZeroGIS.globe && ZeroGIS.globe.pitch <= ZeroGIS.TERRAIN_PITCH) {
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
    } else {
        gl.disable(gl.DEPTH_TEST);
    }
    ZeroGIS.Object3DComponents.prototype.draw.apply(this, arguments);
};

ZeroGIS.SubTiledLayer.prototype.add = function (tile) {
    if (!(tile instanceof ZeroGIS.Tile)) {
        throw "invalid tile: not Tile";
    }
    if (tile.level == this.level) {
        ZeroGIS.Object3DComponents.prototype.add.apply(this, arguments);
        tile.subTiledLayer = this;
    }
};

//调用其父的getImageUrl
ZeroGIS.SubTiledLayer.prototype.getImageUrl = function (level, row, column) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    var url = "";
    if (this.tiledLayer) {
        url = this.tiledLayer.getImageUrl(level, row, column);
    }
    return url;
};

//重写Object3DComponents的destroy方法
ZeroGIS.SubTiledLayer.prototype.destroy = function () {
    ZeroGIS.Object3DComponents.prototype.destroy.apply(this, arguments);
    this.tiledLayer = null;
};

//根据level、row、column查找tile，可以供调试用
ZeroGIS.SubTiledLayer.prototype.findTile = function (level, row, column) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    var length = this.children.length;
    for (var i = 0; i < length; i++) {
        var tile = this.children[i];
        if (tile.level == level && tile.row == row && tile.column == column) {
            return tile;
        }
    }
    return null;
};

//根据传入的tiles信息进行更新其children
ZeroGIS.SubTiledLayer.prototype.updateTiles = function (visibleTileGrids, bAddNew) { //camera,options
    //var visibleTileGrids = camera.getVisibleTilesByLevel(this.level,options);
    //检查visibleTileGrids中是否存在指定的切片信息
    function checkTileExist(tileArray, lev, row, col) {
        var result = {
            isExist: false,
            index: -1
        };
        for (var m = 0; m < tileArray.length; m++) {
            var tileInfo = tileArray[m];
            if (tileInfo.level == lev && tileInfo.row == row && tileInfo.column == col) {
                result.isExist = true;
                result.index = m;
                return result;
            }
        }
        return result;
    }

    //记录应该删除的切片
    var tilesNeedDelete = [];
    var i, tile;
    for (i = 0; i < this.children.length; i++) {
        tile = this.children[i];
        var checkResult = checkTileExist(visibleTileGrids, tile.level, tile.row, tile.column);
        var isExist = checkResult.isExist;
        if (isExist) {
            visibleTileGrids.splice(checkResult.index, 1); //已处理
        } else {
            //暂时不删除，先添加要删除的标记，循环删除容易出错
            tilesNeedDelete.push(tile);
        }
    }

    //集中进行删除
    while (tilesNeedDelete.length > 0) {
        var b = this.remove(tilesNeedDelete[0]);
        tilesNeedDelete.splice(0, 1);
        if (!b) {
            console.debug("LINE:2191,subTiledLayer.remove(tilesNeedDelete[0])失败");
        }
    }

    if (bAddNew) {
        //添加新增的切片
        for (i = 0; i < visibleTileGrids.length; i++) {
            var tileGridInfo = visibleTileGrids[i];
            var args = {
                level: tileGridInfo.level,
                row: tileGridInfo.row,
                column: tileGridInfo.column,
                url: ""
            };
            args.url = this.tiledLayer.getImageUrl(args.level, args.row, args.column);
            tile = new ZeroGIS.Tile(args);
            this.add(tile);
        }
    }
};

//如果bForce为true，则表示强制显示为三维，不考虑level
ZeroGIS.SubTiledLayer.prototype.checkTerrain = function (bForce) {
    var globe = ZeroGIS.globe;
    var show3d = bForce === true ? true : this.level >= ZeroGIS.TERRAIN_LEVEL;
    if (show3d && globe && globe.camera && globe.camera.pitch < ZeroGIS.TERRAIN_PITCH) {
        var tiles = this.children;
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            tile.checkTerrain(bForce);
        }
    }
};

//根据当前子图层下的tiles获取其对应的祖先高程切片的TileGrid //getAncestorElevationTileGrids
//7 8 9 10; 10 11 12 13; 13 14 15 16; 16 17 18 19;
ZeroGIS.SubTiledLayer.prototype.requestElevations = function () {
    var result = [];
    if (this.level > ZeroGIS.ELEVATION_LEVEL) {
        var tiles = this.children;
        var i, name;
        for (i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            var tileGrid = MathUtils.getTileGridAncestor(this.elevationLevel, tile.level, tile.row, tile.column);
            name = tileGrid.level + "_" + tileGrid.row + "_" + tileGrid.column;
            if (result.indexOf(name) < 0) {
                result.push(name);
            }
        }
        for (i = 0; i < result.length; i++) {
            name = result[i];
            var a = name.split('_');
            var eleLevel = parseInt(a[0]);
            var eleRow = parseInt(a[1]);
            var eleColumn = parseInt(a[2]);
            //只要elevations中有属性name，那么就表示该高程已经请求过或正在请求，这样就不要重新请求了
            //只有在完全没请求过的情况下去请求高程数据
            if (!ZeroGIS.Elevation.elevations.hasOwnProperty(name)) {
                ZeroGIS.Elevation.requestElevationsByTileGrid(eleLevel, eleRow, eleColumn);
            }
        }
    }
};

ZeroGIS.SubTiledLayer.prototype.checkIfLoaded = function () {
    for (var i = 0; i < this.children.length; i++) {
        var tile = this.children[i];
        if (tile) {
            var isTileLoaded = tile.material.loaded;
            if (!isTileLoaded) {
                return false;
            }
        }
    }
    return true;
};