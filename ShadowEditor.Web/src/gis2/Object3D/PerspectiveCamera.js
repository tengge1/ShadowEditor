/**
* 透视相机
*/
ZeroGIS.PerspectiveCamera = function (fov, aspect, near, far) {
    fov = fov !== undefined ? fov : 90;
    aspect = aspect !== undefined ? aspect : 1;
    near = near !== undefined ? near : 1;
    far = far !== undefined ? far : 1;
    if (!ZeroGIS.Utils.isNumber(fov)) {
        throw "invalid fov: not number";
    }
    if (!ZeroGIS.Utils.isNumber(aspect)) {
        throw "invalid aspect: not number";
    }
    if (!ZeroGIS.Utils.isNumber(near)) {
        throw "invalid near: not number";
    }
    if (!ZeroGIS.Utils.isNumber(far)) {
        throw "invalid far: not number";
    }
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    ZeroGIS.Object3D.apply(this, null);
    this.pitch = 90;
    this.projMatrix = new ZeroGIS.Matrix();
    this.setPerspectiveMatrix(this.fov, this.aspect, this.near, this.far);
};

ZeroGIS.PerspectiveCamera.prototype = new ZeroGIS.Object3D();
ZeroGIS.PerspectiveCamera.prototype.constructor = ZeroGIS.PerspectiveCamera;

ZeroGIS.PerspectiveCamera.prototype.Enum = {
    EARTH_FULL_OVERSPREAD_SCREEN: "EARTH_FULL_OVERSPREAD_SCREEN", //Canvas内全部被地球充满
    EARTH_NOT_FULL_OVERSPREAD_SCREEN: "EARTH_NOT_FULL_OVERSPREAD_SCREEN" //Canvas没有全部被地球充满
};

ZeroGIS.PerspectiveCamera.prototype.setPerspectiveMatrix = function (fov, aspect, near, far) {
    fov = fov !== undefined ? fov : 90;
    aspect = aspect !== undefined ? aspect : 1;
    near = near !== undefined ? near : 1;
    far = far !== undefined ? far : 1;
    if (!ZeroGIS.Utils.isNumber(fov)) {
        throw "invalid fov: not number";
    }
    if (!ZeroGIS.Utils.isNumber(aspect)) {
        throw "invalid aspect: not number";
    }
    if (!ZeroGIS.Utils.isNumber(near)) {
        throw "invalid near: not number";
    }
    if (!ZeroGIS.Utils.isNumber(far)) {
        throw "invalid far: not number";
    }
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    var mat = [1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
    var halfFov = this.fov * Math.PI / 180 / 2;
    var a = 1 / Math.tan(halfFov);
    var b = this.far - this.near;

    mat[0] = a / this.aspect;
    mat[5] = a;
    mat[10] = -(this.far + this.near) / b;
    mat[11] = -1;
    mat[14] = -2 * this.near * this.far / b;
    mat[15] = 0;

    //by comparision with matrixProjection.exe and glMatrix,
    //the 11th element is always -1
    this.projMatrix.setElements(mat[0], mat[1], mat[2], mat[3],
      mat[4], mat[5], mat[6], mat[7],
      mat[8], mat[9], mat[10], mat[11],
      mat[12], mat[13], mat[14], mat[15]);
};

ZeroGIS.PerspectiveCamera.prototype.getLightDirection = function () {
    var dirVertice = this.matrix.getColumnZ();
    var direction = new ZeroGIS.Vector(-dirVertice.x, -dirVertice.y, -dirVertice.z);
    direction.normalize();
    return direction;
};

//获取投影矩阵与视点矩阵的乘积
ZeroGIS.PerspectiveCamera.prototype.getProjViewMatrix = function () {
    var viewMatrix = this.getViewMatrix();
    var projViewMatrix = this.projMatrix.multiplyMatrix(viewMatrix);
    return projViewMatrix;
};

ZeroGIS.PerspectiveCamera.prototype.setFov = function (fov) {
    if (!ZeroGIS.Utils.isPositive(fov)) {
        throw "invalid fov";
    }
    this.setPerspectiveMatrix(fov, this.aspect, this.near, this.far);
};

ZeroGIS.PerspectiveCamera.prototype.setAspect = function (aspect) {
    if (!ZeroGIS.Utils.isPositive(aspect)) {
        throw "invalid aspect";
    }
    this.setPerspectiveMatrix(this.fov, aspect, this.near, this.far);
};

ZeroGIS.PerspectiveCamera.prototype.setNear = function (near) {
    if (!ZeroGIS.Utils.isPositive(near)) {
        throw "invalid near";
    }
    this.setPerspectiveMatrix(this.fov, this.aspect, near, this.far);
};

ZeroGIS.PerspectiveCamera.prototype.setFar = function (far) {
    if (!ZeroGIS.Utils.isPositive(far)) {
        throw "invalid far";
    }
    this.setPerspectiveMatrix(this.fov, this.aspect, this.near, far);
};

ZeroGIS.PerspectiveCamera.prototype.getViewMatrix = function () {
    //视点矩阵是camera的模型矩阵的逆矩阵
    return this.matrix.getInverseMatrix();
};

ZeroGIS.PerspectiveCamera.prototype.look = function (cameraPnt, targetPnt, upDirection) {
    if (!(cameraPnt instanceof ZeroGIS.Vertice)) {
        throw "invalid cameraPnt: not Vertice";
    }
    if (!(targetPnt instanceof ZeroGIS.Vertice)) {
        throw "invalid targetPnt: not Vertice";
    }
    upDirection = upDirection !== undefined ? upDirection : new ZeroGIS.Vector(0, 1, 0);
    if (!(upDirection instanceof ZeroGIS.Vector)) {
        throw "invalid upDirection: not Vector";
    }
    var cameraPntCopy = cameraPnt.getCopy();
    var targetPntCopy = targetPnt.getCopy();
    var up = upDirection.getCopy();
    var transX = cameraPntCopy.x;
    var transY = cameraPntCopy.y;
    var transZ = cameraPntCopy.z;
    var zAxis = new ZeroGIS.Vector(cameraPntCopy.x - targetPntCopy.x, cameraPntCopy.y - targetPntCopy.y, cameraPntCopy.z - targetPntCopy.z).normalize();
    var xAxis = up.cross(zAxis).normalize();
    var yAxis = zAxis.cross(xAxis).normalize();

    this.matrix.setColumnX(xAxis.x, xAxis.y, xAxis.z); //此处相当于对Camera的模型矩阵(不是视点矩阵)设置X轴方向
    this.matrix.setColumnY(yAxis.x, yAxis.y, yAxis.z); //此处相当于对Camera的模型矩阵(不是视点矩阵)设置Y轴方向
    this.matrix.setColumnZ(zAxis.x, zAxis.y, zAxis.z); //此处相当于对Camera的模型矩阵(不是视点矩阵)设置Z轴方向
    this.matrix.setColumnTrans(transX, transY, transZ); //此处相当于对Camera的模型矩阵(不是视点矩阵)设置偏移量
    this.matrix.setLastRowDefault();

    var deltaX = cameraPntCopy.x - targetPntCopy.x;
    var deltaY = cameraPntCopy.y - targetPntCopy.y;
    var deltaZ = cameraPntCopy.z - targetPntCopy.z;
    var far = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
    this.setFar(far);
};

ZeroGIS.PerspectiveCamera.prototype.lookAt = function (targetPnt, upDirection) {
    if (!(targetPnt instanceof ZeroGIS.Vertice)) {
        throw "invalid targetPnt: not Vertice";
    }
    upDirection = upDirection !== undefined ? upDirection : new ZeroGIS.Vector(0, 1, 0);
    if (!(upDirection instanceof ZeroGIS.Vector)) {
        throw "invalid upDirection: not Vector";
    }
    var targetPntCopy = targetPnt.getCopy();
    var upDirectionCopy = upDirection.getCopy();
    var position = this.getPosition();
    this.look(position, targetPntCopy, upDirectionCopy);
};

//点变换: World->NDC
ZeroGIS.PerspectiveCamera.prototype.convertVerticeFromWorldToNDC = function (verticeInWorld, /*optional*/ projViewMatrix) {
    if (!(verticeInWorld instanceof ZeroGIS.Vertice)) {
        throw "invalid verticeInWorld: not Vertice";
    }
    if (!(projViewMatrix instanceof ZeroGIS.Matrix)) {
        projViewMatrix = this.getProjViewMatrix();
    }
    var columnWorld = [verticeInWorld.x, verticeInWorld.y, verticeInWorld.z, 1];
    var columnProject = projViewMatrix.multiplyColumn(columnWorld);
    var w = columnProject[3];
    var columnNDC = [];
    columnNDC[0] = columnProject[0] / w;
    columnNDC[1] = columnProject[1] / w;
    columnNDC[2] = columnProject[2] / w;
    columnNDC[3] = 1;
    var verticeInNDC = new ZeroGIS.Vertice(columnNDC[0], columnNDC[1], columnNDC[2]);
    return verticeInNDC;
};

//点变换: NDC->World
ZeroGIS.PerspectiveCamera.prototype.convertVerticeFromNdcToWorld = function (verticeInNDC) {
    if (!(verticeInNDC instanceof ZeroGIS.Vertice)) {
        throw "invalid verticeInNDC: not Vertice";
    }
    var columnNDC = [verticeInNDC.x, verticeInNDC.y, verticeInNDC.z, 1]; //NDC归一化坐标
    var inverseProj = this.projMatrix.getInverseMatrix(); //投影矩阵的逆矩阵
    var columnCameraTemp = inverseProj.multiplyColumn(columnNDC); //带引号的“视坐标”
    var cameraX = columnCameraTemp[0] / columnCameraTemp[3];
    var cameraY = columnCameraTemp[1] / columnCameraTemp[3];
    var cameraZ = columnCameraTemp[2] / columnCameraTemp[3];
    var cameraW = 1;
    var columnCamera = [cameraX, cameraY, cameraZ, cameraW]; //真实的视坐标

    var viewMatrix = this.getViewMatrix();
    var inverseView = viewMatrix.getInverseMatrix(); //视点矩阵的逆矩阵
    var columnWorld = inverseView.multiplyColumn(columnCamera); //单击点的世界坐标
    var verticeInWorld = new ZeroGIS.Vertice(columnWorld[0], columnWorld[1], columnWorld[2]);
    return verticeInWorld;
};

//点变换: Camera->World
ZeroGIS.PerspectiveCamera.prototype.convertVerticeFromCameraToWorld = function (verticeInCamera, /*optional*/ viewMatrix) {
    if (!(verticeInCamera instanceof ZeroGIS.Vertice)) {
        throw "invalid verticeInCamera: not Vertice";
    }
    if (!(viewMatrix instanceof ZeroGIS.Matrix)) {
        viewMatrix = this.getViewMatrix();
    }
    var verticeInCameraCopy = verticeInCamera.getCopy();
    var inverseMatrix = viewMatrix.getInverseMatrix();
    var column = [verticeInCameraCopy.x, verticeInCameraCopy.y, verticeInCameraCopy.z, 1];
    var column2 = inverseMatrix.multiplyColumn(column);
    var verticeInWorld = new ZeroGIS.Vertice(column2[0], column2[1], column2[2]);
    return verticeInWorld;
};

//向量变换: Camera->World
ZeroGIS.PerspectiveCamera.prototype.convertVectorFromCameraToWorld = function (vectorInCamera, /*optional*/ viewMatrix) {
    if (!(vectorInCamera instanceof ZeroGIS.Vector)) {
        throw "invalid vectorInCamera: not Vector";
    }
    if (!(viewMatrix instanceof ZeroGIS.Matrix)) {
        viewMatrix = this.getViewMatrix();
    }
    var vectorInCameraCopy = vectorInCamera.getCopy();
    var verticeInCamera = vectorInCameraCopy.getVertice();
    var verticeInWorld = this.convertVerticeFromCameraToWorld(verticeInCamera, viewMatrix);
    var originInWorld = this.getPosition();
    var vectorInWorld = verticeInWorld.minus(originInWorld);
    vectorInWorld.normalize();
    return vectorInWorld;
};

//根据canvasX和canvasY获取拾取向量
ZeroGIS.PerspectiveCamera.prototype.getPickDirectionByCanvas = function (canvasX, canvasY) {
    if (!ZeroGIS.Utils.isNumber(canvasX)) {
        throw "invalid canvasX: not number";
    }
    if (!ZeroGIS.Utils.isNumber(canvasY)) {
        throw "invalid canvasY: not number";
    }
    var ndcXY = ZeroGIS.MathUtils.convertPointFromCanvasToNDC(canvasX, canvasY);
    var pickDirection = this.getPickDirectionByNDC(ndcXY[0], ndcXY[1]);
    return pickDirection;
};

//获取当前视线与地球的交点
ZeroGIS.PerspectiveCamera.prototype.getDirectionIntersectPointWithEarth = function () {
    var dir = this.getLightDirection();
    var p = this.getPosition();
    var line = new ZeroGIS.Line(p, dir);
    var result = this.getPickCartesianCoordInEarthByLine(line);
    return result;
};

//根据ndcX和ndcY获取拾取向量
ZeroGIS.PerspectiveCamera.prototype.getPickDirectionByNDC = function (ndcX, ndcY) {
    if (!ZeroGIS.Utils.isNumber(ndcX)) {
        throw "invalid ndcX: not number";
    }
    if (!ZeroGIS.Utils.isNumber(ndcY)) {
        throw "invalid ndcY: not number";
    }
    var verticeInNDC = new ZeroGIS.Vertice(ndcX, ndcY, 0.499);
    var verticeInWorld = this.convertVerticeFromNdcToWorld(verticeInNDC);
    var cameraPositon = this.getPosition(); //摄像机的世界坐标
    var pickDirection = verticeInWorld.minus(cameraPositon);
    pickDirection.normalize();
    return pickDirection;
};

//获取直线与地球的交点，该方法与World.Math.getLineIntersectPointWithEarth功能基本一样，只不过该方法对相交点进行了远近排序
ZeroGIS.PerspectiveCamera.prototype.getPickCartesianCoordInEarthByLine = function (line) {
    if (!(line instanceof ZeroGIS.Line)) {
        throw "invalid line: not Line";
    }
    var result = [];
    //pickVertice是笛卡尔空间直角坐标系中的坐标
    var pickVertices = ZeroGIS.MathUtils.getLineIntersectPointWithEarth(line);
    if (pickVertices.length === 0) {
        //没有交点
        result = [];
    } else if (pickVertices.length == 1) {
        //一个交点
        result = pickVertices;
    } else if (pickVertices.length == 2) {
        //两个交点
        var pickVerticeA = pickVertices[0];
        var pickVerticeB = pickVertices[1];
        var cameraVertice = this.getPosition();
        var lengthA = ZeroGIS.MathUtils.getLengthFromVerticeToVertice(cameraVertice, pickVerticeA);
        var lengthB = ZeroGIS.MathUtils.getLengthFromVerticeToVertice(cameraVertice, pickVerticeB);
        //将距离人眼更近的那个点放到前面
        result = lengthA <= lengthB ? [pickVerticeA, pickVerticeB] : [pickVerticeB, pickVerticeA];
    }
    return result;
};

//计算拾取射线与地球的交点，以笛卡尔空间直角坐标系坐标组的组的形式返回
ZeroGIS.PerspectiveCamera.prototype.getPickCartesianCoordInEarthByCanvas = function (canvasX, canvasY, options) {
    if (!ZeroGIS.Utils.isNumber(canvasX)) {
        throw "invalid canvasX: not number";
    }
    if (!ZeroGIS.Utils.isNumber(canvasY)) {
        throw "invalid canvasY: not number";
    }
    var pickDirection = this.getPickDirectionByCanvas(canvasX, canvasY);
    var p = this.getPosition();
    var line = new ZeroGIS.Line(p, pickDirection);
    var result = this.getPickCartesianCoordInEarthByLine(line);
    return result;
};

ZeroGIS.PerspectiveCamera.prototype.getPickCartesianCoordInEarthByNDC = function (ndcX, ndcY) {
    if (!ZeroGIS.Utils.isNumber(ndcX)) {
        throw "invalid ndcX: not number";
    }
    if (!ZeroGIS.Utils.isNumber(ndcY)) {
        throw "invalid ndcY: not number";
    }
    var pickDirection = this.getPickDirectionByNDC(ndcX, ndcY);
    var p = this.getPosition();
    var line = new ZeroGIS.Line(p, pickDirection);
    var result = this.getPickCartesianCoordInEarthByLine(line);
    return result;
};

//得到摄像机的XOZ平面的方程
ZeroGIS.PerspectiveCamera.prototype.getPlanXOZ = function () {
    var position = this.getPosition();
    var direction = this.getLightDirection();
    var plan = ZeroGIS.MathUtils.getCrossPlaneByLine(position, direction);
    return plan;
};

//设置观察到的层级
ZeroGIS.PerspectiveCamera.prototype.setLevel = function (level) {
    if (!ZeroGIS.Utils.isInteger(level)) {
        throw "invalid level";
    }
    if (level < 0) {
        return;
    }
    var pOld = this.getPosition();
    if (pOld.x === 0 && pOld.y === 0 && pOld.z === 0) {
        //初始设置camera
        var length = ZeroGIS.MathUtils.getLengthFromCamera2EarthSurface(level) + ZeroGIS.EARTH_RADIUS; //level等级下摄像机应该到球心的距离
        var origin = new ZeroGIS.Vertice(0, 0, 0);
        var vector = this.getLightDirection().getOpposite();
        vector.setLength(length);
        var newPosition = vector.getVertice();
        this.look(newPosition, origin);
    } else {
        var length2SurfaceNow = ZeroGIS.MathUtils.getLengthFromCamera2EarthSurface(ZeroGIS.globe.CURRENT_LEVEL);
        var length2Surface = ZeroGIS.MathUtils.getLengthFromCamera2EarthSurface(level);
        var deltaLength = length2SurfaceNow - length2Surface;
        var dir = this.getLightDirection();
        dir.setLength(deltaLength);
        var pNew = pOld.plus(dir);
        this.setPosition(pNew.x, pNew.y, pNew.z);
    }
    ZeroGIS.globe.CURRENT_LEVEL = level;
};

//判断世界坐标系中的点是否在Canvas中可见
//options:projView、verticeInNDC
ZeroGIS.PerspectiveCamera.prototype.isWorldVerticeVisibleInCanvas = function (verticeInWorld, options) {
    if (!(verticeInWorld instanceof ZeroGIS.Vertice)) {
        throw "invalid verticeInWorld: not Vertice";
    }
    options = options || {};
    var threshold = typeof options.threshold == "number" ? Math.abs(options.threshold) : 1;
    var cameraP = this.getPosition();
    var dir = verticeInWorld.minus(cameraP);
    var line = new ZeroGIS.Line(cameraP, dir);
    var pickResult = this.getPickCartesianCoordInEarthByLine(line);
    if (pickResult.length > 0) {
        var pickVertice = pickResult[0];
        var length2Vertice = ZeroGIS.MathUtils.getLengthFromVerticeToVertice(cameraP, verticeInWorld);
        var length2Pick = ZeroGIS.MathUtils.getLengthFromVerticeToVertice(cameraP, pickVertice);
        if (length2Vertice < length2Pick + 5) {
            if (!(options.verticeInNDC instanceof ZeroGIS.Vertice)) {
                if (!(options.projView instanceof ZeroGIS.Matrix)) {
                    options.projView = this.getProjViewMatrix();
                }
                options.verticeInNDC = this.convertVerticeFromWorldToNDC(verticeInWorld, options.projView);
            }
            var result = options.verticeInNDC.x >= -1 && options.verticeInNDC.x <= 1 && options.verticeInNDC.y >= -threshold && options.verticeInNDC.y <= 1;
            return result;
        }
    }
    return false;
};

//判断地球表面的某个经纬度在Canvas中是否应该可见
//options:projView、verticeInNDC
ZeroGIS.PerspectiveCamera.prototype.isGeoVisibleInCanvas = function (lon, lat, options) {
    var verticeInWorld = ZeroGIS.MathUtils.geographicToCartesianCoord(lon, lat);
    var result = this.isWorldVerticeVisibleInCanvas(verticeInWorld, options);
    return result;
};


/**
 * 算法，一个切片需要渲染需要满足如下三个条件:
 * 1.至少要有一个点在Canvas中可见
 * 2.NDC面积足够大
 * 3.形成的NDC四边形是顺时针方向
 */
//获取level层级下的可见切片
//options:projView
ZeroGIS.PerspectiveCamera.prototype.getVisibleTilesByLevel = function (level, options) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    var result = [];
    options = options || {};
    if (!(options.projView instanceof ZeroGIS.Matrix)) {
        options.projView = this.getProjViewMatrix();
    }
    //向左、向右、向上、向下最大的循环次数
    var LOOP_LIMIT = Math.min(10, Math.pow(2, level) - 1);

    var mathOptions = {
        maxSize: Math.pow(2, level)
    };

    function checkVisible(visibleInfo) {
        if (visibleInfo.area >= 5000 && visibleInfo.clockwise) {
            if (visibleInfo.visibleCount >= 1) {
                return true;
            }
        }
        return false;
    }

    function handleRow(centerRow, centerColumn) {
        var result = [];
        var grid = new ZeroGIS.TileGrid(level, centerRow, centerColumn); // {level:level,row:centerRow,column:centerColumn};
        var visibleInfo = this.getTileVisibleInfo(grid.level, grid.row, grid.column, options);
        var isRowCenterVisible = checkVisible(visibleInfo);
        if (isRowCenterVisible) {
            grid.visibleInfo = visibleInfo;
            result.push(grid);

            //向左遍历至不可见
            var leftLoopTime = 0; //向左循环的次数
            var leftColumn = centerColumn;
            var visible;
            while (leftLoopTime < LOOP_LIMIT) {
                leftLoopTime++;
                grid = ZeroGIS.MathUtils.getTileGridByBrother(level, centerRow, leftColumn, ZeroGIS.MathUtils.LEFT, mathOptions);
                leftColumn = grid.column;
                visibleInfo = this.getTileVisibleInfo(grid.level, grid.row, grid.column, options);
                visible = checkVisible(visibleInfo);
                if (visible) {
                    grid.visibleInfo = visibleInfo;
                    result.push(grid);
                } else {
                    break;
                }
            }

            //向右遍历至不可见
            var rightLoopTime = 0; //向右循环的次数
            var rightColumn = centerColumn;
            while (rightLoopTime < LOOP_LIMIT) {
                rightLoopTime++;
                grid = ZeroGIS.MathUtils.getTileGridByBrother(level, centerRow, rightColumn, ZeroGIS.MathUtils.RIGHT, mathOptions);
                rightColumn = grid.column;
                visibleInfo = this.getTileVisibleInfo(grid.level, grid.row, grid.column, options);
                visible = checkVisible(visibleInfo);
                if (visible) {
                    grid.visibleInfo = visibleInfo;
                    result.push(grid);
                } else {
                    break;
                }
            }
        }
        return result;
    }

    var verticalCenterInfo = this._getVerticalVisibleCenterInfo(options);
    var centerGrid = ZeroGIS.MathUtils.getTileGridByGeo(verticalCenterInfo.lon, verticalCenterInfo.lat, level);
    var handleRowThis = handleRow.bind(this);

    var rowResult = handleRowThis(centerGrid.row, centerGrid.column);
    result = result.concat(rowResult);

    //循环向下处理至不可见
    var bottomLoopTime = 0; //向下循环的次数
    var bottomRow = centerGrid.row;
    while (bottomLoopTime < LOOP_LIMIT) {
        bottomLoopTime++;
        grid = ZeroGIS.MathUtils.getTileGridByBrother(level, bottomRow, centerGrid.column, ZeroGIS.MathUtils.BOTTOM, mathOptions);
        bottomRow = grid.row;
        rowResult = handleRowThis(grid.row, grid.column);
        if (rowResult.length > 0) {
            result = result.concat(rowResult);
        } else {
            //已经向下循环到不可见，停止向下循环
            break;
        }
    }

    //循环向上处理至不可见
    var topLoopTime = 0; //向上循环的次数
    var topRow = centerGrid.row;
    while (topLoopTime < LOOP_LIMIT) {
        topLoopTime++;
        grid = ZeroGIS.MathUtils.getTileGridByBrother(level, topRow, centerGrid.column, ZeroGIS.MathUtils.TOP, mathOptions);
        topRow = grid.row;
        rowResult = handleRowThis(grid.row, grid.column);
        if (rowResult.length > 0) {
            result = result.concat(rowResult);
        } else {
            //已经向上循环到不可见，停止向上循环
            break;
        }
    }

    return result;
};

//options:projView
ZeroGIS.PerspectiveCamera.prototype.getTileVisibleInfo = function (level, row, column, options) {
    if (!ZeroGIS.Utils.isNonNegativeInteger(level)) {
        throw "invalid level";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(row)) {
        throw "invalid row";
    }
    if (!ZeroGIS.Utils.isNonNegativeInteger(column)) {
        throw "invalid column";
    }
    options = options || {};
    var threshold = typeof options.threshold == "number" ? Math.abs(options.threshold) : 1;
    var result = {
        lb: {
            lon: null,
            lat: null,
            verticeInWorld: null,
            verticeInNDC: null,
            visible: false
        },
        lt: {
            lon: null,
            lat: null,
            verticeInWorld: null,
            verticeInNDC: null,
            visible: false
        },
        rt: {
            lon: null,
            lat: null,
            verticeInWorld: null,
            verticeInNDC: null,
            visible: false
        },
        rb: {
            lon: null,
            lat: null,
            verticeInWorld: null,
            verticeInNDC: null,
            visible: false
        },
        Egeo: null,
        visibleCount: 0,
        clockwise: false,
        width: null,
        height: null,
        area: null
    };
    if (!(options.projView instanceof ZeroGIS.Matrix)) {
        options.projView = this.getProjViewMatrix();
    }
    result.Egeo = ZeroGIS.MathUtils.getTileGeographicEnvelopByGrid(level, row, column);
    var tileMinLon = result.Egeo.minLon;
    var tileMaxLon = result.Egeo.maxLon;
    var tileMinLat = result.Egeo.minLat;
    var tileMaxLat = result.Egeo.maxLat;

    //左下角
    result.lb.lon = tileMinLon;
    result.lb.lat = tileMinLat;
    result.lb.verticeInWorld = ZeroGIS.MathUtils.geographicToCartesianCoord(result.lb.lon, result.lb.lat);
    result.lb.verticeInNDC = this.convertVerticeFromWorldToNDC(result.lb.verticeInWorld, options.projView);
    result.lb.visible = this.isWorldVerticeVisibleInCanvas(result.lb.verticeInWorld, {
        verticeInNDC: result.lb.verticeInNDC,
        projView: options.projView,
        threshold: threshold
    });
    if (result.lb.visible) {
        result.visibleCount++;
    }

    //左上角
    result.lt.lon = tileMinLon;
    result.lt.lat = tileMaxLat;
    result.lt.verticeInWorld = ZeroGIS.MathUtils.geographicToCartesianCoord(result.lt.lon, result.lt.lat);
    result.lt.verticeInNDC = this.convertVerticeFromWorldToNDC(result.lt.verticeInWorld, options.projView);
    result.lt.visible = this.isWorldVerticeVisibleInCanvas(result.lt.verticeInWorld, {
        verticeInNDC: result.lt.verticeInNDC,
        projView: options.projView,
        threshold: threshold
    });
    if (result.lt.visible) {
        result.visibleCount++;
    }

    //右上角
    result.rt.lon = tileMaxLon;
    result.rt.lat = tileMaxLat;
    result.rt.verticeInWorld = ZeroGIS.MathUtils.geographicToCartesianCoord(result.rt.lon, result.rt.lat);
    result.rt.verticeInNDC = this.convertVerticeFromWorldToNDC(result.rt.verticeInWorld, options.projView);
    result.rt.visible = this.isWorldVerticeVisibleInCanvas(result.rt.verticeInWorld, {
        verticeInNDC: result.rt.verticeInNDC,
        projView: options.projView,
        threshold: threshold
    });
    if (result.rt.visible) {
        result.visibleCount++;
    }

    //右下角
    result.rb.lon = tileMaxLon;
    result.rb.lat = tileMinLat;
    result.rb.verticeInWorld = ZeroGIS.MathUtils.geographicToCartesianCoord(result.rb.lon, result.rb.lat);
    result.rb.verticeInNDC = this.convertVerticeFromWorldToNDC(result.rb.verticeInWorld, options.projView);
    result.rb.visible = this.isWorldVerticeVisibleInCanvas(result.rb.verticeInWorld, {
        verticeInNDC: result.rb.verticeInNDC,
        projView: options.projView,
        threshold: threshold
    });
    if (result.rb.visible) {
        result.visibleCount++;
    }

    var ndcs = [result.lb.verticeInNDC, result.lt.verticeInNDC, result.rt.verticeInNDC, result.rb.verticeInNDC];
    //计算方向
    var vector03 = ndcs[3].minus(ndcs[0]);
    vector03.z = 0;
    var vector01 = ndcs[1].minus(ndcs[0]);
    vector01.z = 0;
    var cross = vector03.cross(vector01);
    result.clockwise = cross.z > 0;
    //计算面积
    var topWidth = Math.sqrt(Math.pow(ndcs[1].x - ndcs[2].x, 2) + Math.pow(ndcs[1].y - ndcs[2].y, 2)) * ZeroGIS.canvas.width / 2;
    var bottomWidth = Math.sqrt(Math.pow(ndcs[0].x - ndcs[3].x, 2) + Math.pow(ndcs[0].y - ndcs[3].y, 2)) * ZeroGIS.canvas.width / 2;
    result.width = Math.floor((topWidth + bottomWidth) / 2);
    var leftHeight = Math.sqrt(Math.pow(ndcs[0].x - ndcs[1].x, 2) + Math.pow(ndcs[0].y - ndcs[1].y, 2)) * ZeroGIS.canvas.height / 2;
    var rightHeight = Math.sqrt(Math.pow(ndcs[2].x - ndcs[3].x, 2) + Math.pow(ndcs[2].y - ndcs[3].y, 2)) * ZeroGIS.canvas.height / 2;
    result.height = Math.floor((leftHeight + rightHeight) / 2);
    result.area = result.width * result.height;

    return result;
};

//地球一直是关于纵轴中心对称的，获取垂直方向上中心点信息
ZeroGIS.PerspectiveCamera.prototype._getVerticalVisibleCenterInfo = function (options) {
    options = options || {};
    if (!options.projView) {
        options.projView = this.getProjViewMatrix();
    }
    var result = {
        ndcY: null,
        pIntersect: null,
        lon: null,
        lat: null
    };
    var pickResults;
    if (this.pitch == 90) {
        result.ndcY = 0;
    } else {
        var count = 10;
        var delta = 2.0 / count;
        var topNdcY = 1;
        var bottomNdcY = -1;
        var ndcY;
        //从上往下找topNdcY
        for (ndcY = 1.0; ndcY >= -1.0; ndcY -= delta) {
            pickResults = this.getPickCartesianCoordInEarthByNDC(0, ndcY);
            if (pickResults.length > 0) {
                topNdcY = ndcY;
                break;
            }
        }

        //从下往上找
        for (ndcY = -1.0; ndcY <= 1.0; ndcY += delta) {
            pickResults = this.getPickCartesianCoordInEarthByNDC(0, ndcY);
            if (pickResults.length > 0) {
                bottomNdcY = ndcY;
                break;
            }
        }
        result.ndcY = (topNdcY + bottomNdcY) / 2;
    }
    pickResults = this.getPickCartesianCoordInEarthByNDC(0, result.ndcY);
    result.pIntersect = pickResults[0];
    var lonlat = ZeroGIS.MathUtils.cartesianCoordToGeographic(result.pIntersect);
    result.lon = lonlat[0];
    result.lat = lonlat[1];
    return result;
};