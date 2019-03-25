define(["world/Kernel", "world/Utils", "world/Event", "world/Scene", "world/PerspectiveCamera"],
  function(Kernel, Utils, Event, Scene, PerspectiveCamera) {

    var WebGLRenderer = function(canvas, vertexShaderText, fragmentShaderText) {
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw "invalid canvas: not HTMLCanvasElement";
      }
      if (!(Utils.isString(vertexShaderText) && vertexShaderText !== "")) {
        throw "invalid vertexShaderText";
      }
      if (!(Utils.isString(fragmentShaderText) && fragmentShaderText !== "")) {
        throw "invalid fragmentShaderText";
      }
      window.renderer = this; //之所以在此处设置window.renderer是因为要在tick函数中使用
      this.scene = null;
      this.camera = null;
      this.bAutoRefresh = false;
      Event.bindEvents(canvas);

      function initWebGL(canvas) {
        try {
          var contextList = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
          for (var i = 0; i < contextList.length; i++) {
            var g = canvas.getContext(contextList[i], {
              antialias: true
            });
            if (g) {
              window.gl = Kernel.gl = g;
              Kernel.canvas = canvas;
              break;
            }
          }
        } catch (e) {}
      }

      function getShader(gl, shaderType, shaderText) {
        if (!shaderText) {
          return null;
        }

        var shader = null;
        if (shaderType == "VERTEX_SHADER") {
          shader = gl.createShader(gl.VERTEX_SHADER);
        } else if (shaderType == "FRAGMENT_SHADER") {
          shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else {
          return null;
        }

        gl.shaderSource(shader, shaderText);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(shader));
          console.error(gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }

        return shader;
      }

      function initShaders(vertexShaderText, fragmentShaderText) {
        var vertexShader = getShader(Kernel.gl, "VERTEX_SHADER", vertexShaderText);
        var fragmentShader = getShader(Kernel.gl, "FRAGMENT_SHADER", fragmentShaderText);

        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          console.error("Could not link program!");
          gl.deleteProgram(shaderProgram);
          gl.deleteShader(vertexShader);
          gl.deleteShader(fragmentShader);
          return;
        }

        gl.useProgram(shaderProgram);
        gl.shaderProgram = shaderProgram;
        gl.shaderProgram.aVertexPosition = gl.getAttribLocation(gl.shaderProgram, "aVertexPosition");
        gl.shaderProgram.aTextureCoord = gl.getAttribLocation(gl.shaderProgram, "aTextureCoord");
        gl.shaderProgram.uMVMatrix = gl.getUniformLocation(gl.shaderProgram, "uMVMatrix");
        gl.shaderProgram.uPMatrix = gl.getUniformLocation(gl.shaderProgram, "uPMatrix");
        gl.shaderProgram.uSampler = gl.getUniformLocation(gl.shaderProgram, "uSampler"); //纹理采样器
        gl.shaderProgram.uOffScreen = gl.getUniformLocation(gl.shaderProgram, "uOffScreen"); //是否离屏渲染

        //设置默认非离屏渲染
        gl.uniform1i(gl.shaderProgram.uOffScreen, 1);

        //设置默认值
        var squareArray = [1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ];
        var squareMatrix = new Float32Array(squareArray); //ArrayBuffer
        gl.uniformMatrix4fv(gl.shaderProgram.uMVMatrix, false, squareMatrix);
      }

      initWebGL(canvas);

      if (!window.gl) {
        alert("浏览器不支持WebGL或将WebGL禁用!");
        console.debug("浏览器不支持WebGL或将WebGL禁用!");
        return;
      }

      initShaders(vertexShaderText, fragmentShaderText);

      gl.clearColor(255, 255, 255, 1.0);
      //gl.enable(gl.DEPTH_TEST);
      gl.disable(gl.DEPTH_TEST); //此处禁用深度测试是为了解决两个不同层级的切片在拖动时一起渲染会导致屏闪的问题
      gl.depthFunc(gl.LEQUAL);

      gl.enable(gl.CULL_FACE); //一定要启用裁剪，否则显示不出立体感
      gl.frontFace(gl.CCW);
      gl.cullFace(gl.BACK); //裁剪掉背面

      //gl.enable(gl.TEXTURE_2D);//WebGL: INVALID_ENUM: enable: invalid capability
    };

    WebGLRenderer.prototype = {
      constructor: WebGLRenderer,

      render: function(scene, camera) {
        if (!(scene instanceof Scene)) {
          throw "invalid scene: not World.Scene";
        }
        if (!(camera instanceof PerspectiveCamera)) {
          throw "invalid camera: not World.PerspectiveCamera";
        }
        gl.viewport(0, 0, Kernel.canvas.width, Kernel.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        camera.viewMatrix = null;
        camera.viewMatrix = camera.getViewMatrix();
        scene.draw(camera);
      },

      bindScene: function(scene) {
        if (!(scene instanceof Scene)) {
          throw "invalid scene: not World.Scene";
        }
        this.scene = scene;
      },

      bindCamera: function(camera) {
        if (!(camera instanceof PerspectiveCamera)) {
          throw "invalid camera: not World.PerspectiveCamera";
        }
        this.camera = camera;
      },

      tick: function() {
        if (Kernel.renderer instanceof WebGLRenderer) {
          if (Kernel.renderer.scene && Kernel.renderer.camera) {
            Kernel.renderer.render(Kernel.renderer.scene, Kernel.renderer.camera);
          }

          if (Kernel.renderer.bAutoRefresh) {
            window.requestAnimationFrame(Kernel.renderer.tick);
          }
        }
      },

      setIfAutoRefresh: function(bAuto) {
        if (!Utils.isBool(bAuto)) {
          throw "invalid bAuto: not bool";
        }
        this.bAutoRefresh = bAuto;
        if (this.bAutoRefresh) {
          this.tick();
        }
      }
    };
    return WebGLRenderer;
  });