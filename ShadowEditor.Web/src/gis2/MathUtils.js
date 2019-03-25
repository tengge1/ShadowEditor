/**
* GIS数学工具
*/
ZeroGIS.MathUtils = {
    ONE_RADIAN_EQUAL_DEGREE: 57.29577951308232, //180/Math.PI
    ONE_DEGREE_EQUAL_RADIAN: 0.017453292519943295, //Math.PI/180
    LEFT_TOP: "LEFT_TOP",
    RIGHT_TOP: "RIGHT_TOP",
    LEFT_BOTTOM: "LEFT_BOTTOM",
    RIGHT_BOTTOM: "RIGHT_BOTTOM",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    TOP: "TOP",
    BOTTOM: "BOTTOM"
};

ZeroGIS.MathUtils.isZero = function (value) {
    if (!ZeroGIS.Utils.isNumber(value)) {
        throw "invalid value";
    }
    return Math.abs(value) < 0.000001;
};

/**
 * 将其他进制的数字转换为10进制
 * @param numSys 要准换的进制
 * @param strNum 字符串形式的要转换的数据
 * @returns {number} 整数的十进制数据
 */
ZeroGIS.MathUtils.numerationSystemTo10 = function (numSys, strNum) {
    if (!ZeroGIS.Utils.isPositiveInteger(numSys)) {
        throw "invalid numSys";
    }
    if (!ZeroGIS.Utils.isString(strNum)) {
        throw "invalid strNum";
    }
    var sum = 0;
    for (var i = 0; i < strNum.length; i++) {
        var level = strNum.length - 1 - i;
        var key = parseInt(strNum[i]);
        sum += key * Math.pow(numSys, level);
    }
    return sum;
};

/**
 * 将10进制的数字转换为其他进制
 * @param numSys 要转换成的进制;
 * @param num 要转换的十进制数字
 * @returns {string} 字符串形式的其他进制的数据
 */
ZeroGIS.MathUtils.numerationSystemFrom10 = function (numSys, num) {
    if (!ZeroGIS.Utils.isPositiveInteger(numSys)) {
        throw "invalid numSys";
    }
    if (!ZeroGIS.Utils.isInteger(num)) {
        throw "invalid num";
    }
    var tempResultArray = [];
    var quotient = Math.floor(num / numSys);
    var remainder = num % numSys;
    tempResultArray.push(remainder);
    while (quotient !== 0) {
        num = quotient;
        quotient = Math.floor(num / numSys);
        remainder = num % numSys;
        tempResultArray.push(remainder);
    }
    tempResultArray.reverse();
    var strResult = tempResultArray.join("");
    return strResult;
};

/**
 * 将数据从一个进制转换到另一个进制，输入和输出都是字符串
 * @param numSysFrom
 * @param numSysTo
 * @param strNumFrom
 * @returns {string}
 */
ZeroGIS.MathUtils.numerationSystemChange = function (numSysFrom, numSysTo, strNumFrom) {
    if (!ZeroGIS.Utils.isPositiveInteger(numSysFrom)) {
        throw "invalid numSysFrom";
    }
    if (!ZeroGIS.Utils.isPositiveInteger(numSysTo)) {
        throw "invalid numSysTo";
    }
    if (!ZeroGIS.Utils.isString(strNumFrom)) {
        throw "invalid strNumFrom";
    }
    var temp10 = this.numerationSystemTo10(numSysFrom, strNumFrom);
    var strResult = this.numerationSystemFrom10(numSysTo, temp10);
    return strResult;
};

/**
 * 计算三角形的面积
 */
ZeroGIS.MathUtils.getTriangleArea = function (v1, v2, v3) {
    if (!(v1 instanceof ZeroGIS.Vertice)) {
        throw "invalid v1";
    }
    if (!(v2 instanceof ZeroGIS.Vertice)) {
        throw "invalid v2";
    }
    if (!(v3 instanceof ZeroGIS.Vertice)) {
        throw "invalid v3";
    }
    var v1Copy = v1.getCopy();
    var v2Copy = v2.getCopy();
    var v3Copy = v3.getCopy();
    var direction = v3Copy.minus(v2Copy);
    var line = new ZeroGIS.Line(v2Copy, direction);
    var h = this.getLengthFromVerticeToLine(v1Copy, line);
    var w = this.getLengthFromVerticeToVertice(v2Copy, v3Copy);
    var area = 0.5 * w * h;
    return area;
};

/**
 * 计算三维空间中两点之间的直线距离
 * @param vertice1
 * @param vertice2
 * @return {Number}
 */
ZeroGIS.MathUtils.getLengthFromVerticeToVertice = function (vertice1, vertice2) {
    if (!(vertice1 instanceof ZeroGIS.Vertice)) {
        throw "invalid vertice1";
    }
    if (!(vertice2 instanceof ZeroGIS.Vertice)) {
        throw "invalid vertice2";
    }
    var vertice1Copy = vertice1.getCopy();
    var vertice2Copy = vertice2.getCopy();
    var length2 = Math.pow(vertice1Copy.x - vertice2Copy.x, 2) + Math.pow(vertice1Copy.y - vertice2Copy.y, 2) + Math.pow(vertice1Copy.z - vertice2Copy.z, 2);
    var length = Math.sqrt(length2);
    return length;
};

/**
 * 已验证正确
 * 获取点到直线的距离
 * @param vertice 直线外一点
 * @param line 直线
 * @return {Number}
 */
ZeroGIS.MathUtils.getLengthFromVerticeToLine = function (vertice, line) {
    if (!(vertice instanceof Vertice)) {
        throw "invalid vertice";
    }
    if (!(line instanceof Line)) {
        throw "invalid line";
    }
    var verticeCopy = vertice.getCopy();
    var lineCopy = line.getCopy();
    var x0 = verticeCopy.x;
    var y0 = verticeCopy.y;
    var z0 = verticeCopy.z;
    var verticeOnLine = lineCopy.vertice;
    var x1 = verticeOnLine.x;
    var y1 = verticeOnLine.y;
    var z1 = verticeOnLine.z;
    var lineVector = lineCopy.vector;
    lineVector.normalize();
    var a = lineVector.x;
    var b = lineVector.y;
    var c = lineVector.z;
    var A = (y0 - y1) * c - b * (z0 - z1);
    var B = (z0 - z1) * a - c * (x0 - x1);
    var C = (x0 - x1) * b - a * (y0 - y1);
    return Math.sqrt(A * A + B * B + C * C);
};

/**
 * 已验证正确
 * 计算点到平面的距离，平面方程由Ax+By+Cz+D=0决定
 * @param vertice
 * @param plan 平面，包含A、B、C、D四个参数信息
 * @return {Number}
 */
ZeroGIS.MathUtils.getLengthFromVerticeToPlan = function (vertice, plan) {
    if (!(vertice instanceof Vertice)) {
        throw "invalid vertice";
    }
    if (!(plan instanceof Plan)) {
        throw "invalid plan";
    }
    var verticeCopy = vertice.getCopy();
    var planCopy = plan.getCopy();
    var x = verticeCopy.x;
    var y = verticeCopy.y;
    var z = verticeCopy.z;
    var A = planCopy.A;
    var B = planCopy.B;
    var C = planCopy.C;
    var D = planCopy.D;
    var numerator = Math.abs(A * x + B * y + C * z + D);
    var denominator = Math.sqrt(A * A + B * B + C * C);
    var length = numerator / denominator;
    return length;
};

/**
 * 已验证正确
 * 从vertice向平面plan做垂线，计算垂点坐标
 * @param vertice
 * @param plan
 * @return {Vertice}
 */
ZeroGIS.MathUtils.getVerticeVerticalIntersectPointWidthPlan = function (vertice, plan) {
    if (!(vertice instanceof ZeroGIS.Vertice)) {
        throw "invalid vertice";
    }
    if (!(plan instanceof Plan)) {
        throw "invalid plan";
    }
    var verticeCopy = vertice.getCopy();
    var planCopy = plan.getCopy();
    var x0 = verticeCopy.x;
    var y0 = verticeCopy.y;
    var z0 = verticeCopy.z;
    var normalVector = new ZeroGIS.Vector(planCopy.A, planCopy.B, planCopy.C);
    normalVector.normalize();
    var a = normalVector.x;
    var b = normalVector.y;
    var c = normalVector.z;
    var d = planCopy.D * a / planCopy.A;
    var k = -(a * x0 + b * y0 + c * z0 + d);
    var x = k * a + x0;
    var y = k * b + y0;
    var z = k * c + z0;
    var intersectVertice = new ZeroGIS.Vertice(x, y, z);
    return intersectVertice;
};

ZeroGIS.MathUtils.getIntersectPointByLineAdPlan = function (line, plan) {
    if (!(line instanceof ZeroGIS.Line)) {
        throw "invalid line";
    }
    if (!(plan instanceof ZeroGIS.Object3D.Plan)) {
        throw "invalid plan";
    }
    var lineCopy = line.getCopy();
    var planCopy = plan.getCopy();
    lineCopy.vector.normalize();
    var A = planCopy.A;
    var B = planCopy.B;
    var C = planCopy.C;
    var D = planCopy.D;
    var x0 = lineCopy.vertice.x;
    var y0 = lineCopy.vertice.y;
    var z0 = lineCopy.vertice.z;
    var a = lineCopy.vector.x;
    var b = lineCopy.vector.y;
    var c = lineCopy.vector.z;
    var k = -(A * x0 + B * y0 + C * z0 + D) / (A * a + B * b + C * c);
    var x = k * a + x0;
    var y = k * b + y0;
    var z = k * c + z0;
    var intersectVertice = new ZeroGIS.Vertice(x, y, z);
    return intersectVertice;
};

/**
 * 已验证正确
 * 计算某直线与地球的交点，有可能没有交点，有可能有一个交点，也有可能有两个交点
 * @param line 与地球求交的直线
 * @return {Array}
 */
ZeroGIS.MathUtils.getLineIntersectPointWithEarth = function (line) {
    if (!(line instanceof ZeroGIS.Line)) {
        throw "invalid line";
    }
    var result = [];
    var lineCopy = line.getCopy();
    var vertice = lineCopy.vertice;
    var direction = lineCopy.vector;
    direction.normalize();
    var r = ZeroGIS.EARTH_RADIUS;
    var a = direction.x;
    var b = direction.y;
    var c = direction.z;
    var x0 = vertice.x;
    var y0 = vertice.y;
    var z0 = vertice.z;
    var a2 = a * a;
    var b2 = b * b;
    var c2 = c * c;
    var r2 = r * r;
    var ay0 = a * y0;
    var az0 = a * z0;
    var bx0 = b * x0;
    var bz0 = b * z0;
    var cx0 = c * x0;
    var cy0 = c * y0;
    var deltaA = ay0 * bx0 + az0 * cx0 + bz0 * cy0;
    var deltaB = ay0 * ay0 + az0 * az0 + bx0 * bx0 + bz0 * bz0 + cx0 * cx0 + cy0 * cy0;
    var deltaC = a2 + b2 + c2;
    var delta = 8 * deltaA - 4 * deltaB + 4 * r2 * deltaC;
    if (delta < 0) {
        result = [];
    } else {
        var t = a * x0 + b * y0 + c * z0;
        var A = a2 + b2 + c2;
        if (delta === 0) {
            var k = -t / A;
            var x = k * a + x0;
            var y = k * b + y0;
            var z = k * c + z0;
            var p = new ZeroGIS.Vertice(x, y, z);
            result.push(p);
        } else if (delta > 0) {
            var sqrtDelta = Math.sqrt(delta);
            var k1 = (-2 * t + sqrtDelta) / (2 * A);
            var x1 = k1 * a + x0;
            var y1 = k1 * b + y0;
            var z1 = k1 * c + z0;
            var p1 = new ZeroGIS.Vertice(x1, y1, z1);
            result.push(p1);

            var k2 = (-2 * t - sqrtDelta) / (2 * A);
            var x2 = k2 * a + x0;
            var y2 = k2 * b + y0;
            var z2 = k2 * c + z0;
            var p2 = new ZeroGIS.Vertice(x2, y2, z2);
            result.push(p2);
        }
    }

    return result;
};

/**
 * 计算过P点且垂直于向量V的平面
 * @param vertice P点
 * @param direction 向量V
 * @return {Object} Plan 返回平面表达式中Ax+By+Cz+D=0的A、B、C、D的信息
 */
ZeroGIS.MathUtils.getCrossPlaneByLine = function (vertice, direction) {
    if (!(vertice instanceof ZeroGIS.Vertice)) {
        throw "invalid vertice";
    }
    if (!(direction instanceof ZeroGIS.Vector)) {
        throw "invalid direction";
    }
    var verticeCopy = vertice.getCopy();
    var directionCopy = direction.getCopy();
    directionCopy.normalize();
    var a = directionCopy.x;
    var b = directionCopy.y;
    var c = directionCopy.z;
    var x0 = verticeCopy.x;
    var y0 = verticeCopy.y;
    var z0 = verticeCopy.z;
    var d = -(a * x0 + b * y0 + c * z0);
    var plan = new Plan(a, b, c, d);
    return plan;
};

///////////////////////////////////////////////////////////////////////////////////////////
//点变换: Canvas->NDC
ZeroGIS.MathUtils.convertPointFromCanvasToNDC = function (canvasX, canvasY) {
    if (!(ZeroGIS.Utils.isNumber(canvasX))) {
        throw "invalid canvasX";
    }
    if (!(ZeroGIS.Utils.isNumber(canvasY))) {
        throw "invalid canvasY";
    }
    var ndcX = 2 * canvasX / ZeroGIS.canvas.width - 1;
    var ndcY = 1 - 2 * canvasY / ZeroGIS.canvas.height;
    return [ndcX, ndcY];
};

//点变换: NDC->Canvas
ZeroGIS.MathUtils.convertPointFromNdcToCanvas = function (ndcX, ndcY) {
    if (!(ZeroGIS.Utils.isNumber(ndcX))) {
        throw "invalid ndcX";
    }
    if (!(ZeroGIS.Utils.isNumber(ndcY))) {
        throw "invalid ndcY";
    }
    var canvasX = (1 + ndcX) * ZeroGIS.canvas.width / 2.0;
    var canvasY = (1 - ndcY) * ZeroGIS.canvas.height / 2.0;
    return [canvasX, canvasY];
};

/**
 * 根据层级计算出摄像机应该放置到距离地球表面多远的位置
 * @param level
 * @return {*}
 */
ZeroGIS.MathUtils.getLengthFromCamera2EarthSurface = function (level) {
    if (!(ZeroGIS.Utils.isNonNegativeInteger(level))) {
        throw "invalid level";
    }
    return 7820683 / Math.pow(2, level);
};

/**将经纬度转换为笛卡尔空间直角坐标系中的x、y、z
 * @lon 经度(角度单位)
 * @lat 纬度(角度单位)
 * @r optional 可选的地球半径
 * @p 笛卡尔坐标系中的坐标
 */
ZeroGIS.MathUtils.geographicToCartesianCoord = function (lon, lat, r) {
    if (!(ZeroGIS.Utils.isNumber(lon) && lon >= -(180 + 0.001) && lon <= (180 + 0.001))) {
        throw "invalid lon";
    }
    if (!(ZeroGIS.Utils.isNumber(lat) && lat >= -(90 + 0.001) && lat <= (90 + 0.001))) {
        throw "invalid lat";
    }
    r = r || ZeroGIS.EARTH_RADIUS;
    var radianLon = this.degreeToRadian(lon);
    var radianLat = this.degreeToRadian(lat);
    var sin1 = Math.sin(radianLon);
    var cos1 = Math.cos(radianLon);
    var sin2 = Math.sin(radianLat);
    var cos2 = Math.cos(radianLat);
    var x = r * sin1 * cos2;
    var y = r * sin2;
    var z = r * cos1 * cos2;
    return new ZeroGIS.Vertice(x, y, z);
};

/**
 * 将笛卡尔空间直角坐标系中的坐标转换为经纬度，以角度表示
 * @param vertice
 * @return {Array}
 */
ZeroGIS.MathUtils.cartesianCoordToGeographic = function (vertice) {
    if (!(vertice instanceof ZeroGIS.Vertice)) {
        throw "invalid vertice";
    }
    var verticeCopy = vertice.getCopy();
    var x = verticeCopy.x;
    var y = verticeCopy.y;
    var z = verticeCopy.z;
    var sin2 = y / ZeroGIS.EARTH_RADIUS;
    if (sin2 > 1) {
        sin2 = 2;
    } else if (sin2 < -1) {
        sin2 = -1;
    }
    var radianLat = Math.asin(sin2);
    var cos2 = Math.cos(radianLat);
    var sin1 = x / (ZeroGIS.EARTH_RADIUS * cos2);
    if (sin1 > 1) {
        sin1 = 1;
    } else if (sin1 < -1) {
        sin1 = -1;
    }
    var cos1 = z / (ZeroGIS.EARTH_RADIUS * cos2);
    if (cos1 > 1) {
        cos1 = 1;
    } else if (cos1 < -1) {
        cos1 = -1;
    }
    var radianLog = Math.asin(sin1);
    if (sin1 >= 0) { //经度在[0,π]
        if (cos1 >= 0) { //经度在[0,π/2]之间
            radianLog = radianLog;
        } else { //经度在[π/2，π]之间
            radianLog = Math.PI - radianLog;
        }
    } else { //经度在[-π,0]之间
        if (cos1 >= 0) { //经度在[-π/2,0]之间
            radianLog = radianLog;
        } else { //经度在[-π,-π/2]之间
            radianLog = -radianLog - Math.PI;
        }
    }
    var degreeLat = ZeroGIS.MathUtils.radianToDegree(radianLat);
    var degreeLog = ZeroGIS.MathUtils.radianToDegree(radianLog);
    return [degreeLog, degreeLat];
};

/**
 * 根据tile在父tile中的位置获取该tile的行列号等信息
 * @param parentLevel 父tile的层级
 * @param parentRow 父tile的行号
 * @param parentColumn 父tile的列号
 * @param position tile在父tile中的位置
 * @return {Object}
 */
ZeroGIS.MathUtils.getTileGridByParent = function (parentLevel, parentRow, parentColumn, position) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(parentLevel)) {
        throw "invalid parentLevel";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(parentRow)) {
        throw "invalid parentRow";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(parentColumn)) {
        throw "invalid parentColumn";
    }
    var level = parentLevel + 1;
    var row = -1;
    var column = -1;
    if (position == this.LEFT_TOP) {
        row = 2 * parentRow;
        column = 2 * parentColumn;
    } else if (position == this.RIGHT_TOP) {
        row = 2 * parentRow;
        column = 2 * parentColumn + 1;
    } else if (position == this.LEFT_BOTTOM) {
        row = 2 * parentRow + 1;
        column = 2 * parentColumn;
    } else if (position == this.RIGHT_BOTTOM) {
        row = 2 * parentRow + 1;
        column = 2 * parentColumn + 1;
    } else {
        throw "invalid position";
    }
    return new ZeroGIS.TileGrid(level, row, column);
};

//返回切片在直接付切片中的位置
ZeroGIS.MathUtils.getTilePositionOfParent = function (level, row, column, /*optional*/ parent) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    var position = "UNKNOWN";
    parent = parent || this.getTileGridAncestor(level - 1, level, row, column);
    var ltTileGrid = this.getTileGridByParent(parent.level, parent.row, parent.column, this.LEFT_TOP);
    if (ltTileGrid.row == row) {
        //上面那一行
        if (ltTileGrid.column == column) {
            //处于左上角
            position = this.LEFT_TOP;
        } else if (ltTileGrid.column + 1 == column) {
            //处于右上角
            position = this.RIGHT_TOP;
        }
    } else if (ltTileGrid.row + 1 == row) {
        //下面那一行
        if (ltTileGrid.column == column) {
            //处于左下角
            position = this.LEFT_BOTTOM;
        } else if (ltTileGrid.column + 1 == column) {
            //处于右下角
            position = this.RIGHT_BOTTOM;
        }
    }
    return position;
};

//获取在某一level周边position的切片
ZeroGIS.MathUtils.getTileGridByBrother = function (brotherLevel, brotherRow, brotherColumn, position, options) {
    if (!(ZeroGIS.Utils.isNonNegativeInteger(brotherLevel))) {
        throw "invalid brotherLevel";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(brotherRow))) {
        throw "invalid brotherRow";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(brotherColumn))) {
        throw "invalid brotherColumn";
    }

    options = options || {};
    var result = new ZeroGIS.TileGrid(brotherLevel, brotherRow, brotherColumn);
    var maxSize;

    //TODO maxSize可优化 该level下row/column的最大数量
    if (position == this.LEFT) {
        if (brotherColumn === 0) {
            maxSize = options.maxSize || Math.pow(2, brotherLevel);
            result.column = maxSize - 1;
        } else {
            result.column = brotherColumn - 1;
        }
    } else if (position == this.RIGHT) {
        maxSize = options.maxSize || Math.pow(2, brotherLevel);
        if (brotherColumn == maxSize - 1) {
            result.column = 0;
        } else {
            result.column = brotherColumn + 1;
        }
    } else if (position == this.TOP) {
        if (brotherRow === 0) {
            maxSize = options.maxSize || Math.pow(2, brotherLevel);
            result.row = maxSize - 1;
        } else {
            result.row = brotherRow - 1;
        }
    } else if (position == this.BOTTOM) {
        maxSize = options.maxSize || Math.pow(2, brotherLevel);
        if (brotherRow == maxSize - 1) {
            result.row = 0;
        } else {
            result.row = brotherRow + 1;
        }
    } else {
        throw "invalid position";
    }
    return result;
};

/**
 * 获取切片的祖先切片，
 * @param ancestorLevel 祖先切片的level
 * @param level 当前切片level
 * @param row 当前切片row
 * @param column 当前切片column
 * @returns {null}
 */
ZeroGIS.MathUtils.getTileGridAncestor = function (ancestorLevel, level, row, column) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(ancestorLevel)) {
        throw "invalid ancestorLevel";
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
    var result = null;
    if (ancestorLevel < level) {
        var deltaLevel = level - ancestorLevel;
        //ancestor能够包含a*a个当前切片
        var a = Math.pow(2, deltaLevel);
        var ancestorRow = Math.floor(row / a);
        var ancestorColumn = Math.floor(column / a);
        result = new ZeroGIS.TileGrid(ancestorLevel, ancestorRow, ancestorColumn);
    } else if (ancestorLevel == level) {
        result = new ZeroGIS.TileGrid(level, row, column);
    }
    return result;
};

ZeroGIS.MathUtils.getTileGridByGeo = function (lon, lat, level) {
    if (!(ZeroGIS.Utils.isNumber(lon) && lon >= -180 && lon <= 180)) {
        throw "invalid lon";
    }
    if (!(ZeroGIS.Utils.isNumber(lat) && lat >= -90 && lat <= 90)) {
        throw "invalid lat";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    var coordWebMercator = this.degreeGeographicToWebMercator(lon, lat);
    var x = coordWebMercator[0];
    var y = coordWebMercator[1];
    var horX = x + ZeroGIS.MAX_PROJECTED_COORD;
    var verY = ZeroGIS.MAX_PROJECTED_COORD - y;
    var size = ZeroGIS.MAX_PROJECTED_COORD / Math.pow(2, level - 1);
    var row = Math.floor(verY / size);
    var column = Math.floor(horX / size);
    return new ZeroGIS.TileGrid(level, row, column);
};

/**
 * 角度转弧度
 * @param degree
 * @return {*}
 */
ZeroGIS.MathUtils.degreeToRadian = function (degree) {
    if (!(ZeroGIS.Utils.isNumber(degree))) {
        throw "invalid degree";
    }
    return degree * this.ONE_DEGREE_EQUAL_RADIAN;
};

/**
 * 弧度转角度
 * @param radian
 * @return {*}
 */
ZeroGIS.MathUtils.radianToDegree = function (radian) {
    if (!(ZeroGIS.Utils.isNumber(radian))) {
        throw "invalid radian";
    }
    return radian * this.ONE_RADIAN_EQUAL_DEGREE;
};

/**
 * 将投影坐标x转换为以弧度表示的经度
 * @param x 投影坐标x
 * @return {Number} 返回的经度信息以弧度表示
 */
ZeroGIS.MathUtils.webMercatorXToRadianLog = function (x) {
    if (!(ZeroGIS.Utils.isNumber(x))) {
        throw "invalid x";
    }
    return x / ZeroGIS.EARTH_RADIUS;
};

/**
 * 将投影坐标x转换为以角度表示的经度
 * @param x 投影坐标x
 * @return {*} 返回的经度信息以角度表示
 */
ZeroGIS.MathUtils.webMercatorXToDegreeLog = function (x) {
    if (!(ZeroGIS.Utils.isNumber(x))) {
        throw "invalid x";
    }
    var radianLog = this.webMercatorXToRadianLog(x);
    return this.radianToDegree(radianLog);
};

/**
 * 将投影坐标y转换为以弧度表示的纬度
 * @param y 投影坐标y
 * @return {Number} 返回的纬度信息以弧度表示
 */
ZeroGIS.MathUtils.webMercatorYToRadianLat = function (y) {
    if (!(ZeroGIS.Utils.isNumber(y))) {
        throw "invalid y";
    }
    var a = y / ZeroGIS.EARTH_RADIUS;
    var b = Math.pow(Math.E, a);
    var c = Math.atan(b);
    var radianLat = 2 * c - Math.PI / 2;
    return radianLat;
};

/**
 * 将投影坐标y转换为以角度表示的纬度
 * @param y 投影坐标y
 * @return {*} 返回的纬度信息以角度表示
 */
ZeroGIS.MathUtils.webMercatorYToDegreeLat = function (y) {
    if (!(ZeroGIS.Utils.isNumber(y))) {
        throw "invalid y";
    }
    var radianLat = this.webMercatorYToRadianLat(y);
    return this.radianToDegree(radianLat);
};

/**
 * 将投影坐标x、y转换成以弧度表示的经纬度
 * @param x 投影坐标x
 * @param y 投影坐标y
 * @return {Array} 返回的经纬度信息以弧度表示
 */
ZeroGIS.MathUtils.webMercatorToRadianGeographic = function (x, y) {
    var radianLog = this.webMercatorXToRadianLog(x);
    var radianLat = this.webMercatorYToRadianLat(y);
    return [radianLog, radianLat];
};

/**
 * 将投影坐标x、y转换成以角度表示的经纬度
 * @param x 投影坐标x
 * @param y 投影坐标y
 * @return {Array} 返回的经纬度信息以角度表示
 */
ZeroGIS.MathUtils.webMercatorToDegreeGeographic = function (x, y) {
    var degreeLog = this.webMercatorXToDegreeLog(x);
    var degreeLat = this.webMercatorYToDegreeLat(y);
    return [degreeLog, degreeLat];
};

/**
 * 将以弧度表示的经度转换为投影坐标x
 * @param radianLog 以弧度表示的经度
 * @return {*} 投影坐标x
 */
ZeroGIS.MathUtils.radianLogToWebMercatorX = function (radianLog) {
    if (!(ZeroGIS.Utils.isNumber(radianLog) && radianLog <= (Math.PI + 0.001) && radianLog >= -(Math.PI + 0.001))) {
        throw "invalid radianLog";
    }
    return ZeroGIS.EARTH_RADIUS * radianLog;
};

/**
 * 将以角度表示的纬度转换为投影坐标y
 * @param degreeLog 以角度表示的经度
 * @return {*} 投影坐标x
 */
ZeroGIS.MathUtils.degreeLogToWebMercatorX = function (degreeLog) {
    if (!(ZeroGIS.Utils.isNumber(degreeLog) && degreeLog <= (180 + 0.001) && degreeLog >= -(180 + 0.001))) {
        throw "invalid degreeLog";
    }
    var radianLog = this.degreeToRadian(degreeLog);
    return this.radianLogToWebMercatorX(radianLog);
};

/**
 * 将以弧度表示的纬度转换为投影坐标y
 * @param radianLat 以弧度表示的纬度
 * @return {Number} 投影坐标y
 */
ZeroGIS.MathUtils.radianLatToWebMercatorY = function (radianLat) {
    if (!(ZeroGIS.Utils.isNumber(radianLat) && radianLat <= (Math.PI / 2 + 0.001) && radianLat >= -(Math.PI / 2 + 0.001))) {
        throw "invalid radianLat";
    }
    var a = Math.PI / 4 + radianLat / 2;
    var b = Math.tan(a);
    var c = Math.log(b);
    var y = ZeroGIS.EARTH_RADIUS * c;
    return y;
};

/**
 * 将以角度表示的纬度转换为投影坐标y
 * @param degreeLat 以角度表示的纬度
 * @return {Number} 投影坐标y
 */
ZeroGIS.MathUtils.degreeLatToWebMercatorY = function (degreeLat) {
    if (!(ZeroGIS.Utils.isNumber(degreeLat) && degreeLat <= (90 + 0.001) && degreeLat >= -(90 + 0.001))) {
        throw "invalid degreeLat";
    }
    var radianLat = this.degreeToRadian(degreeLat);
    return this.radianLatToWebMercatorY(radianLat);
};

/**
 * 将以弧度表示的经纬度转换为投影坐标
 * @param radianLog 以弧度表示的经度
 * @param radianLat 以弧度表示的纬度
 * @return {Array}  投影坐标x、y
 */
ZeroGIS.MathUtils.radianGeographicToWebMercator = function (radianLog, radianLat) {
    var x = this.radianLogToWebMercatorX(radianLog);
    var y = this.radianLatToWebMercatorY(radianLat);
    return [x, y];
};

/**
 * 将以角度表示的经纬度转换为投影坐标
 * @param degreeLog 以角度表示的经度
 * @param degreeLat 以角度表示的纬度
 * @return {Array}
 */
ZeroGIS.MathUtils.degreeGeographicToWebMercator = function (degreeLog, degreeLat) {
    var x = this.degreeLogToWebMercatorX(degreeLog);
    var y = this.degreeLatToWebMercatorY(degreeLat);
    return [x, y];
};

//根据切片的level、row、column计算该切片所覆盖的投影区域的范围
ZeroGIS.MathUtils.getTileWebMercatorEnvelopeByGrid = function (level, row, column) {
    if (!(ZeroGIS.Utils.isNonNegativeInteger(level))) {
        throw "invalid level";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(row))) {
        throw "invalid row";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(column))) {
        throw "invalid column";
    }
    var k = ZeroGIS.MAX_PROJECTED_COORD;
    var size = 2 * k / Math.pow(2, level);
    var minX = -k + column * size;
    var maxX = minX + size;
    var maxY = k - row * size;
    var minY = maxY - size;
    var Eproj = {
        "minX": minX,
        "minY": minY,
        "maxX": maxX,
        "maxY": maxY
    };
    return Eproj;
};

//根据切片的level、row、column计算该切片所覆盖的经纬度区域的范围,以经纬度表示返回结果
ZeroGIS.MathUtils.getTileGeographicEnvelopByGrid = function (level, row, column) {
    if (!(ZeroGIS.Utils.isNonNegativeInteger(level))) {
        throw "invalid level";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(row))) {
        throw "invalid row";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(column))) {
        throw "invalid column";
    }
    var Eproj = this.getTileWebMercatorEnvelopeByGrid(level, row, column);
    var pMin = this.webMercatorToDegreeGeographic(Eproj.minX, Eproj.minY);
    var pMax = this.webMercatorToDegreeGeographic(Eproj.maxX, Eproj.maxY);
    var Egeo = {
        "minLon": pMin[0],
        "minLat": pMin[1],
        "maxLon": pMax[0],
        "maxLat": pMax[1]
    };
    return Egeo;
};

//根据切片的level、row、column计算该切片所覆盖的笛卡尔空间直角坐标系的范围,以x、y、z表示返回结果
ZeroGIS.MathUtils.getTileCartesianEnvelopByGrid = function (level, row, column) {
    if (!(ZeroGIS.Utils.isNonNegativeInteger(level))) {
        throw "invalid level";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(row))) {
        throw "invalid row";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(column))) {
        throw "invalid column";
    }
    var Egeo = this.getTileGeographicEnvelopByGrid(level, row, column);
    var minLon = Egeo.minLon;
    var minLat = Egeo.minLat;
    var maxLon = Egeo.maxLon;
    var maxLat = Egeo.maxLat;
    var pLeftBottom = this.geographicToCartesianCoord(minLon, minLat);
    var pLeftTop = this.geographicToCartesianCoord(minLon, maxLat);
    var pRightTop = this.geographicToCartesianCoord(maxLon, maxLat);
    var pRightBottom = this.geographicToCartesianCoord(maxLon, minLat);
    var Ecar = {
        "pLeftBottom": pLeftBottom,
        "pLeftTop": pLeftTop,
        "pRightTop": pRightTop,
        "pRightBottom": pRightBottom,
        "minLon": minLon,
        "minLat": minLat,
        "maxLon": maxLon,
        "maxLat": maxLat
    };
    return Ecar;
};

/**
 * 获取切片的中心点，以经纬度数组形式返回
 * @param level
 * @param row
 * @param column
 * @return {Array}
 */
ZeroGIS.MathUtils.getGeographicTileCenter = function (level, row, column) {
    if (!(ZeroGIS.Utils.isNonNegativeInteger(level))) {
        throw "invalid level";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(row))) {
        throw "invalid row";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(column))) {
        throw "invalid column";
    }
    var Egeo = this.getTileGeographicEnvelopByGrid(level, row, column);
    var minLon = Egeo.minLon;
    var minLat = Egeo.minLat;
    var maxLon = Egeo.maxLon;
    var maxLat = Egeo.maxLat;
    var centerLon = (minLon + maxLon) / 2; //切片的经度中心
    var centerLat = (minLat + maxLat) / 2; //切片的纬度中心
    var lonlatTileCenter = [centerLon, centerLat];
    return lonlatTileCenter;
};

ZeroGIS.MathUtils.getCartesianTileCenter = function (level, row, column) {
    if (!(ZeroGIS.Utils.isNonNegativeInteger(level))) {
        throw "invalid level";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(row))) {
        throw "invalid row";
    }
    if (!(ZeroGIS.Utils.isNonNegativeInteger(column))) {
        throw "invalid column";
    }
    var lonLat = this.getGeographicTileCenter(level, row, column);
    var vertice = this.geographicToCartesianCoord(lonLat[0], lonLat[1]);
    return vertice;
};

/**
 * 计算TRIANGLES的平均法向量
 * @param vs 传入的顶点坐标数组 array
 * @param ind 传入的顶点的索引数组 array
 * @return {Array} 返回每个顶点的平均法向量的数组
 */
ZeroGIS.MathUtils.calculateNormals = function (vs, ind) {
    if (!ZeroGIS.Utils.isArray(vs)) {
        throw "invalid vs";
    }
    if (!ZeroGIS.Utils.isArray(ind)) {
        throw "invalid ind";
    }
    var x = 0;
    var y = 1;
    var z = 2;
    var ns = [];
    var i;
    //对于每个vertex，初始化normal x, normal y, normal z
    for (i = 0; i < vs.length; i = i + 3) {
        ns[i + x] = 0.0;
        ns[i + y] = 0.0;
        ns[i + z] = 0.0;
    }

    //用三元组vertices计算向量,所以i = i+3,i表示索引
    for (i = 0; i < ind.length; i = i + 3) {
        var v1 = [];
        var v2 = [];
        var normal = [];
        //p2 - p1,得到向量Vp1p2
        v1[x] = vs[3 * ind[i + 2] + x] - vs[3 * ind[i + 1] + x];
        v1[y] = vs[3 * ind[i + 2] + y] - vs[3 * ind[i + 1] + y];
        v1[z] = vs[3 * ind[i + 2] + z] - vs[3 * ind[i + 1] + z];
        //p0 - p1,得到向量Vp0p1
        v2[x] = vs[3 * ind[i] + x] - vs[3 * ind[i + 1] + x];
        v2[y] = vs[3 * ind[i] + y] - vs[3 * ind[i + 1] + y];
        v2[z] = vs[3 * ind[i] + z] - vs[3 * ind[i + 1] + z];
        //两个向量叉乘得到三角形的法线向量，注意三角形的正向都是逆时针方向，此处要注意两个向量相乘的顺序，要保证法线向量是从背面指向正面的
        normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
        normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
        normal[z] = v1[x] * v2[y] - v1[y] * v2[x];
        //更新三角形的法线向量：向量的和
        for (var j = 0; j < 3; j++) {
            ns[3 * ind[i + j] + x] = ns[3 * ind[i + j] + x] + normal[x];
            ns[3 * ind[i + j] + y] = ns[3 * ind[i + j] + y] + normal[y];
            ns[3 * ind[i + j] + z] = ns[3 * ind[i + j] + z] + normal[z];
        }
    }
    //对法线向量进行归一化
    for (i = 0; i < vs.length; i = i + 3) {
        var nn = [];
        nn[x] = ns[i + x];
        nn[y] = ns[i + y];
        nn[z] = ns[i + z];

        var len = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
        if (len === 0) len = 1.0;

        nn[x] = nn[x] / len;
        nn[y] = nn[y] / len;
        nn[z] = nn[z] / len;

        ns[i + x] = nn[x];
        ns[i + y] = nn[y];
        ns[i + z] = nn[z];
    }

    return ns;
};