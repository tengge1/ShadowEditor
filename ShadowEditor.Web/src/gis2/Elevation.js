/**
* 海拔
*/
ZeroGIS.Elevation = {
    //sampleserver4.arcgisonline.com
    //23.21.85.73
    elevationUrl: "//sampleserver4.arcgisonline.com/ArcGIS/rest/services/Elevation/ESRI_Elevation_World/MapServer/exts/ElevationsSOE/ElevationLayers/1/GetElevationData",
    elevations: {}, //缓存的高程数据
    factor: 1 //高程缩放因子
};

//根据level获取包含level高程信息的ancestorElevationLevel
ZeroGIS.Elevation.getAncestorElevationLevel = function (level) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    var a = Math.floor((level - 1 - ZeroGIS.ELEVATION_LEVEL) / 3);
    var ancestor = ZeroGIS.ELEVATION_LEVEL + 3 * a;
    return ancestor;
};

/**
 * 根据传入的extent以及行列数请求高程数据，返回(segment+1) * (segment+1)个数据，且乘积不能超过10000
 * 也就是说如果传递的是一个正方形的extent，那么segment最大取99，此处设置的segment是80
 */
ZeroGIS.Elevation.requestElevationsByTileGrid = function (level, row, column) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    var segment = 80;
    var name = level + "_" + row + "_" + column;
    //只要elevations中有属性name，那么就表示该高程已经请求过或正在请求，这样就不要重新请求了
    //只有在完全没请求过的情况下去请求高程数据
    if (this.elevations.hasOwnProperty(name)) {
        return;
    }
    this.elevations[name] = null;
    var Eproj = ZeroGIS.MathUtils.getTileWebMercatorEnvelopeByGrid(level, row, column);
    var minX = Eproj.minX;
    var minY = Eproj.minY;
    var maxX = Eproj.maxX;
    var maxY = Eproj.maxY;
    var gridWidth = (maxX - minX) / segment;
    var gridHeight = (maxY - minY) / segment;
    var a = gridWidth / 2;
    var b = gridHeight / 2;
    var extent = {
        xmin: minX - a,
        ymin: minY - b,
        xmax: maxX + a,
        ymax: maxY + b,
        spatialReference: {
            wkid: 102100
        }
    };
    var strExtent = encodeURIComponent(JSON.stringify(extent));
    var rows = segment + 1;
    var columns = segment + 1;
    var f = "pjson";
    var args = "Extent=" + strExtent + "&Rows=" + rows + "&Columns=" + columns + "&f=" + f;
    var xhr = new XMLHttpRequest();

    function callback() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                var result = JSON.parse(xhr.responseText);
                if (this.factor == 1) {
                    this.elevations[name] = result.data;
                } else {
                    this.elevations[name] = ZeroGIS.Utils.map(function (item) {
                        return item * this.factor;
                    }.bind(this));
                }
            } catch (e) {
                console.error("requestElevationsByTileGrid_callback error", e);
            }
        }
    }
    xhr.onreadystatechange = callback.bind(this);
    xhr.open("GET", "proxy.jsp?" + this.elevationUrl + "?" + args, true);
    xhr.send();
};


//无论怎样都尽量返回高程值，如果存在精确的高程，就获取精确高程；如果精确高程不存在，就返回上一个高程级别的估算高程
//有可能
ZeroGIS.Elevation.getElevation = function (level, row, column) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    var result = null;
    var exactResult = this.getExactElevation(level, row, column);
    if (exactResult) {
        //获取到准确高程
        result = exactResult;
    } else {
        //获取插值高程
        result = this.getLinearElevation(level, row, column);
    }
    return result;
};

//把>=8级的任意一个切片的tileGrid传进去，返回其高程值，该高程值是经过过滤了的，就是从大切片数据中抽吸出了其自身的高程信息
//获取准确高程
ZeroGIS.Elevation.getExactElevation = function (level, row, column) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    var result = null;
    var elevationLevel = this.getAncestorElevationLevel(level);
    var elevationTileGrid = ZeroGIS.MathUtils.getTileGridAncestor(elevationLevel, level, row, column);
    var elevationTileName = elevationTileGrid.level + "_" + elevationTileGrid.row + "_" + elevationTileGrid.column;
    var ancestorElevations = this.elevations[elevationTileName];
    if (ancestorElevations instanceof Array && ancestorElevations.length > 0) {
        if (level > ZeroGIS.ELEVATION_LEVEL) {
            //ltTileGridLevel表示level级别下位于Tile7左上角的TileGrid
            var ltTileGridLevel = {
                level: elevationTileGrid.level,
                row: elevationTileGrid.row,
                column: elevationTileGrid.column
            }; //与level在同级别下但是在Tile7左上角的那个TileGrid
            while (ltTileGridLevel.level != level) {
                ltTileGridLevel = ZeroGIS.MathUtils.getTileGridByParent(ltTileGridLevel.level, ltTileGridLevel.row, ltTileGridLevel.column, ZeroGIS.MathUtils.LEFT_TOP);
            }
            if (ltTileGridLevel.level == level) {
                //bigRow表示在level等级下当前grid距离左上角的grid的行数
                var bigRow = row - ltTileGridLevel.row;
                //bigColumn表示在level等级下当前grid距离左上角的grid的列数
                var bigColumn = column - ltTileGridLevel.column;
                var a = 81; //T7包含(80+1)*(80+1)个高程数据
                var deltaLevel = (elevationLevel + 3) - level; //当前level与T10相差的等级
                var deltaCount = Math.pow(2, deltaLevel); //一个当前tile能包含deltaCount*deltaCount个第10级的tile
                //startSmallIndex表示该tile的左上角点在81*81的点阵中的索引号
                //bigRow*deltaCount表示当前切片距离T7最上面的切片的行包含了多少T10行，再乘以10表示跨过的高程点阵行数
                //bigColumn*deltaCount表示当前切片距离T7最左边的切片的列包含了多少T10列，再乘以10表示跨国的高程点阵列数
                var startSmallIndex = (bigRow * deltaCount * 10) * a + bigColumn * deltaCount * 10;
                result = {
                    sourceLevel: elevationLevel,
                    elevations: []
                };
                for (var i = 0; i <= 10; i++) {
                    var idx = startSmallIndex;
                    for (var j = 0; j <= 10; j++) {
                        var ele = ancestorElevations[idx];
                        result.elevations.push(ele);
                        idx += deltaCount;
                    }
                    //遍历完一行之后往下移，startSmallIndex表示一行的左边的起点
                    startSmallIndex += deltaCount * a;
                }
            }
        }
    }
    return result;
};

//获取线性插值的高程，比如要找E12的估算高程，那么就先找到E10的精确高程，E10的精确高程是从E7中提取的
//即E7(81*81)->E10(11*11)->插值计算E11、E12、E13
ZeroGIS.Elevation.getLinearElevation = function (level, row, column) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    var result = null;
    var elevationLevel = this.getAncestorElevationLevel(level);
    var elevationTileGrid = ZeroGIS.MathUtils.getTileGridAncestor(elevationLevel, level, row, column);
    var exactAncestorElevations = this.getExactElevation(elevationTileGrid.level, elevationTileGrid.row, elevationTileGrid.column);
    var deltaLevel = level - elevationLevel;
    if (exactAncestorElevations) {
        result = {
            sourceLevel: elevationLevel - 3,
            elevations: null
        };
        if (deltaLevel == 1) {
            result.elevations = this.getLinearElevationFromParent(exactAncestorElevations, level, row, column);
        } else if (deltaLevel == 2) {
            result.elevations = this.getLinearElevationFromParent2(exactAncestorElevations, level, row, column);
        } else if (deltaLevel == 3) {
            result.elevations = this.getLinearElevationFromParent3(exactAncestorElevations, level, row, column);
        }
    }
    return result;
};

//从直接父节点的高程数据中获取不是很准确的高程数据，比如T11从E10的高程中(10+1)*(10+1)中获取不是很准确的高程
//通过线性插值的方式获取高程，不精确
ZeroGIS.Elevation.getLinearElevationFromParent = function (parentElevations, level, row, column) {
    if (!(ZeroGIS.Utils.isArray(parentElevations) && parentElevations.length > 0)) {
        throw "invalid parentElevations";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    //position为切片在直接父切片中的位置
    var position = ZeroGIS.MathUtils.getTilePositionOfParent(level, row, column);
    //先从parent中获取6个半行的数据
    var elevatios6_6 = [];
    var startIndex = 0;
    if (position == ZeroGIS.MathUtils.LEFT_TOP) {
        startIndex = 0;
    } else if (position == ZeroGIS.MathUtils.RIGHT_TOP) {
        startIndex = 5;
    } else if (position == ZeroGIS.MathUtils.LEFT_BOTTOM) {
        startIndex = 11 * 5;
    } else if (position == ZeroGIS.MathUtils.RIGHT_BOTTOM) {
        startIndex = 60;
    }
    var i, j, idx;
    for (i = 0; i <= 5; i++) {
        idx = startIndex;
        for (j = 0; j <= 5; j++) {
            var ele = parentElevations[idx];
            elevatios6_6.push(ele);
            idx++;
        }
        //下移一行
        startIndex += 11;
    }
    //此时elevatios6_6表示的(5+1)*(5+1)的高程数据信息

    var eleExact, eleExactTop, eleLinear;
    //下面通过对每一行上的6个点数字两两取平均变成11个点数据
    var elevations6_11 = [];
    for (i = 0; i <= 5; i++) {
        for (j = 0; j <= 5; j++) {
            idx = 6 * i + j;
            eleExact = elevatios6_6[idx];
            if (j > 0) {
                eleExactLeft = elevatios6_6[idx - 1];
                eleLinear = (eleExactLeft + eleExact) / 2;
                elevations6_11.push(eleLinear);
            }
            elevations6_11.push(eleExact);
        }
    }
    //此时elevations6_11表示的是(5+1)*(10+1)的高程数据信息，对每行进行了线性插值

    //下面要对每列进行线性插值，使得每列上的6个点数字两两取平均变成11个点数据
    var elevations11_11 = [];
    for (i = 0; i <= 5; i++) {
        for (j = 0; j <= 10; j++) {
            idx = 11 * i + j;
            eleExact = elevations6_11[idx];
            if (i > 0) {
                eleExactTop = elevations6_11[idx - 11];
                eleLinear = (eleExactTop + eleExact) / 2;
                elevations11_11[(2 * i - 1) * 11 + j] = eleLinear;
            }
            elevations11_11[2 * i * 11 + j] = eleExact;
        }
    }
    //此时elevations11_11表示的是(10+1)*(10+1)的高程数据信息

    return elevations11_11;
};

//从相隔两级的高程中获取线性插值数据，比如从T10上面获取T12的高程数据
//parent2Elevations是(10+1)*(10+1)的高程数据
//level、row、column是子孙切片的信息
ZeroGIS.Elevation.getLinearElevationFromParent2 = function (parent2Elevations, level, row, column) {
    var parentTileGrid = ZeroGIS.MathUtils.getTileGridAncestor(level - 1, level, row, column);
    var parentElevations = this.getLinearElevationFromParent(parent2Elevations, parentTileGrid.level, parentTileGrid.row, parentTileGrid.column);
    var elevations = this.getLinearElevationFromParent(parentElevations, level, row, column);
    return elevations;
};

//从相隔三级的高程中获取线性插值数据，比如从T10上面获取T13的高程数据
//parent3Elevations是(10+1)*(10+1)的高程数据
//level、row、column是重孙切片的信息
ZeroGIS.Elevation.getLinearElevationFromParent3 = function (parent3Elevations, level, row, column) {
    var parentTileGrid = ZeroGIS.MathUtils.getTileGridAncestor(level - 1, level, row, column);
    var parentElevations = this.getLinearElevationFromParent2(parent3Elevations, parentTileGrid.level, parentTileGrid.row, parentTileGrid.column);
    var elevations = this.getLinearElevationFromParent(parentElevations, level, row, column);
    return elevations;
};
