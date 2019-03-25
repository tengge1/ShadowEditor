define(["world/Kernel", "world/Utils", "world/Math", "world/Object3DComponents", "world/Tile", "world/Elevation"],
  function(Kernel, Utils, MathUtils, Object3DComponents, Tile, Elevation) {
    var SubTiledLayer = function(args) {
      Object3DComponents.apply(this, arguments);
      this.level = -1;
      //该级要请求的高程数据的层级，7[8,9,10];10[11,12,13];13[14,15,16];16[17,18,19]
      this.elevationLevel = -1;
      this.tiledLayer = null;
      if (args) {
        if (args.level !== undefined) {
          this.level = args.level;
          this.elevationLevel = Elevation.getAncestorElevationLevel(this.level);
        }
      }
    };
    SubTiledLayer.prototype = new Object3DComponents();
    SubTiledLayer.prototype.constructor = SubTiledLayer;
    //重写draw方法
    SubTiledLayer.prototype.draw = function(camera) {
      if (this.level >= Kernel.TERRAIN_LEVEL && Kernel.globe && Kernel.globe.pitch <= Kernel.TERRAIN_PITCH) {
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
      } else {
        gl.disable(gl.DEPTH_TEST);
      }
      Object3DComponents.prototype.draw.apply(this, arguments);
    };
    //重写Object3DComponents的add方法
    SubTiledLayer.prototype.add = function(tile) {
      if (!(tile instanceof Tile)) {
        throw "invalid tile: not Tile";
      }
      if (tile.level == this.level) {
        Object3DComponents.prototype.add.apply(this, arguments);
        tile.subTiledLayer = this;
      }
    };
    //调用其父的getImageUrl
    SubTiledLayer.prototype.getImageUrl = function(level, row, column) {
      if (!Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
      }
      if (!Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
      }
      if (!Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
      }
      var url = "";
      if (this.tiledLayer) {
        url = this.tiledLayer.getImageUrl(level, row, column);
      }
      return url;
    };
    //重写Object3DComponents的destroy方法
    SubTiledLayer.prototype.destroy = function() {
      Object3DComponents.prototype.destroy.apply(this, arguments);
      this.tiledLayer = null;
    };
    //根据level、row、column查找tile，可以供调试用
    SubTiledLayer.prototype.findTile = function(level, row, column) {
      if (!Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
      }
      if (!Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
      }
      if (!Utils.isNonNegativeInteger(column)) {
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
    SubTiledLayer.prototype.updateTiles = function(visibleTileGrids, bAddNew) { //camera,options
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
          tile = new Tile(args);
          this.add(tile);
        }
      }
    };
    //如果bForce为true，则表示强制显示为三维，不考虑level
    SubTiledLayer.prototype.checkTerrain = function(bForce) {
      var globe = Kernel.globe;
      var show3d = bForce === true ? true : this.level >= Kernel.TERRAIN_LEVEL;
      if (show3d && globe && globe.camera && globe.camera.pitch < Kernel.TERRAIN_PITCH) {
        var tiles = this.children;
        for (var i = 0; i < tiles.length; i++) {
          var tile = tiles[i];
          tile.checkTerrain(bForce);
        }
      }
    };


    //根据当前子图层下的tiles获取其对应的祖先高程切片的TileGrid //getAncestorElevationTileGrids
    //7 8 9 10; 10 11 12 13; 13 14 15 16; 16 17 18 19;
    SubTiledLayer.prototype.requestElevations = function() {
      var result = [];
      if (this.level > Kernel.ELEVATION_LEVEL) {
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
          if (!Elevation.elevations.hasOwnProperty(name)) {
            Elevation.requestElevationsByTileGrid(eleLevel, eleRow, eleColumn);
          }
        }
      }
    };
    SubTiledLayer.prototype.checkIfLoaded = function() {
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
    return SubTiledLayer;
  });