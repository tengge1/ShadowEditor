define(["world/Kernel", "world/Math", "world/Vector"], function(Kernel, MathUtils, Vector) {
  var EventModule = {
    canvas: null,
    bMouseDown: false,
    dragGeo: null,
    previousX: -1,
    previousY: -1,
    onMouseMoveListener: null,

    bindEvents: function(canvas) {
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw "invalid canvas: not HTMLCanvasElement";
      }
      this.canvas = canvas;
      this.onMouseMoveListener = this.onMouseMove.bind(this);
      window.addEventListener("resize", this.initLayout.bind(this));
      this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
      this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
      this.canvas.addEventListener("dblclick", this.onDbClick.bind(this));
      this.canvas.addEventListener("mousewheel", this.onMouseWheel.bind(this));
      this.canvas.addEventListener("DOMMouseScroll", this.onMouseWheel.bind(this));
      document.body.addEventListener("keydown", this.onKeyDown.bind(this));
    },

    initLayout: function() {
      if (this.canvas instanceof HTMLCanvasElement) {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        if (Kernel.globe) {
          Kernel.globe.camera.setAspect(this.canvas.width / this.canvas.height);
          Kernel.globe.refresh();
        }
      }
    },

    //将地球表面的某一点移动到Canvas上
    moveLonLatToCanvas: function(lon, lat, canvasX, canvasY) {
      var pickResult = Kernel.globe.camera.getPickCartesianCoordInEarthByCanvas(canvasX, canvasY);
      if (pickResult.length > 0) {
        var newLonLat = MathUtils.cartesianCoordToGeographic(pickResult[0]);
        var newLon = newLonLat[0];
        var newLat = newLonLat[1];
        this.moveGeo(lon, lat, newLon, newLat);
      }
    },

    moveGeo: function(oldLon, oldLat, newLon, newLat) {
      var camera = Kernel.globe.camera;
      var deltaLonRadian = -MathUtils.degreeToRadian(newLon - oldLon); //旋转的经度
      var deltaLatRadian = MathUtils.degreeToRadian(newLat - oldLat); //旋转的纬度
      camera.worldRotateY(deltaLonRadian);
      var lightDir = camera.getLightDirection();
      var plumbVector = this.getPlumbVector(lightDir);
      camera.worldRotateByVector(deltaLatRadian, plumbVector);
    },

    onMouseDown: function(event) {
      if (Kernel.globe) {
        this.bMouseDown = true;
        this.previousX = event.layerX || event.offsetX;
        this.previousY = event.layerY || event.offsetY;
        var pickResult = Kernel.globe.camera.getPickCartesianCoordInEarthByCanvas(this.previousX, this.previousY);
        if (pickResult.length > 0) {
          this.dragGeo = MathUtils.cartesianCoordToGeographic(pickResult[0]);
          console.log("单击点三维坐标:(" + pickResult[0].x + "," + pickResult[0].y + "," + pickResult[0].z + ");经纬度坐标:[" + this.dragGeo[0] + "," + this.dragGeo[1] + "]");
        }
        this.canvas.addEventListener("mousemove", this.onMouseMoveListener, false);
      }
    },

    onMouseMove: function(event) {
      var globe = Kernel.globe;
      if (globe && this.bMouseDown) {
        var currentX = event.layerX || event.offsetX;
        var currentY = event.layerY || event.offsetY;
        var pickResult = globe.camera.getPickCartesianCoordInEarthByCanvas(currentX, currentY);
        if (pickResult.length > 0) {
          //鼠标在地球范围内
          if (this.dragGeo) {
            //鼠标拖动过程中要显示底图
            //globe.showAllSubTiledLayerAndTiles();
            var newGeo = MathUtils.cartesianCoordToGeographic(pickResult[0]);
            this.moveGeo(this.dragGeo[0], this.dragGeo[1], newGeo[0], newGeo[1]);
          } else {
            //进入地球内部
            this.dragGeo = MathUtils.cartesianCoordToGeographic(pickResult[0]);
          }
          this.previousX = currentX;
          this.previousY = currentY;
          this.canvas.style.cursor = "pointer";
        } else {
          //鼠标超出地球范围
          this.previousX = -1;
          this.previousY = -1;
          this.dragGeo = null;
          this.canvas.style.cursor = "default";
        }
      }
    },

    onMouseUp: function() {
      this.bMouseDown = false;
      this.previousX = -1;
      this.previousY = -1;
      this.dragGeo = null;
      if (this.canvas instanceof HTMLCanvasElement) {
        this.canvas.removeEventListener("mousemove", this.onMouseMoveListener, false);
        this.canvas.style.cursor = "default";
      }
    },

    onDbClick: function(event) {
      var globe = Kernel.globe;
      if (globe) {
        var absoluteX = event.layerX || event.offsetX;
        var absoluteY = event.layerY || event.offsetY;
        var pickResult = globe.camera.getPickCartesianCoordInEarthByCanvas(absoluteX, absoluteY);
        globe.setLevel(globe.CURRENT_LEVEL + 1);
        if (pickResult.length >= 1) {
          var pickVertice = pickResult[0];
          var lonlat = MathUtils.cartesianCoordToGeographic(pickVertice);
          var lon = lonlat[0];
          var lat = lonlat[1];
          globe.setLevel(globe.CURRENT_LEVEL + 1);
          this.moveLonLatToCanvas(lon, lat, absoluteX, absoluteY);
        }
      }
    },

    onMouseWheel: function(event) {
      var globe = Kernel.globe;
      if (!globe) {
        return;
      }

      var deltaLevel = 0;
      var delta;
      if (event.wheelDelta) {
        //非Firefox
        delta = event.wheelDelta;
        deltaLevel = parseInt(delta / 120);
      } else if (event.detail) {
        //Firefox
        delta = event.detail;
        deltaLevel = -parseInt(delta / 3);
      }
      var newLevel = globe.CURRENT_LEVEL + deltaLevel;
      globe.setLevel(newLevel);
    },

    onKeyDown: function(event) {
      var globe = Kernel.globe;
      if (!globe) {
        return;
      }

      var MIN_PITCH = 36;
      var DELTA_PITCH = 2;
      var camera = globe.camera;
      var keyNum = event.keyCode !== undefined ? event.keyCode : event.which;
      //上、下、左、右:38、40、37、39
      if (keyNum == 38 || keyNum == 40) {
        if (keyNum == 38) {
          if (camera.pitch <= MIN_PITCH) {
            return;
          }
        } else if (keyNum == 40) {
          if (camera.pitch >= 90) {
            return;
          }
          DELTA_PITCH *= -1;
        }

        var pickResult = camera.getDirectionIntersectPointWithEarth();
        if (pickResult.length > 0) {
          var pIntersect = pickResult[0];
          var pCamera = camera.getPosition();
          var legnth2Intersect = MathUtils.getLengthFromVerticeToVertice(pCamera, pIntersect);
          var mat = camera.matrix.copy();
          mat.setColumnTrans(pIntersect.x, pIntersect.y, pIntersect.z);
          var DELTA_RADIAN = MathUtils.degreeToRadian(DELTA_PITCH);
          mat.localRotateX(DELTA_RADIAN);
          var dirZ = mat.getColumnZ().getVector();
          dirZ.setLength(legnth2Intersect);
          var pNew = pIntersect.plus(dirZ);
          camera.look(pNew, pIntersect);
          camera.pitch -= DELTA_PITCH;
          globe.refresh();
        } else {
          alert("视线与地球无交点");
        }
      }
    },

    getPlumbVector: function(direction) {
      if (!(direction instanceof Vector)) {
        throw "invalid direction: not World.Vector";
      }
      var dir = direction.getCopy();
      dir.y = 0;
      dir.normalize();
      var plumbVector = new Vector(-dir.z, 0, dir.x);
      plumbVector.normalize();
      return plumbVector;
    }
  };
  return EventModule;
});