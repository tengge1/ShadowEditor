/**
* 瓦片
*/
ZeroGIS.Tile = function (args) { //args中包含level、row、column、url即可
    if (args) {
        this.subTiledLayer = null;
        //type如果是GLOBE_TILE，表示其buffer已经设置为一般形式
        //type如果是TERRAIN_TILE，表示其buffer已经设置为高程形式
        //type如果是UNKNOWN，表示buffer没设置
        this.type = ZeroGIS.Enum.UNKNOWN;
        this.level = 0;
        this.row = 0;
        this.column = 0;
        this.url = args.url;
        this.elevationLevel = 0; //高程level
        this.minLon = null;
        this.minLat = null;
        this.maxLon = null;
        this.maxLat = null;
        this.minX = null;
        this.minY = null;
        this.maxX = null;
        this.maxY = null;
        this.elevationInfo = null;
        ZeroGIS.Object3D.apply(this, arguments);
    }
};

ZeroGIS.Tile.prototype = new ZeroGIS.Object3D();

ZeroGIS.Tile.prototype.constructor = ZeroGIS.Tile;

ZeroGIS.Tile.prototype.createVerticeData = function (args) {
    if (!args) {
        return;
    }
    this.setTileInfo(args);
    this.checkTerrain();
};

// 根据传入的切片的层级以及行列号信息设置切片的经纬度范围 以及设置其纹理
ZeroGIS.Tile.prototype.setTileInfo = function (args) {
    this.level = args.level;
    this.row = args.row;
    this.column = args.column;
    this.elevationLevel = ZeroGIS.Elevation.getAncestorElevationLevel(this.level);
    //经纬度范围
    var Egeo = ZeroGIS.MathUtils.getTileGeographicEnvelopByGrid(this.level, this.row, this.column);
    this.minLon = Egeo.minLon;
    this.minLat = Egeo.minLat;
    this.maxLon = Egeo.maxLon;
    this.maxLat = Egeo.maxLat;
    var minCoord = ZeroGIS.MathUtils.degreeGeographicToWebMercator(this.minLon, this.minLat);
    var maxCoord = ZeroGIS.MathUtils.degreeGeographicToWebMercator(this.maxLon, this.maxLat);
    //投影坐标范围
    this.minX = minCoord[0];
    this.minY = minCoord[1];
    this.maxX = maxCoord[0];
    this.maxY = maxCoord[1];
    var matArgs = {
        level: this.level,
        url: this.url
    };
    this.material = new ZeroGIS.TileMaterial(matArgs);
};

/**
 * 判断是否满足现实Terrain的条件，若满足则转换为三维地形
 * 条件:
 * 1.当前显示的是GlobeTile
 * 2.该切片的level大于TERRAIN_LEVEL
 * 3.pich不为90
 * 4.当前切片的高程数据存在
 * 5.如果bForce为true，则表示强制显示为三维，不考虑level
 */
ZeroGIS.Tile.prototype.checkTerrain = function (bForce) {
    var globe = ZeroGIS.globe;
    var a = bForce === true ? true : this.level >= ZeroGIS.TERRAIN_LEVEL;
    var shouldShowTerrain = this.type != ZeroGIS.Enum.TERRAIN_TILE && a && globe && globe.camera && globe.camera.pitch != 90;
    if (shouldShowTerrain) {
        //应该以TerrainTile显示
        if (!this.elevationInfo) {
            this.elevationInfo = ZeroGIS.Elevation.getExactElevation(this.level, this.row, this.column);

            //            if(this.level - this.elevationLevel == 1){
            //                //当该level与其elevationLevel只相差一级时，可以使用推倒的高程数据
            //                this.elevationInfo = Elevation.getElevation(this.level,this.row,this.column);
            //                if(this.elevationInfo){
            //                    console.log("Tile("+this.level+","+this.row+","+this.column+");sourceLevel:"+this.elevationInfo.sourceLevel+";elevationLevel:"+this.elevationLevel);
            //                }
            //            }
            //            else{
            //                //否则使用准确的高程数据
            //                this.elevationInfo = Elevation.getExactElevation(this.level,this.row,this.column);
            //            }
        }
        var canShowTerrain = this.elevationInfo ? true : false;
        if (canShowTerrain) {
            //能够显示为TerrainTile
            this.handleTerrainTile();
        } else {
            //不能够显示为TerrainTile
            this.visible = false;
            //this.handleGlobeTile();
        }
    } else {
        if (this.type == ZeroGIS.Enum.UNKNOWN) {
            //初始type为UNKNOWN，还未初始化buffer，应该显示为GlobeTile
            this.handleGlobeTile();
        }
    }
};

//处理球面的切片
ZeroGIS.Tile.prototype.handleGlobeTile = function () {
    this.type = ZeroGIS.Enum.GLOBE_TILE;
    if (this.level < ZeroGIS.BASE_LEVEL) {
        var changeLevel = ZeroGIS.BASE_LEVEL - this.level;
        this.segment = Math.pow(2, changeLevel);
    } else {
        this.segment = 1;
    }
    this.handleTile();
};

//处理地形的切片
ZeroGIS.Tile.prototype.handleTerrainTile = function () {
    this.type = ZeroGIS.Enum.TERRAIN_TILE;
    this.segment = 10;
    this.handleTile();
};

//如果是GlobeTile，那么elevations为null
//如果是TerrainTile，那么elevations是一个一维数组，大小是(segment+1)*(segment+1)
ZeroGIS.Tile.prototype.handleTile = function () {
    this.visible = true;
    var vertices = [];
    var indices = [];
    var textureCoords = [];

    var deltaX = (this.maxX - this.minX) / this.segment;
    var deltaY = (this.maxY - this.minY) / this.segment;
    var deltaTextureCoord = 1.0 / this.segment;
    var changeElevation = this.type == ZeroGIS.Enum.TERRAIN_TILE && this.elevationInfo;
    //level不同设置的半径也不同
    var levelDeltaR = 0; //this.level * 100;
    //对WebMercator投影进行等间距划分格网
    var mercatorXs = []; //存储从最小的x到最大x的分割值
    var mercatorYs = []; //存储从最大的y到最小的y的分割值
    var textureSs = []; //存储从0到1的s的分割值
    var textureTs = []; //存储从1到0的t的分割值
    var i, j;

    for (i = 0; i <= this.segment; i++) {
        mercatorXs.push(this.minX + i * deltaX);
        mercatorYs.push(this.maxY - i * deltaY);
        var b = i * deltaTextureCoord;
        textureSs.push(b);
        textureTs.push(1 - b);
    }
    //从左上到右下遍历填充vertices和textureCoords:从最上面一行开始自左向右遍历一行，然后再以相同的方式遍历下面一行
    for (i = 0; i <= this.segment; i++) {
        for (j = 0; j <= this.segment; j++) {
            var merX = mercatorXs[j];
            var merY = mercatorYs[i];
            var ele = changeElevation ? this.elevationInfo.elevations[(this.segment + 1) * i + j] : 0;
            var lonlat = ZeroGIS.MathUtils.webMercatorToDegreeGeographic(merX, merY);
            var p = ZeroGIS.MathUtils.geographicToCartesianCoord(lonlat[0], lonlat[1], ZeroGIS.EARTH_RADIUS + ele + levelDeltaR).getArray();
            vertices = vertices.concat(p); //顶点坐标
            textureCoords = textureCoords.concat(textureSs[j], textureTs[i]); //纹理坐标
        }
    }

    //从左上到右下填充indices
    //添加的点的顺序:左上->左下->右下->右上
    //0 1 2; 2 3 0;
    /*对于一个面从外面向里面看的绘制顺序
     * 0      3
     *
     * 1      2*/
    for (i = 0; i < this.segment; i++) {
        for (j = 0; j < this.segment; j++) {
            var idx0 = (this.segment + 1) * i + j;
            var idx1 = (this.segment + 1) * (i + 1) + j;
            var idx2 = idx1 + 1;
            var idx3 = idx0 + 1;
            indices = indices.concat(idx0, idx1, idx2); // 0 1 2
            indices = indices.concat(idx2, idx3, idx0); // 2 3 0
        }
    }

    //    if(changeElevation){
    //        //添加坐标原点的数据
    //        var originVertice = [0,0,0];
    //        var originTexture = [0,0];
    //        vertices = vertices.concat(originVertice);
    //        textureCoords = textureCoords.concat(originTexture);
    //
    //        var idxOrigin = (this.segment+1)*(this.segment+1);
    //        var idxLeftTop = 0;
    //        var idxRightTop = this.segment;
    //        var idxRightBottom = (this.segment+1)*(this.segment+1)-1;
    //        var idxLeftBottom = idxRightBottom - this.segment;
    //        indices = indices.concat(idxLeftTop,idxOrigin,idxLeftBottom);
    //        indices = indices.concat(idxRightTop,idxOrigin,idxLeftTop);
    //        indices = indices.concat(idxRightBottom,idxOrigin,idxRightTop);
    //        indices = indices.concat(idxLeftBottom,idxOrigin,idxRightBottom);
    //    }

    var infos = {
        vertices: vertices,
        indices: indices,
        textureCoords: textureCoords
    };
    this.setBuffers(infos);
};

//重写Object3D的destroy方法
ZeroGIS.Tile.prototype.destroy = function () {
    ZeroGIS.Object3D.prototype.destroy.apply(this, arguments);
    this.subTiledLayer = null;
};
