/* if there is a navigator.xr, clear it out */
if(typeof navigator.xr != 'undefined') {
    if(typeof XRDisplay != 'undefined') { XRDisplay = null }
    if(typeof XRSession != 'undefined') { XRSession = null }
    if(typeof XRSessionCreateParameters != 'undefined') { XRSessionCreateParameters = null }
    if(typeof Reality != 'undefined') { Reality = null }
    if(typeof XRPointCloud != 'undefined') { XRPointCloud = null }
    if(typeof XRLightEstimate != 'undefined') { XRLightEstimate = null }
    if(typeof XRAnchor != 'undefined') { XRAnchor = null }
    if(typeof XRPlaneAnchor != 'undefined') { XRPlaneAnchor = null }
    if(typeof XRFaceAnchor != 'undefined') { XRFaceAnchor = null }
    if(typeof XRImageAnchor != 'undefined') { XRImageAnchor = null }
    if(typeof XRAnchorOffset != 'undefined') { XRAnchorOffset = null }
    if(typeof XRStageBounds != 'undefined') { XRStageBounds = null }
    if(typeof XRStageBoundsPoint != 'undefined') { XRStageBoundsPoint = null }
    if(typeof XRPresentationFrame != 'undefined') { XRPresentationFrame = null }
    if(typeof XRView != 'undefined') { XRView = null }
    if(typeof XRViewport != 'undefined') { XRViewport = null }
    if(typeof XRCoordinateSystem != 'undefined') { XRCoordinateSystem = null }
    if(typeof XRViewPose != 'undefined') { XRViewPose = null }
    if(typeof XRLayer != 'undefined') { XRLayer = null }
    if(typeof XRWebGLLayer != 'undefined') { XRWebGLLayer = null }
    if(typeof XRVideoFrame != 'undefined') { XRVideoFrame = null }
    //navigator.xr = null;
}/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Quaternion = __webpack_require__(2);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
MatrixMath provides helper functions for populating the various matrices involved with 3D graphics.

Many of the math methods were taken from the Google webvr polyfill:
https://github.com/googlevr/webvr-polyfill/blob/master/src/util.js#L270
*/
var MatrixMath = function () {
	function MatrixMath() {
		_classCallCheck(this, MatrixMath);
	}

	_createClass(MatrixMath, null, [{
		key: 'mat4_generateIdentity',


		// Returns a new Float32Array that is set to the transform identity
		value: function mat4_generateIdentity() {
			return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
		}
	}, {
		key: 'mat4_get_position',
		value: function mat4_get_position(out, m) {
			out[0] = m[12];
			out[1] = m[13];
			out[2] = m[14];
			return out;
		}
	}, {
		key: 'mat4_get_rotation',
		value: function mat4_get_rotation(out, m) {
			var quat = new _Quaternion2.default();
			quat.setFromRotationMatrix(m);
			out[0] = quat.x;
			out[1] = quat.y;
			out[2] = quat.z;
			out[3] = quat.w;
			return out;
		}
	}, {
		key: 'mat4_eyeView',
		value: function mat4_eyeView(out, poseModelMatrix) {
			var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Float32Array([0, 0, 0]);

			MatrixMath.mat4_translate(out, poseModelMatrix, offset);
			MatrixMath.mat4_invert(out, out);
		}
	}, {
		key: 'mat4_perspectiveFromFieldOfView',
		value: function mat4_perspectiveFromFieldOfView(out, fov, near, far) {
			var upTan = Math.tan(fov.upDegrees * MatrixMath.PI_OVER_180);
			var downTan = Math.tan(fov.downDegrees * MatrixMath.PI_OVER_180);
			var leftTan = Math.tan(fov.leftDegrees * MatrixMath.PI_OVER_180);
			var rightTan = Math.tan(fov.rightDegrees * MatrixMath.PI_OVER_180);

			var xScale = 2.0 / (leftTan + rightTan);
			var yScale = 2.0 / (upTan + downTan);

			out[0] = xScale;
			out[1] = 0.0;
			out[2] = 0.0;
			out[3] = 0.0;
			out[4] = 0.0;
			out[5] = yScale;
			out[6] = 0.0;
			out[7] = 0.0;
			out[8] = -((leftTan - rightTan) * xScale * 0.5);
			out[9] = (upTan - downTan) * yScale * 0.5;
			out[10] = far / (near - far);
			out[11] = -1.0;
			out[12] = 0.0;
			out[13] = 0.0;
			out[14] = far * near / (near - far);
			out[15] = 0.0;
			return out;
		}
	}, {
		key: 'mat4_fromRotationTranslation',
		value: function mat4_fromRotationTranslation(out) {
			var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0, 1];
			var v = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 0];

			// Quaternion math
			var x = q[0];
			var y = q[1];
			var z = q[2];
			var w = q[3];
			var x2 = x + x;
			var y2 = y + y;
			var z2 = z + z;

			var xx = x * x2;
			var xy = x * y2;
			var xz = x * z2;
			var yy = y * y2;
			var yz = y * z2;
			var zz = z * z2;
			var wx = w * x2;
			var wy = w * y2;
			var wz = w * z2;

			out[0] = 1 - (yy + zz);
			out[1] = xy + wz;
			out[2] = xz - wy;
			out[3] = 0;
			out[4] = xy - wz;
			out[5] = 1 - (xx + zz);
			out[6] = yz + wx;
			out[7] = 0;
			out[8] = xz + wy;
			out[9] = yz - wx;
			out[10] = 1 - (xx + yy);
			out[11] = 0;
			out[12] = v[0];
			out[13] = v[1];
			out[14] = v[2];
			out[15] = 1;

			return out;
		}
	}, {
		key: 'mat4_translate',
		value: function mat4_translate(out, a, v) {
			var x = v[0];
			var y = v[1];
			var z = v[2];
			var a00 = void 0;
			var a01 = void 0;
			var a02 = void 0;
			var a03 = void 0;
			var a10 = void 0,
			    a11 = void 0,
			    a12 = void 0,
			    a13 = void 0,
			    a20 = void 0,
			    a21 = void 0,
			    a22 = void 0,
			    a23 = void 0;

			if (a === out) {
				out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
				out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
				out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
				out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
			} else {
				a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
				a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
				a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

				out[0] = a00;out[1] = a01;out[2] = a02;out[3] = a03;
				out[4] = a10;out[5] = a11;out[6] = a12;out[7] = a13;
				out[8] = a20;out[9] = a21;out[10] = a22;out[11] = a23;

				out[12] = a00 * x + a10 * y + a20 * z + a[12];
				out[13] = a01 * x + a11 * y + a21 * z + a[13];
				out[14] = a02 * x + a12 * y + a22 * z + a[14];
				out[15] = a03 * x + a13 * y + a23 * z + a[15];
			}

			return out;
		}
	}, {
		key: 'mat4_invert',
		value: function mat4_invert(out, a) {
			var a00 = a[0],
			    a01 = a[1],
			    a02 = a[2],
			    a03 = a[3],
			    a10 = a[4],
			    a11 = a[5],
			    a12 = a[6],
			    a13 = a[7],
			    a20 = a[8],
			    a21 = a[9],
			    a22 = a[10],
			    a23 = a[11],
			    a30 = a[12],
			    a31 = a[13],
			    a32 = a[14],
			    a33 = a[15];

			var b00 = a00 * a11 - a01 * a10;
			var b01 = a00 * a12 - a02 * a10;
			var b02 = a00 * a13 - a03 * a10;
			var b03 = a01 * a12 - a02 * a11;
			var b04 = a01 * a13 - a03 * a11;
			var b05 = a02 * a13 - a03 * a12;
			var b06 = a20 * a31 - a21 * a30;
			var b07 = a20 * a32 - a22 * a30;
			var b08 = a20 * a33 - a23 * a30;
			var b09 = a21 * a32 - a22 * a31;
			var b10 = a21 * a33 - a23 * a31;
			var b11 = a22 * a33 - a23 * a32;

			// Calculate the determinant
			var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

			if (!det) {
				return null;
			}
			det = 1.0 / det;

			out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
			out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
			out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
			out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
			out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
			out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
			out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
			out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
			out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
			out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
			out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
			out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
			out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
			out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
			out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
			out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

			return out;
		}
	}, {
		key: 'mat4_multiply',
		value: function mat4_multiply(out, ae, be) {
			var a11 = ae[0],
			    a12 = ae[4],
			    a13 = ae[8],
			    a14 = ae[12];
			var a21 = ae[1],
			    a22 = ae[5],
			    a23 = ae[9],
			    a24 = ae[13];
			var a31 = ae[2],
			    a32 = ae[6],
			    a33 = ae[10],
			    a34 = ae[14];
			var a41 = ae[3],
			    a42 = ae[7],
			    a43 = ae[11],
			    a44 = ae[15];

			var b11 = be[0],
			    b12 = be[4],
			    b13 = be[8],
			    b14 = be[12];
			var b21 = be[1],
			    b22 = be[5],
			    b23 = be[9],
			    b24 = be[13];
			var b31 = be[2],
			    b32 = be[6],
			    b33 = be[10],
			    b34 = be[14];
			var b41 = be[3],
			    b42 = be[7],
			    b43 = be[11],
			    b44 = be[15];

			out[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
			out[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
			out[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
			out[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

			out[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
			out[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
			out[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
			out[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

			out[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
			out[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
			out[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
			out[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

			out[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
			out[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
			out[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
			out[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

			return out;
		}
	}]);

	return MatrixMath;
}();

exports.default = MatrixMath;


MatrixMath.PI_OVER_180 = Math.PI / 180.0;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRAnchors provide per-frame coordinates which the Reality attempts to pin "in place".
In a virtual Reality these coordinates do not change. 
In a Reality based on environment mapping sensors, the anchors may change pose on a per-frame bases as the system refines its map.
*/
var XRAnchor = function () {
	function XRAnchor(xrCoordinateSystem) {
		var uid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		_classCallCheck(this, XRAnchor);

		this._uid = uid || XRAnchor._generateUID();
		this._coordinateSystem = xrCoordinateSystem;
	}

	_createClass(XRAnchor, [{
		key: 'uid',
		get: function get() {
			return this._uid;
		}
	}, {
		key: 'coordinateSystem',
		get: function get() {
			return this._coordinateSystem;
		}
	}], [{
		key: '_generateUID',
		value: function _generateUID() {
			return 'anchor-' + new Date().getTime() + '-' + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		}
	}]);

	return XRAnchor;
}();

exports.default = XRAnchor;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Quaternion wraps a vector of length 4 used as an orientation value.

Taken from https://github.com/googlevr/webvr-polyfill/blob/master/src/math-util.js which took it from Three.js
*/
var Quaternion = function () {
	function Quaternion() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

		_classCallCheck(this, Quaternion);

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	_createClass(Quaternion, [{
		key: 'set',
		value: function set(x, y, z, w) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
			return this;
		}
	}, {
		key: 'toArray',
		value: function toArray() {
			return [this.x, this.y, this.z, this.w];
		}
	}, {
		key: 'copy',
		value: function copy(quaternion) {
			this.x = quaternion.x;
			this.y = quaternion.y;
			this.z = quaternion.z;
			this.w = quaternion.w;
			return this;
		}
	}, {
		key: 'setFromRotationMatrix',
		value: function setFromRotationMatrix(array16) {
			// Taken from https://github.com/mrdoob/three.js/blob/dev/src/math/Quaternion.js
			// which took it from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
			// assumes the upper 3x3 of array16 (column major) is a pure rotation matrix (i.e, unscaled)

			var m11 = array16[0],
			    m12 = array16[4],
			    m13 = array16[8],
			    m21 = array16[1],
			    m22 = array16[5],
			    m23 = array16[9],
			    m31 = array16[2],
			    m32 = array16[6],
			    m33 = array16[10];

			var trace = m11 + m22 + m33;

			if (trace > 0) {
				var s = 0.5 / Math.sqrt(trace + 1.0);
				this.w = 0.25 / s;
				this.x = (m32 - m23) * s;
				this.y = (m13 - m31) * s;
				this.z = (m21 - m12) * s;
			} else if (m11 > m22 && m11 > m33) {
				var s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
				this.w = (m32 - m23) / s;
				this.x = 0.25 * s;
				this.y = (m12 + m21) / s;
				this.z = (m13 + m31) / s;
			} else if (m22 > m33) {
				var s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
				this.w = (m13 - m31) / s;
				this.x = (m12 + m21) / s;
				this.y = 0.25 * s;
				this.z = (m23 + m32) / s;
			} else {
				var s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
				this.w = (m21 - m12) / s;
				this.x = (m13 + m31) / s;
				this.y = (m23 + m32) / s;
				this.z = 0.25 * s;
			}
			return this;
		}
	}, {
		key: 'setFromEuler',
		value: function setFromEuler(x, y, z) {
			var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'XYZ';

			// http://www.mathworks.com/matlabcentral/fileexchange/
			// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
			//	content/SpinCalc.m

			var cos = Math.cos;
			var sin = Math.sin;
			var c1 = cos(x / 2);
			var c2 = cos(y / 2);
			var c3 = cos(z / 2);
			var s1 = sin(x / 2);
			var s2 = sin(y / 2);
			var s3 = sin(z / 2);

			if (order === 'XYZ') {
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
			} else if (order === 'YXZ') {
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
			} else if (order === 'ZXY') {
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
			} else if (order === 'ZYX') {
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
			} else if (order === 'YZX') {
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
			} else if (order === 'XZY') {
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
			}
		}
	}, {
		key: 'setFromAxisAngle',
		value: function setFromAxisAngle(axis, angle) {
			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
			// assumes axis is normalized
			var halfAngle = angle / 2;
			var s = Math.sin(halfAngle);
			this.x = axis.x * s;
			this.y = axis.y * s;
			this.z = axis.z * s;
			this.w = Math.cos(halfAngle);
			return this;
		}
	}, {
		key: 'multiply',
		value: function multiply(q) {
			return this.multiplyQuaternions(this, q);
		}
	}, {
		key: 'multiplyQuaternions',
		value: function multiplyQuaternions(a, b) {
			// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
			var qax = a.x,
			    qay = a.y,
			    qaz = a.z,
			    qaw = a.w;
			var qbx = b.x,
			    qby = b.y,
			    qbz = b.z,
			    qbw = b.w;
			this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
			this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
			this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
			this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
			return this;
		}
	}, {
		key: 'inverse',
		value: function inverse() {
			this.x *= -1;
			this.y *= -1;
			this.z *= -1;
			this.normalize();
			return this;
		}
	}, {
		key: 'normalize',
		value: function normalize() {
			var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
			if (l === 0) {
				this.x = 0;
				this.y = 0;
				this.z = 0;
				this.w = 1;
			} else {
				l = 1 / l;
				this.x = this.x * l;
				this.y = this.y * l;
				this.z = this.z * l;
				this.w = this.w * l;
			}
			return this;
		}
	}, {
		key: 'slerp',
		value: function slerp(qb, t) {
			// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
			if (t === 0) return this;
			if (t === 1) return this.copy(qb);

			var x = this.x,
			    y = this.y,
			    z = this.z,
			    w = this.w;
			var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;
			if (cosHalfTheta < 0) {
				this.w = -qb.w;
				this.x = -qb.x;
				this.y = -qb.y;
				this.z = -qb.z;
				cosHalfTheta = -cosHalfTheta;
			} else {
				this.copy(qb);
			}
			if (cosHalfTheta >= 1.0) {
				this.w = w;
				this.x = x;
				this.y = y;
				this.z = z;
				return this;
			}

			var halfTheta = Math.acos(cosHalfTheta);
			var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
			if (Math.abs(sinHalfTheta) < 0.001) {
				this.w = 0.5 * (w + this.w);
				this.x = 0.5 * (x + this.x);
				this.y = 0.5 * (y + this.y);
				this.z = 0.5 * (z + this.z);

				return this;
			}

			var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
			var ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
			this.w = w * ratioA + this.w * ratioB;
			this.x = x * ratioA + this.x * ratioB;
			this.y = y * ratioA + this.y * ratioB;
			this.z = z * ratioA + this.z * ratioB;
			return this;
		}
	}]);

	return Quaternion;
}();

exports.default = Quaternion;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
EventHandlerBase is the base class that implements the EventHandler interface methods for dispatching and receiving events.
*/
var EventHandlerBase = function () {
	function EventHandlerBase() {
		_classCallCheck(this, EventHandlerBase);

		this._listeners = new Map(); // string type -> [listener, ...]
	}

	_createClass(EventHandlerBase, [{
		key: "addEventListener",
		value: function addEventListener(type, listener) {
			var listeners = this._listeners.get(type);
			if (Array.isArray(listeners) === false) {
				listeners = [];
				this._listeners.set(type, listeners);
			}
			listeners.push(listener);
		}
	}, {
		key: "removeEventListener",
		value: function removeEventListener(type, listener) {
			var listeners = this._listeners.get(type);
			if (Array.isArray(listeners) === false) {
				return;
			}
			for (var i = 0; i < listeners.length; i++) {
				if (listeners[i] === listener) {
					listeners.splice(i, 1);
					return;
				}
			}
		}
	}, {
		key: "dispatchEvent",
		value: function dispatchEvent(event) {
			var listeners = this._listeners.get(event.type);
			if (Array.isArray(listeners) === false) return;

			// need a copy, since removeEventListener is often called inside listeners to create one-shots and it modifies the array, causing 
			// listeners not to be called! 
			var array = listeners.slice(0);
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var listener = _step.value;

					listener(event);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}]);

	return EventHandlerBase;
}();

exports.default = EventHandlerBase;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMatrixArrayType = setMatrixArrayType;
exports.toRadian = toRadian;
exports.equals = equals;
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
var EPSILON = exports.EPSILON = 0.000001;
var ARRAY_TYPE = exports.ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = exports.RANDOM = Math.random;

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
function setMatrixArrayType(type) {
  exports.ARRAY_TYPE = ARRAY_TYPE = type;
}

var degree = Math.PI / 180;

/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */
function toRadian(a) {
  return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventHandlerBase2 = __webpack_require__(3);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

var _common = __webpack_require__(4);

var glMatrix = _interopRequireWildcard(_common);

var _mat = __webpack_require__(17);

var mat4 = _interopRequireWildcard(_mat);

var _quat = __webpack_require__(18);

var quat = _interopRequireWildcard(_quat);

var _vec = __webpack_require__(12);

var vec3 = _interopRequireWildcard(_vec);

var _base64Binary = __webpack_require__(19);

var _base64Binary2 = _interopRequireDefault(_base64Binary);

var _Quaternion = __webpack_require__(2);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*	
ARKitWrapper talks	 to Apple ARKit, as exposed by Mozilla's test ARDemo app.
It won't function inside a browser like Firefox.

ARKitWrapper is a singleton. Use ARKitWrapper.GetOrCreate() to get the instance, then add event listeners like so:

	if(ARKitWrapper.HasARKit()){
		let arKitWrapper = ARKitWrapper.GetOrCreate()
		arKitWrapper.addEventListener(ARKitWrapper.INIT_EVENT, ev => { console.log('ARKit initialized', ev) })
		arKitWrapper.addEventListener(ARKitWrapper.WATCH_EVENT, ev => { console.log('ARKit update', ev) })
		arKitWrapper.watch({
			location: boolean,
			camera: boolean,
			objects: boolean,
			light_intensity: boolean
		})
	}

*/

var ARKitWrapper = function (_EventHandlerBase) {
	_inherits(ARKitWrapper, _EventHandlerBase);

	function ARKitWrapper() {
		_classCallCheck(this, ARKitWrapper);

		var _this = _possibleConstructorReturn(this, (ARKitWrapper.__proto__ || Object.getPrototypeOf(ARKitWrapper)).call(this));

		if (ARKitWrapper.HasARKit() === false) {
			throw 'ARKitWrapper will only work in Mozilla\'s ARDemo test app';
		}
		if (typeof ARKitWrapper.GLOBAL_INSTANCE !== 'undefined') {
			throw 'ARKitWrapper is a singleton. Use ARKitWrapper.GetOrCreate() to get the global instance.';
		}

		_this._deviceId = null;
		_this._isWatching = false;
		_this._isInitialized = false;
		_this._rawARData = null;

		// worker to convert buffers
		// var blobURL = this._buildWorkerBlob()
		// this._worker = new Worker(blobURL);
		// URL.revokeObjectURL(blobURL);

		// var self = this;
		// this._worker.onmessage = function (ev) {
		// 	setTimeout(function () {
		// 		self.dispatchEvent(
		// 			new CustomEvent(
		// 				ARKitWrapper.COMPUTER_VISION_DATA,
		// 				{
		// 					source: self,
		// 					detail: ev.data
		// 				}
		// 			)
		// 		)	
		// 	})
		// }

		_this.lightIntensity = 1000;
		/**
   * The current projection matrix of the device.
   * @type {Float32Array}
   * @private
   */
		_this.projectionMatrix_ = new Float32Array(16);
		/**
   * The current view matrix of the device.
   * @type {Float32Array}
   * @private
   */
		_this.viewMatrix_ = new Float32Array(16);
		/**
   * The list of planes coming from ARKit.
   * @type {Map<number, ARPlane}
   * @private
   */
		_this.planes_ = new Map();
		_this.anchors_ = new Map();

		_this._timeOffsets = [];
		_this._timeOffset = 0;
		_this._timeOffsetComputed = false;
		_this.timestamp = 0;

		_this.worldMappingStatus = ARKitWrapper.WEB_AR_WORLDMAPPING_NOT_AVAILABLE;

		_this._globalCallbacksMap = {}; // Used to map a window.arkitCallback method name to an ARKitWrapper.on* method name
		// Set up the window.arkitCallback methods that the ARKit bridge depends on
		var callbackNames = ['onInit', 'onWatch'];
		for (var i = 0; i < callbackNames.length; i++) {
			_this._generateGlobalCallback(callbackNames[i], i);
		}

		// default options for initializing ARKit
		_this._defaultOptions = {
			location: true,
			camera: true,
			objects: true,
			light_intensity: true,
			computer_vision_data: false
		};
		_this._m90 = mat4.fromZRotation(mat4.create(), 90 * _MatrixMath2.default.PI_OVER_180);
		_this._m90neg = mat4.fromZRotation(mat4.create(), -90 * _MatrixMath2.default.PI_OVER_180);
		_this._m180 = mat4.fromZRotation(mat4.create(), 180 * _MatrixMath2.default.PI_OVER_180);
		_this._mTemp = mat4.create();

		// temp storage for CV arraybuffers
		//this._ab = []

		// Set up some named global methods that the ARKit to JS bridge uses and send out custom events when they are called
		var eventCallbacks = [['arkitStartRecording', ARKitWrapper.RECORD_START_EVENT], ['arkitStopRecording', ARKitWrapper.RECORD_STOP_EVENT], ['arkitDidMoveBackground', ARKitWrapper.DID_MOVE_BACKGROUND_EVENT], ['arkitWillEnterForeground', ARKitWrapper.WILL_ENTER_FOREGROUND_EVENT], ['arkitInterrupted', ARKitWrapper.INTERRUPTED_EVENT], ['arkitInterruptionEnded', ARKitWrapper.INTERRUPTION_ENDED_EVENT], ['arkitShowDebug', ARKitWrapper.SHOW_DEBUG_EVENT], ['arkitWindowResize', ARKitWrapper.WINDOW_RESIZE_EVENT], ['onError', ARKitWrapper.ON_ERROR], ['arTrackingChanged', ARKitWrapper.AR_TRACKING_CHANGED], ['userGrantedComputerVisionData', ARKitWrapper.USER_GRANTED_COMPUTER_VISION_DATA], ['userGrantedWorldSensingData', ARKitWrapper.USER_GRANTED_WORLD_SENSING_DATA]
		//,['onComputerVisionData', ARKitWrapper.COMPUTER_VISION_DATA]
		];

		var _loop = function _loop(_i) {
			window[eventCallbacks[_i][0]] = function (detail) {
				detail = detail || null;
				try {
					_this.dispatchEvent(new CustomEvent(eventCallbacks[_i][1], {
						source: _this,
						detail: detail
					}));
				} catch (e) {
					console.error(eventCallbacks[_i][0] + ' callback error', e);
				}
			};
		};

		for (var _i = 0; _i < eventCallbacks.length; _i++) {
			_loop(_i);
		}
		/*
   * Computer vision needs massaging
   */
		window['onComputerVisionData'] = function (detail) {
			_this._onComputerVisionData(detail);
		};

		window['setNativeTime'] = function (detail) {
			_this._timeOffsets.push((performance || Date).now() - detail.nativeTime);
			_this._timeOffsetComputed = true;
			_this._timeOffset = 0;
			for (var i = 0; i < _this._timeOffsets.length; i++) {
				_this._timeOffset += _this._timeOffsets[i];
			}
			_this._timeOffset = _this._timeOffset / _this._timeOffsets.length;
			console.log("Native time: " + detail.nativeTime + ", new timeOffset: " + _this._timeOffset);
		};

		_this._adjustARKitTime = function (time) {
			// if (!this._timeOffsetComputed && adjust) {
			// 	this._timeOffsetComputed = true;
			// 	this._timeOffset = ( performance || Date ).now() - time;
			// }
			if (this._timeOffsetComputed) {
				return time + this._timeOffset;
			} else {
				return (performance || Date).now();
			}
		};

		/**
   * The result of a raycast into the AR world encoded as a transform matrix.
   * This structure has a single property - modelMatrix - which encodes the
   * translation of the intersection of the hit in the form of a 4x4 matrix.
   * @constructor
   */
		function VRHit() {
			this.modelMatrix = new Float32Array(16);
			return this;
		};

		var self = _this;
		/**
   * Get an iterable of plane objects representing ARKit's current understanding of the world.
   * @return {iterator<Object>} The iterable of plane objects.
   */
		_this.getPlanes = function () {
			return Array.from(this.planes_.values());
		};
		/**
   * Get intersection array with planes ARKit detected for the screen coords.
   *
   * @param {number} x The x coordinate in normalized screen space [0,1].
   * @param {number} y The y coordinate in normalized screen space [0,1].
   *
   * @return {!Array<VRHit>} The array of hits sorted based on distance.
   */
		_this.hitTestNoAnchor = function () {
			/**
   * Cached vec3, mat4, and quat structures needed for the hit testing to
   * avoid generating garbage.
   * @type {Object}
   */
			var hitVars = {
				rayStart: vec3.create(),
				rayEnd: vec3.create(),
				cameraPosition: vec3.create(),
				cameraQuaternion: quat.create(),
				modelViewMatrix: mat4.create(),
				projectionMatrix: mat4.create(),
				projViewMatrix: mat4.create(),
				worldRayStart: vec3.create(),
				worldRayEnd: vec3.create(),
				worldRayDir: vec3.create(),
				planeMatrix: mat4.create(),
				planeExtent: vec3.create(),
				planePosition: vec3.create(),
				planeCenter: vec3.create(),
				planeNormal: vec3.create(),
				planeIntersection: vec3.create(),
				planeIntersectionLocal: vec3.create(),
				planeHit: mat4.create(),
				planeQuaternion: quat.create()
			};

			/**
   * Sets the given mat4 from the given float[16] array.
   *
   * @param {!mat4} m The mat4 to populate with values.
   * @param {!Array<number>} a The source array of floats (must be size 16).
   */
			var setMat4FromArray = function setMat4FromArray(m, a) {
				mat4.set(m, a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
			};
			/**
   * Tests whether the given ray intersects the given plane.
   *
   * @param {!vec3} planeNormal The normal of the plane.
   * @param {!vec3} planePosition Any point on the plane.
   * @param {!vec3} rayOrigin The origin of the ray.
   * @param {!vec3} rayDirection The direction of the ray (normalized).
   * @return {number} The t-value of the intersection (-1 for none).
   */
			var rayIntersectsPlane = function () {
				var rayToPlane = vec3.create();
				return function (planeNormal, planePosition, rayOrigin, rayDirection) {
					// assuming vectors are all normalized
					var denom = vec3.dot(planeNormal, rayDirection);
					vec3.subtract(rayToPlane, planePosition, rayOrigin);
					return vec3.dot(rayToPlane, planeNormal) / denom;
				};
			}();

			/**
   * Sorts based on the distance from the VRHits to the camera.
   *
   * @param {!VRHit} a The first hit to compare.
   * @param {!VRHit} b The second hit item to compare.
   * @returns {number} -1 if a is closer than b, otherwise 1.
   */
			var sortFunction = function sortFunction(a, b) {
				// Get the matrix of hit a.
				setMat4FromArray(hitVars.planeMatrix, a.modelMatrix);
				// Get the translation component of a's matrix.
				mat4.getTranslation(hitVars.planeIntersection, hitVars.planeMatrix);
				// Get the distance from the intersection point to the camera.
				var distA = vec3.distance(hitVars.planeIntersection, hitVars.cameraPosition);

				// Get the matrix of hit b.
				setMat4FromArray(hitVars.planeMatrix, b.modelMatrix);
				// Get the translation component of b's matrix.
				mat4.getTranslation(hitVars.planeIntersection, hitVars.planeMatrix);
				// Get the distance from the intersection point to the camera.
				var distB = vec3.distance(hitVars.planeIntersection, hitVars.cameraPosition);

				// Return comparison of distance from camera to a and b.
				return distA < distB ? -1 : 1;
			};

			return function (x, y) {
				// Coordinates must be in normalized screen space.
				if (x < 0 || x > 1 || y < 0 || y > 1) {
					throw new Error("hitTest - x and y values must be normalized [0,1]!");
				}

				var hits = [];
				// If there are no anchors detected, there will be no hits.
				var planes = this.getPlanes();
				if (!planes || planes.length == 0) {
					return hits;
				}

				// Create a ray in screen space for the hit test ([-1, 1] with y flip).
				vec3.set(hitVars.rayStart, 2 * x - 1, 2 * (1 - y) - 1, 0);
				vec3.set(hitVars.rayEnd, 2 * x - 1, 2 * (1 - y) - 1, 1);
				// Set the projection matrix.
				setMat4FromArray(hitVars.projectionMatrix, self.projectionMatrix_);

				// Set the model view matrix.
				setMat4FromArray(hitVars.modelViewMatrix, self.viewMatrix_);

				// Combine the projection and model view matrices.
				mat4.multiply(hitVars.projViewMatrix, hitVars.projectionMatrix, hitVars.modelViewMatrix);
				// Invert the combined matrix because we need to go from screen -> world.
				mat4.invert(hitVars.projViewMatrix, hitVars.projViewMatrix);

				// Transform the screen-space ray start and end to world-space.
				vec3.transformMat4(hitVars.worldRayStart, hitVars.rayStart, hitVars.projViewMatrix);
				vec3.transformMat4(hitVars.worldRayEnd, hitVars.rayEnd, hitVars.projViewMatrix);

				// Subtract start from end to get the ray direction and then normalize.
				vec3.subtract(hitVars.worldRayDir, hitVars.worldRayEnd, hitVars.worldRayStart);
				vec3.normalize(hitVars.worldRayDir, hitVars.worldRayDir);

				// Go through all the anchors and test for intersections with the ray.
				for (var i = 0; i < planes.length; i++) {
					var plane = planes[i];
					// Get the anchor transform.
					setMat4FromArray(hitVars.planeMatrix, plane.modelMatrix);

					// Get the position of the anchor in world-space.
					vec3.set(hitVars.planeCenter, plane.center.x, plane.center.y, plane.center.z);
					vec3.transformMat4(hitVars.planePosition, hitVars.planeCenter, hitVars.planeMatrix);

					hitVars.planeAlignment = plane.alignment;

					// Get the plane normal.
					if (hitVars.planeAlignment === 0) {
						vec3.set(hitVars.planeNormal, 0, 1, 0);
					} else {
						vec3.set(hitVars.planeNormal, hitVars.planeMatrix[4], hitVars.planeMatrix[5], hitVars.planeMatrix[6]);
					}

					// Check if the ray intersects the plane.
					var t = rayIntersectsPlane(hitVars.planeNormal, hitVars.planePosition, hitVars.worldRayStart, hitVars.worldRayDir);

					// if t < 0, there is no intersection.
					if (t < 0) {
						continue;
					}

					// Calculate the actual intersection point.
					vec3.scale(hitVars.planeIntersection, hitVars.worldRayDir, t);
					vec3.add(hitVars.planeIntersection, hitVars.worldRayStart, hitVars.planeIntersection);
					// Get the plane extents (extents are in plane local space).
					vec3.set(hitVars.planeExtent, plane.extent[0], 0, plane.extent[1]);

					/*
      ///////////////////////////////////////////////
      // Test by converting extents to world-space.
      // TODO: get this working to avoid matrix inversion in method below.
     			 // Get the rotation component of the anchor transform.
      mat4.getRotation(hitVars.planeQuaternion, hitVars.planeMatrix);
     			 // Convert the extent into world space.
      vec3.transformQuat(
      hitVars.planeExtent, hitVars.planeExtent, hitVars.planeQuaternion);
     			 // Check if intersection is outside of the extent of the anchor.
      if (Math.abs(hitVars.planeIntersection[0] - hitVars.planePosition[0]) > hitVars.planeExtent[0] / 2) {
      continue;
      }
      if (Math.abs(hitVars.planeIntersection[2] - hitVars.planePosition[2]) > hitVars.planeExtent[2] / 2) {
      continue;
      }
      ////////////////////////////////////////////////
      */

					////////////////////////////////////////////////
					mat4.getRotation(hitVars.planeQuaternion, hitVars.planeMatrix);

					// Test by converting intersection into plane-space.

					mat4.invert(hitVars.planeMatrix, hitVars.planeMatrix);
					vec3.transformMat4(hitVars.planeIntersectionLocal, hitVars.planeIntersection, hitVars.planeMatrix);

					// Check if intersection is outside of the extent of the anchor.
					// Tolerance is added to match the behavior of the native hitTest call.
					var tolerance = 0.0075;
					if (Math.abs(hitVars.planeIntersectionLocal[0]) > hitVars.planeExtent[0] / 2 + tolerance) {
						continue;
					}
					if (Math.abs(hitVars.planeIntersectionLocal[2]) > hitVars.planeExtent[2] / 2 + tolerance) {
						continue;
					}

					////////////////////////////////////////////////

					// The intersection is valid - create a matrix from hit position.
					//mat4.fromTranslation(hitVars.planeHit, hitVars.planeIntersection);
					mat4.fromRotationTranslation(hitVars.planeHit, hitVars.planeQuaternion, hitVars.planeIntersection);
					var hit = new VRHit();
					for (var j = 0; j < 16; j++) {
						hit.modelMatrix[j] = hitVars.planeHit[j];
					}
					hit.i = i;
					hits.push(hit);
				}

				// Sort the hits by distance.
				hits.sort(sortFunction);
				return hits;
			};
		}();
		return _this;
	}

	_createClass(ARKitWrapper, [{
		key: "waitForInit",
		// True if this instance has received data via onWatch

		/*
  Useful for waiting for or immediately receiving notice of ARKit initialization
  */
		value: function waitForInit() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				if (_this2._isInitialized) {
					resolve();
					return;
				}
				var callback = function callback() {
					_this2.removeEventListener(ARKitWrapper.INIT_EVENT, callback, false);
					resolve();
				};
				_this2.addEventListener(ARKitWrapper.INIT_EVENT, callback, false);
			});
		}

		/*
  getData looks into the most recent ARKit data (as received by onWatch) for a key
  returns the key's value or null if it doesn't exist or if a key is not specified it returns all data
  */

	}, {
		key: "getData",
		value: function getData() {
			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (key === null) {
				return this._rawARData;
			}
			if (this._rawARData && typeof this._rawARData[key] !== 'undefined') {
				return this._rawARData[key];
			}
			return null;
		}

		/*
  returns
  	{
  		uuid: DOMString,
  		transform: [4x4 column major affine transform]
  	}
  
  return null if object with `uuid` is not found
  */

	}, {
		key: "getObject",
		value: function getObject(uuid) {
			if (!this._isInitialized) {
				return null;
			}
			var objects = this.getKey('objects');
			if (objects === null) return null;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var object = _step.value;

					if (object.uuid === uuid) {
						return object;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return null;
		}

		/*
  Sends a hitTest message to ARKit to get hit testing results
  x, y - screen coordinates normalized to 0..1 (0,0 is at top left and 1,1 is at bottom right)
  types - bit mask of hit testing types
  
  Returns a Promise that resolves to a (possibly empty) array of hit test data:
  [
  	{
  		type: 1,							// A packed mask of types ARKitWrapper.HIT_TEST_TYPE_*
  		distance: 1.0216870307922363,		// The distance in meters from the camera to the detected anchor or feature point.
  		world_transform:  [float x 16],		// The pose of the hit test result relative to the world coordinate system. 
  		local_transform:  [float x 16],		// The pose of the hit test result relative to the nearest anchor or feature point
  
  		// If the `type` is `HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE`, `HIT_TEST_TYPE_EXISTING_PLANE`, or `HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT` (2, 8, or 16) it will also have anchor data:
  		anchor_center: { x:float, y:float, z:float },
  		anchor_extent: { x:float, y:float },
  		uuid: string,
  
  		// If the `type` is `HIT_TEST_TYPE_EXISTING_PLANE` or `HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT` (8 or 16) it will also have an anchor transform:
  		anchor_transform: [float x 16]
  	},
  	...
  ]
  @see https://developer.apple.com/documentation/arkit/arframe/2875718-hittest
  */

	}, {
		key: "hitTest",
		value: function hitTest(x, y) {
			var _this3 = this;

			var types = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ARKitWrapper.HIT_TEST_TYPE_ALL;

			return new Promise(function (resolve, reject) {
				if (!_this3._isInitialized) {
					reject(new Error('ARKit is not initialized'));
					return;
				}
				window.webkit.messageHandlers.hitTest.postMessage({
					x: x,
					y: y,
					type: types,
					callback: _this3._createPromiseCallback('hitTest', resolve)
				});
			});
		}

		/*
  Sends an addAnchor message to ARKit
  Returns a promise that returns:
  {
  	uuid - the anchor's uuid,
  	transform - anchor transformation matrix
  }
  */

	}, {
		key: "addAnchor",
		value: function addAnchor(uid, transform) {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				if (!_this4._isInitialized) {
					reject(new Error('ARKit is not initialized'));
					return;
				}
				window.webkit.messageHandlers.addAnchor.postMessage({
					uuid: uid,
					transform: transform,
					callback: _this4._createPromiseCallback('addAnchor', resolve)
				});
			});
		}
	}, {
		key: "removeAnchor",
		value: function removeAnchor(uid) {
			window.webkit.messageHandlers.removeAnchors.postMessage([uid]);
		}

		/*
   * ask for an image anchor.
   * 
   * Provide a uid for the anchor that will be created.
   * Supply the image in an ArrayBuffer, typedArray or ImageData
   * width and height are in meters 
   */

	}, {
		key: "createImageAnchor",
		value: function createImageAnchor(uid, buffer, width, height, physicalWidthInMeters) {
			var _this5 = this;

			return new Promise(function (resolve, reject) {
				if (!_this5._isInitialized) {
					reject(new Error('ARKit is not initialized'));
					return;
				}

				var b64 = _base64Binary2.default.encode(buffer);

				window.webkit.messageHandlers.createImageAnchor.postMessage({
					uid: uid,
					buffer: b64,
					imageWidth: width,
					imageHeight: height,
					physicalWidth: physicalWidthInMeters,
					callback: _this5._createPromiseCallback('createImageAnchor', resolve)
				});
			});
		}

		/***
  * activateDetectionImage activates an image and waits for the detection
   * @param uid The UID of the image to activate, previously created via "createImageAnchor"
   * @returns {Promise<any>} a promise that will be resolved when ARKit detects the image, or an error otherwise
   */

	}, {
		key: "activateDetectionImage",
		value: function activateDetectionImage(uid) {
			var _this6 = this;

			return new Promise(function (resolve, reject) {
				if (!_this6._isInitialized) {
					reject(new Error('ARKit is not initialized'));
					return;
				}

				window.webkit.messageHandlers.activateDetectionImage.postMessage({
					uid: uid,
					callback: _this6._createPromiseCallback('activateDetectionImage', resolve)
				});
			});
		}

		/***
   * getWorldMap requests a worldmap from the platform
   * @returns {Promise<any>} a promise that will be resolved when the worldMap has been retrieved, or an error otherwise
   */

	}, {
		key: "getWorldMap",
		value: function getWorldMap() {
			var _this7 = this;

			return new Promise(function (resolve, reject) {
				if (!_this7._isInitialized) {
					reject(new Error('ARKit is not initialized'));
					return;
				}

				window.webkit.messageHandlers.getWorldMap.postMessage({
					callback: _this7._createPromiseCallback('getWorldMap', resolve)
				});
			});
		}

		/***
   * setWorldMap requests a worldmap for the platform be set
   * @returns {Promise<any>} a promise that will be resolved when the worldMap has been set, or an error otherwise
   */

	}, {
		key: "setWorldMap",
		value: function setWorldMap(worldMap) {
			var _this8 = this;

			return new Promise(function (resolve, reject) {
				if (!_this8._isInitialized) {
					reject(new Error('ARKit is not initialized'));
					return;
				}

				window.webkit.messageHandlers.setWorldMap.postMessage({
					worldMap: worldMap.worldMap,
					callback: _this8._createPromiseCallback('setWorldMap', resolve)
				});
			});
		}

		/* 
  RACE CONDITION:  call stop, then watch:  stop does not set isWatching false until it gets a message back from the app,
  so watch will return and not issue a watch command.   May want to set isWatching false immediately?
  */

		/*
  If this instance is currently watching, send the stopAR message to ARKit to request that it stop sending data on onWatch
  */

	}, {
		key: "stop",
		value: function stop() {
			var _this9 = this;

			return new Promise(function (resolve, reject) {
				if (!_this9._isWatching) {
					resolve();
					return;
				}
				console.log('----STOP');
				window.webkit.messageHandlers.stopAR.postMessage({
					callback: _this9._createPromiseCallback('stop', resolve)
				});
			});
		}

		/*
  If not already watching, send a watchAR message to ARKit to request that it start sending per-frame data to onWatch
  options: the options map for ARKit
  	{
  		location: boolean,
  		camera: boolean,
  		objects: boolean,
  		light_intensity: boolean,
  		computer_vision_data: boolean
  	}
  */

	}, {
		key: "watch",
		value: function watch() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (!this._isInitialized) {
				return false;
			}
			if (this._isWatching) {
				return true;
			}
			this._isWatching = true;

			var newO = Object.assign({}, this._defaultOptions);

			if (options != null) {
				newO = Object.assign(newO, options);
			}

			// option to WebXRView is different than the WebXR option
			if (newO.videoFrames) {
				delete newO.videoFrames;
				newO.computer_vision_data = true;
			}

			var data = {
				options: newO,
				callback: this._globalCallbacksMap.onWatch
			};
			console.log('----WATCH');
			window.webkit.messageHandlers.watchAR.postMessage(data);
			return true;
		}

		/*
  Sends a setUIOptions message to ARKit to set ui options (show or hide ui elements)
  options: {
  	browser: boolean,
  	points: boolean,
  	focus: boolean,
  	rec: boolean,
  	rec_time: boolean,
  	mic: boolean,
  	build: boolean,
  	plane: boolean,
  	warnings: boolean,
  	anchors: boolean,
  	debug: boolean,
  	statistics: boolean
  }
  */

	}, {
		key: "setUIOptions",
		value: function setUIOptions(options) {
			window.webkit.messageHandlers.setUIOptions.postMessage(options);
		}

		/*
  Called during instance creation to send a message to ARKit to initialize and create a device ID
  Usually results in ARKit calling back to _onInit with a deviceId
  options: {
  	ui: {
  		browser: boolean,
  		points: boolean,
  		focus: boolean,
  		rec: boolean,
  		rec_time: boolean,
  		mic: boolean,
  		build: boolean,
  		plane: boolean,
  		warnings: boolean,
  		anchors: boolean,
  		debug: boolean,
  		statistics: boolean
  	}
  }
  */

	}, {
		key: "_sendInit",
		value: function _sendInit(options) {
			// get device id
			console.log('----INIT');
			window.webkit.messageHandlers.initAR.postMessage({
				options: options,
				callback: this._globalCallbacksMap.onInit
			});
		}

		/*
  Callback for when ARKit is initialized
  deviceId: DOMString with the AR device ID
  */

	}, {
		key: "_onInit",
		value: function _onInit(deviceId) {
			this._deviceId = deviceId;
			this._isInitialized = true;
			try {
				this.dispatchEvent(new CustomEvent(ARKitWrapper.INIT_EVENT, {
					source: this
				}));
			} catch (e) {
				console.error('INIT_EVENT event error', e);
			}
		}

		/*
  _onWatch is called from native ARKit on each frame:
  	data:
  	{
  		"timestamp": time value
  		"light_intensity": value
  		"camera_view":[4x4 column major affine transform matrix],
  		"projection_camera":[4x4 projection matrix],
  		"newObjects": [
  			{
  				uuid: DOMString (unique UID),
  				transform: [4x4 column major affine transform],
  				plane_center: {x, y, z},  // only on planes
  				plane_center: {x, y, z}	// only on planes, where x/z are used,
  			}, ...
  		],
  		"removeObjects": [
  			uuid: DOMString (unique UID), ...
  		]
  		"objects":[
  			{
  				uuid: DOMString (unique UID),
  				transform: [4x4 column major affine transform]
  				plane_center: {x, y, z},  // only on planes
  				plane_center: {x, y, z}	// only on planes, where x/z are used,
  			}, ...
  		]
  	}
  
  */

	}, {
		key: "_onWatch",
		value: function _onWatch(data) {
			this._rawARData = data;
			try {
				this.dispatchEvent(new CustomEvent(ARKitWrapper.WATCH_EVENT, {
					source: this,
					detail: this._rawARData
				}));
			} catch (e) {
				console.error('WATCH_EVENT event error', e);
			}
			this.timestamp = this._adjustARKitTime(data.timestamp);
			this.lightIntensity = data.light_intensity;
			this.viewMatrix_ = data.camera_view;
			this.projectionMatrix_ = data.projection_camera;
			this.worldMappingStatus = data.worldMappingStatus;
			if (data.newObjects.length) {
				for (var i = 0; i < data.newObjects.length; i++) {
					var element = data.newObjects[i];
					if (element.plane_center) {
						this.planes_.set(element.uuid, {
							id: element.uuid,
							center: element.plane_center,
							extent: [element.plane_extent.x, element.plane_extent.z],
							modelMatrix: element.transform,
							alignment: element.plane_alignment
						});
					} else {
						this.anchors_.set(element.uuid, {
							id: element.uuid,
							modelMatrix: element.transform
						});
					}
				}
			}

			if (data.removedObjects.length) {
				for (var _i2 = 0; _i2 < data.removedObjects.length; _i2++) {
					var _element = data.removedObjects[_i2];
					if (this.planes_.get(_element)) {
						this.planes_.delete(_element);
					} else {
						this.anchors_.delete(_element);
					}
				}
			}

			if (data.objects.length) {
				for (var _i3 = 0; _i3 < data.objects.length; _i3++) {
					var _element2 = data.objects[_i3];
					if (_element2.plane_center) {
						var plane = this.planes_.get(_element2.uuid);
						if (!plane) {
							this.planes_.set(_element2.uuid, {
								id: _element2.uuid,
								center: _element2.plane_center,
								extent: [_element2.plane_extent.x, _element2.plane_extent.z],
								modelMatrix: _element2.transform,
								alignment: _element2.plane_alignment
							});
						} else {
							plane.center = _element2.plane_center;
							plane.extent[0] = _element2.plane_extent.x;
							plane.extent[1] = _element2.plane_extent.z;
							plane.modelMatrix = _element2.transform;
							plane.alignment = _element2.plane_alignment;
						}
					} else {
						var anchor = this.anchors_.get(_element2.uuid);
						if (!anchor) {
							this.anchors_.set(_element2.uuid, {
								id: _element2.uuid,
								modelMatrix: _element2.transform
							});
						} else {
							anchor.modelMatrix = _element2.transform;
						}
					}
				}
			}
		}

		/*
  Callback from ARKit for when sending per-frame data to onWatch is stopped
  */

	}, {
		key: "_onStop",
		value: function _onStop() {
			this._isWatching = false;
		}
	}, {
		key: "_createPromiseCallback",
		value: function _createPromiseCallback(action, resolve) {
			var _this10 = this;

			var callbackName = this._generateCallbackUID(action);
			window[callbackName] = function (data) {
				delete window[callbackName];
				var wrapperCallbackName = '_on' + action[0].toUpperCase() + action.slice(1);
				if (typeof _this10[wrapperCallbackName] == 'function') {
					_this10[wrapperCallbackName](data);
				}
				resolve(data);
			};
			return callbackName;
		}
	}, {
		key: "_generateCallbackUID",
		value: function _generateCallbackUID(prefix) {
			return 'arkitCallback_' + prefix + '_' + new Date().getTime() + '_' + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		}

		/*
  The ARKit iOS app depends on several callbacks on `window`. This method sets them up.
  They end up as window.arkitCallback? where ? is an integer.
  You can map window.arkitCallback? to ARKitWrapper instance methods using _globalCallbacksMap
  */

	}, {
		key: "_generateGlobalCallback",
		value: function _generateGlobalCallback(callbackName, num) {
			var name = 'arkitCallback' + num;
			this._globalCallbacksMap[callbackName] = name;
			var self = this;
			window[name] = function (deviceData) {
				self['_' + callbackName](deviceData);
			};
		}

		/*
  ev.detail contains:
  	{
  	  "frame": {
  		"buffers": [ // Array of base64 encoded string buffers
  		  {
  			"size": {
  			  "width": 320,
  			  "height": 180,
  			  "bytesPerRow": 320,
  			  "bytesPerPixel": 1
  			},
  			"buffer": "e3x...d7d"   /// convert to Uint8 buffer in code below
  		  },
  		  {
  			"size": {
  			  "width": 160,
  			  "height": 90,
  			  "bytesPerRow": 320,
  			  "bytesPerPixel": 2
  			},
  			"buffer": "ZZF.../fIJ7"  /// convert to Uint8 buffer in code below
  		  }
  		],
  		"pixelFormatType": "kCVPixelFormatType_420YpCbCr8BiPlanarFullRange",
  		"pixelFormat": "YUV420P",  /// Added in the code below, clients should ignore pixelFormatType
  		"timestamp": 337791
  	  },
  	  "camera": {
  		"cameraIntrinsics": [3x3 matrix],
  			fx 0   px
  			0  fy  py
  			0  0   1
  			fx and fy are the focal length in pixels.
  			px and py are the coordinates of the principal point in pixels.
  			The origin is at the center of the upper-left pixel.
  
  		"cameraImageResolution": {
  		  "width": 1280,
  		  "height": 720
  		},
  		"viewMatrix": [4x4 camera view matrix],
  		"arCamera": true;
  	    "cameraOrientation": 0,  // orientation in degrees of image relative to display
                             // normally 0, but on video mixed displays that keep the camera in a fixed 
                             // orientation, but rotate the UI, like on some phones, this will change
                             // as the display orientation changes
  		"interfaceOrientation": 3,
  			// 0 UIDeviceOrientationUnknown
  			// 1 UIDeviceOrientationPortrait
  			// 2 UIDeviceOrientationPortraitUpsideDown
  			// 3 UIDeviceOrientationLandscapeRight
  			// 4 UIDeviceOrientationLandscapeLeft
  		"projectionMatrix": [4x4 camera projection matrix]
  	  }
  	}
   */

	}, {
		key: "_onComputerVisionData",
		value: function _onComputerVisionData(detail) {
			// convert the arrays
			if (!detail) {
				console.error("detail passed to _onComputerVisionData is null");
				this._requestComputerVisionData();
				return;
			}
			// convert the arrays
			if (!detail.frame || !detail.frame.buffers || detail.frame.buffers.length <= 0) {
				console.error("detail passed to _onComputerVisionData is bad, no buffers");
				this._requestComputerVisionData();
				return;
			}

			// the orientation matrix we get is relative to the current view orientation.  
			// We need to add an orientation around z, so that we have the orientation that goes from 
			// camera frame to the current view orientation, since the camera is fixed and the view
			// changes as we rotate the device. 
			//
			// We also set a cameraOrientation value for the orientation of the camera relative to the
			// display.  This will be particular to video-mixed-AR where the camera is the video on the
			// screen, since any other setup would need to use the full orientation (and probably 
			// wouldn't be rotating the content / UI)
			detail.camera.arCamera = true;
			var orientation = detail.camera.interfaceOrientation;
			detail.camera.viewMatrix = detail.camera.inverse_viewMatrix;
			// mat4.copy(this._mTemp, detail.camera.viewMatrix)
			switch (orientation) {
				case 1:
					// rotate by -90;
					detail.camera.cameraOrientation = -90;
					// mat4.multiply(detail.camera.viewMatrix, this._mTemp, this._m90neg)
					break;

				case 2:
					// rotate by 90;
					detail.camera.cameraOrientation = 90;
					// mat4.multiply(detail.camera.viewMatrix, this._mTemp, this._m90)
					break;
				case 3:
					detail.camera.cameraOrientation = 0;
					// rotate by nothing
					break;
				case 4:
					// rotate by 180;
					detail.camera.cameraOrientation = 180;
					// mat4.multiply(detail.camera.viewMatrix, this._mTemp, this._m180)
					break;
			}
			// convert buffers in place
			//var buffers = detail.frame.buffers;

			// if there are too many cached array buffers, drop the unneeded ones
			// if (this._ab.length > buffers.length) {
			// 	this._ab = this._ab.slice(0, buffer.length)
			// }

			// if (this._worker) {
			// 	detail.ab = this._ab;
			// 	if (this._ab) {
			// 		this._worker.postMessage(detail, this._ab);
			// 	} else {
			// 		this._worker.postMessage(detail);
			// 	}
			// } else {
			// for (var i = 0; i < buffers.length; i++) {
			// 	// gradually increase the size of the ab[] array to hold the temp buffers, 
			// 	// and add null so it gets allocated properly
			// 	if (this._ab.length <= i) {
			// 		this._ab.push(null)
			// 	}
			// 	var bufflen = buffers[i].buffer.length;
			// 	this._ab[i] = buffers[i].buffer = base64.decodeArrayBuffer(buffers[i].buffer, this._ab[i]);
			// 	var buffersize = buffers[i].buffer.byteLength;
			// 	var imagesize = buffers[i].size.height * buffers[i].size.bytesPerRow;
			// }
			switch (detail.frame.pixelFormatType) {
				case "kCVPixelFormatType_420YpCbCr8BiPlanarFullRange":
					detail.frame.pixelFormat = "YUV420P";
					break;
				default:
					detail.frame.pixelFormat = detail.frame.pixelFormatType;
					break;
			}

			var xrVideoFrame = new XRVideoFrame(detail.frame.buffers, detail.frame.pixelFormat, this._adjustARKitTime(detail.frame.timestamp), detail.camera);
			try {
				this.dispatchEvent(new CustomEvent(ARKitWrapper.COMPUTER_VISION_DATA, {
					source: this,
					detail: xrVideoFrame
				}));
			} catch (e) {
				console.error('COMPUTER_VISION_DATA event error', e);
			}
			//}	
		}

		/*
  Requests ARKit a new set of buffers for computer vision processing
   */

	}, {
		key: "_requestComputerVisionData",
		value: function _requestComputerVisionData() {
			window.webkit.messageHandlers.requestComputerVisionData.postMessage({});
		}

		/*
  Requests ARKit to start sending CV data (data is send automatically when requested and approved)
   */

	}, {
		key: "_startSendingComputerVisionData",
		value: function _startSendingComputerVisionData() {
			window.webkit.messageHandlers.startSendingComputerVisionData.postMessage({});
		}

		/*
  Requests ARKit to stop sending CV data
   */

	}, {
		key: "_stopSendingComputerVisionData",
		value: function _stopSendingComputerVisionData() {
			window.webkit.messageHandlers.stopSendingComputerVisionData.postMessage({});
		}

		// _buildWorkerBlob() {
		// 	var blobURL = URL.createObjectURL( new Blob([ '(',

		// 	function(){
		// 		// could not get workers working, so am not using this.
		// 		//
		// 		// Tried to use Transferable ArrayBuffers but kept getting DOM Error 25. 
		// 		// 

		// 		var b64 = {
		// 			_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		// 			/* will return a  Uint8Array type */
		// 			decodeArrayBuffer: function(input, buffer) {
		// 				var bytes = (input.length/4) * 3;
		// 				if (!buffer || buffer.byteLength != bytes) {
		// 					// replace the buffer with a new, appropriately sized one
		// 					buffer = new ArrayBuffer(bytes);
		// 				}
		// 				this.decode(input, buffer);

		// 				return buffer;
		// 			},

		// 			removePaddingChars: function(input){
		// 				var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
		// 				if(lkey == 64){
		// 					return input.substring(0,input.length - 1);
		// 				}
		// 				return input;
		// 			},

		// 			decode: function(input, arrayBuffer) {
		// 				//get last chars to see if are valid
		// 				input = this.removePaddingChars(input);
		// 				input = this.removePaddingChars(input);

		// 				var bytes = parseInt((input.length / 4) * 3, 10);

		// 				var uarray;
		// 				var chr1, chr2, chr3;
		// 				var enc1, enc2, enc3, enc4;
		// 				var i = 0;
		// 				var j = 0;

		// 				if (arrayBuffer)
		// 					uarray = new Uint8Array(arrayBuffer);
		// 				else
		// 					uarray = new Uint8Array(bytes);

		// 				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		// 				for (i=0; i<bytes; i+=3) {	
		// 					//get the 3 octects in 4 ascii chars
		// 					enc1 = this._keyStr.indexOf(input.charAt(j++));
		// 					enc2 = this._keyStr.indexOf(input.charAt(j++));
		// 					enc3 = this._keyStr.indexOf(input.charAt(j++));
		// 					enc4 = this._keyStr.indexOf(input.charAt(j++));

		// 					chr1 = (enc1 << 2) | (enc2 >> 4);
		// 					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		// 					chr3 = ((enc3 & 3) << 6) | enc4;

		// 					uarray[i] = chr1;			
		// 					if (enc3 != 64) uarray[i+1] = chr2;
		// 					if (enc4 != 64) uarray[i+2] = chr3;
		// 				}

		// 				return uarray;	
		// 			}
		// 		}

		// 		self.addEventListener('message',  function(event){
		// 			var frame = event.data.frame
		// 			var camera = event.data.camera

		// 			var ab = event.data.ab;

		// 			// convert buffers in place
		// 			var buffers = frame.buffers;
		// 			var buffs = []
		// 			// if there are too many cached array buffers, drop the unneeded ones
		// 			if (ab.length > buffers.length) {
		// 				ab = ab.slice(0, buffer.length)
		// 			}
		// 			for (var i = 0; i < buffers.length; i++) {
		// 				// gradually increase the size of the ab[] array to hold the temp buffers, 
		// 				// and add null so it gets allocated properly
		// 				if (ab.length <= i) {
		// 					ab.push(null)
		// 				}
		// 				ab[i] = buffers[i].buffer = b64.decodeArrayBuffer(buffers[i].buffer, ab[i]);
		// 				buffs.push(buffers[i].buffer)
		// 			}
		// 			switch(frame.pixelFormatType) {
		// 				case "kCVPixelFormatType_420YpCbCr8BiPlanarFullRange":
		// 					frame.pixelFormat = "YUV420P";
		// 					break;
		// 				default:
		// 					frame.pixelFormat = frame.pixelFormatType; 
		// 					break;
		// 			}

		// 			postMessage(event.data, buffs);
		// 		});
		// 	}.toString(),
		// 	')()' ], { type: 'application/javascript' } ) )

		// 	return( blobURL );			
		// }

	}, {
		key: "deviceId",
		get: function get() {
			return this._deviceId;
		} // The ARKit provided device ID

	}, {
		key: "isWatching",
		get: function get() {
			return this._isWatching;
		} // True if ARKit is sending frame data

	}, {
		key: "isInitialized",
		get: function get() {
			return this._isInitialized;
		} // True if this instance has received the onInit callback from ARKit

	}, {
		key: "hasData",
		get: function get() {
			return this._rawARData !== null;
		}
	}], [{
		key: "GetOrCreate",
		value: function GetOrCreate() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (typeof ARKitWrapper.GLOBAL_INSTANCE === 'undefined') {
				ARKitWrapper.GLOBAL_INSTANCE = new ARKitWrapper();
				options = options && (typeof options === "undefined" ? "undefined" : _typeof(options)) == 'object' ? options : {};
				var defaultUIOptions = {
					browser: true,
					points: true,
					focus: false,
					rec: true,
					rec_time: true,
					mic: false,
					build: false,
					plane: true,
					warnings: true,
					anchors: false,
					debug: true,
					statistics: false
				};
				var uiOptions = _typeof(options.ui) == 'object' ? options.ui : {};
				options.ui = Object.assign(defaultUIOptions, uiOptions);
				ARKitWrapper.GLOBAL_INSTANCE._sendInit(options);
			}
			return ARKitWrapper.GLOBAL_INSTANCE;
		}
	}, {
		key: "HasARKit",
		value: function HasARKit() {
			return typeof window.webkit !== 'undefined';
		}
	}]);

	return ARKitWrapper;
}(_EventHandlerBase3.default);

// ARKitWrapper event names:


exports.default = ARKitWrapper;
ARKitWrapper.INIT_EVENT = 'arkit-init';
ARKitWrapper.WATCH_EVENT = 'arkit-watch';
ARKitWrapper.RECORD_START_EVENT = 'arkit-record-start';
ARKitWrapper.RECORD_STOP_EVENT = 'arkit-record-stop';
ARKitWrapper.DID_MOVE_BACKGROUND_EVENT = 'arkit-did-move-background';
ARKitWrapper.WILL_ENTER_FOREGROUND_EVENT = 'arkit-will-enter-foreground';
ARKitWrapper.INTERRUPTED_EVENT = 'arkit-interrupted';
ARKitWrapper.INTERRUPTION_ENDED_EVENT = 'arkit-interruption-ended';
ARKitWrapper.SHOW_DEBUG_EVENT = 'arkit-show-debug';
ARKitWrapper.WINDOW_RESIZE_EVENT = 'arkit-window-resize';
ARKitWrapper.ON_ERROR = 'on-error';
ARKitWrapper.AR_TRACKING_CHANGED = 'ar_tracking_changed';
ARKitWrapper.COMPUTER_VISION_DATA = 'cv_data';
ARKitWrapper.USER_GRANTED_COMPUTER_VISION_DATA = 'user-granted-cv-data';
ARKitWrapper.USER_GRANTED_WORLD_SENSING_DATA = 'user-granted-world-sensing-data';

// ARKit Detection Image Orientations
ARKitWrapper.ORIENTATION_UP = 1; // 0th row at top,    0th column on left   - default orientation
ARKitWrapper.ORIENTATION_UP_MIRRORED = 2; // 0th row at top,    0th column on right  - horizontal flip
ARKitWrapper.ORIENTATION_DOWN = 3; // 0th row at bottom, 0th column on right  - 180 deg rotation
ARKitWrapper.ORIENTATION_DOWN_MIRRORED = 4; // 0th row at bottom, 0th column on left   - vertical flip
ARKitWrapper.ORIENTATION_LEFT_MIRRORED = 5; // 0th row on left,   0th column at top
ARKitWrapper.ORIENTATION_RIGHT = 6; // 0th row on right,  0th column at top    - 90 deg CW
ARKitWrapper.ORIENTATION_RIGHT_MIRRORED = 7; // 0th row on right,  0th column on bottom
ARKitWrapper.ORIENTATION_LEFT = 8; // 0th row on left,   0th column at bottom - 90 deg CCW

// world mapping status
ARKitWrapper.WEB_AR_WORLDMAPPING_NOT_AVAILABLE = "ar_worldmapping_not_available";
ARKitWrapper.WEB_AR_WORLDMAPPING_LIMITED = "ar_worldmapping_limited";
ARKitWrapper.WEB_AR_WORLDMAPPING_EXTENDING = "ar_worldmapping_extending";
ARKitWrapper.WEB_AR_WORLDMAPPING_MAPPED = "ar_worldmapping_mapped";

// hit test types
ARKitWrapper.HIT_TEST_TYPE_FEATURE_POINT = 1;
ARKitWrapper.HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE = 2;
ARKitWrapper.HIT_TEST_TYPE_ESTIMATED_VERTICAL_PLANE = 4;
ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE = 8;
ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT = 16;
ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE_USING_GEOMETRY = 32;

ARKitWrapper.HIT_TEST_TYPE_ALL = ARKitWrapper.HIT_TEST_TYPE_FEATURE_POINT | ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE | ARKitWrapper.HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE | ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT;

ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANES = ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE | ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT;

ARKitWrapper.ANCHOR_TYPE_PLANE = 'plane';
ARKitWrapper.ANCHOR_TYPE_FACE = 'face';
ARKitWrapper.ANCHOR_TYPE_ANCHOR = 'anchor';
ARKitWrapper.ANCHOR_TYPE_IMAGE = 'image';

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _EventHandlerBase2 = __webpack_require__(3);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

var _VirtualReality = __webpack_require__(26);

var _VirtualReality2 = _interopRequireDefault(_VirtualReality);

var _XRFieldOfView = __webpack_require__(16);

var _XRFieldOfView2 = _interopRequireDefault(_XRFieldOfView);

var _Reality = __webpack_require__(7);

var _Reality2 = _interopRequireDefault(_Reality);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
Each XRDisplay represents a method of using a specific type of hardware to render AR or VR realities and layers.

This doesn't yet support a geospatial coordinate system
*/
var XRDisplay = function (_EventHandlerBase) {
	_inherits(XRDisplay, _EventHandlerBase);

	function XRDisplay(xr, displayName, isExternal, reality) {
		_classCallCheck(this, XRDisplay);

		var _this = _possibleConstructorReturn(this, (XRDisplay.__proto__ || Object.getPrototypeOf(XRDisplay)).call(this));

		_this._xr = xr;
		_this._displayName = displayName;
		_this._isExternal = isExternal;
		_this._reality = reality; // The Reality instance that is currently displayed

		_this._headModelCoordinateSystem = new XRCoordinateSystem(_this, XRCoordinateSystem.HEAD_MODEL);
		_this._eyeLevelCoordinateSystem = new XRCoordinateSystem(_this, XRCoordinateSystem.EYE_LEVEL);
		_this._trackerCoordinateSystem = new XRCoordinateSystem(_this, XRCoordinateSystem.TRACKER);

		_this._headPose = new XRViewPose([0, XRViewPose.SITTING_EYE_HEIGHT, 0]);
		_this._eyeLevelPose = new XRViewPose([0, XRViewPose.SITTING_EYE_HEIGHT, 0]);
		_this._trackerPoseModelMatrix = _MatrixMath2.default.mat4_generateIdentity();

		_this._fovy = 70;
		var fov = _this._fovy / 2;
		_this._fov = new _XRFieldOfView2.default(fov, fov, fov, fov);
		_this._depthNear = 0.1;
		_this._depthFar = 1000;

		_this._views = [];
		return _this;
	}

	_createClass(XRDisplay, [{
		key: 'supportsSession',
		value: function supportsSession(parameters) {
			// parameters: XRSessionCreateParametersInit 
			// returns boolean
			return this._supportedCreationParameters(parameters);
		}
	}, {
		key: 'requestSession',
		value: function requestSession(parameters) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				if (_this2._supportedCreationParameters(parameters) === false) {
					reject();
					return;
				}
				if (parameters.type === XRSession.REALITY) {
					_this2._reality = new _VirtualReality2.default();
					_this2._xr._privateRealities.push(_this2._reality);
				}
				resolve(_this2._createSession(parameters));
			});
		}

		// no-op unless display supports it

	}, {
		key: '_requestVideoFrame',
		value: function _requestVideoFrame() {}
	}, {
		key: '_requestAnimationFrame',
		value: function _requestAnimationFrame(callback) {
			return window.requestAnimationFrame(callback);
		}
	}, {
		key: '_cancelAnimationFrame',
		value: function _cancelAnimationFrame(handle) {
			return window.cancelAnimationFrame(handle);
		}
	}, {
		key: '_createSession',
		value: function _createSession(parameters) {
			return new XRSession(this._xr, this, parameters);
		}
	}, {
		key: '_supportedCreationParameters',
		value: function _supportedCreationParameters(parameters) {
			// returns true if the parameters are supported by this display
			throw 'Should be implemented by extending class';
		}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame(frame) {}

		/*
  Called by a session after it has handed the XRPresentationFrame to the app
  Use this for any display submission calls that need to happen after the render has occurred.
  */

	}, {
		key: '_handleAfterFrame',
		value: function _handleAfterFrame(frame) {}

		/*
  Called by XRSession after the session.baseLayer is assigned a value
  */

	}, {
		key: '_handleNewBaseLayer',
		value: function _handleNewBaseLayer(baseLayer) {}

		//attribute EventHandler ondeactivate;

	}, {
		key: 'displayName',
		get: function get() {
			return this._displayName;
		}
	}, {
		key: 'isExternal',
		get: function get() {
			return this._isExternal;
		}
	}]);

	return XRDisplay;
}(_EventHandlerBase3.default);

exports.default = XRDisplay;


XRDisplay.VIDEO_FRAME = 'videoFrame';
XRDisplay.TRACKING_CHANGED = 'tracking-changed';
XRDisplay.NEW_WORLD_ANCHOR = 'world-anchor';
XRDisplay.UPDATE_WORLD_ANCHOR = 'update-world-anchor';
XRDisplay.REMOVE_WORLD_ANCHOR = 'remove-world-anchor';

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventHandlerBase2 = __webpack_require__(3);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
A Reality represents a view of the world, be it the real world via sensors or a virtual world that is rendered with WebGL or WebGPU.
*/
var Reality = function (_EventHandlerBase) {
	_inherits(Reality, _EventHandlerBase);

	function Reality(xr, name, isShared, isPassthrough) {
		_classCallCheck(this, Reality);

		var _this = _possibleConstructorReturn(this, (Reality.__proto__ || Object.getPrototypeOf(Reality)).call(this));

		_this._xr = xr;
		_this._name = name;
		_this._isShared = isShared;
		_this._isPassthrough = isPassthrough;
		_this._anchors = new Map();
		return _this;
	}

	_createClass(Reality, [{
		key: 'getCoordinateSystem',
		value: function getCoordinateSystem() {
			//XRCoordinateSystem? getCoordinateSystem(XRFrameOfReferenceType type, ...); // Tries the types in order, returning the first match or null if none is found
			throw new Error('Not implemented');
		}

		/*
  Called when at least one active XRSession is using this Reality
  */

	}, {
		key: '_start',
		value: function _start(parameters) {
			throw new Error('Extending classes should implement _start');
		}

		/*
  Called when no more active XRSessions are using this Reality
  */

	}, {
		key: '_stop',
		value: function _stop() {
			throw new Error('Extending classes should implement _stop');
		}

		/*
  Request another video frame be generated, typically from video-mixed Realities.
  */

	}, {
		key: '_requestVideoFrame',
		value: function _requestVideoFrame() {}

		/*
  Start or stop video frames
  */

	}, {
		key: '_stopVideoFrames',
		value: function _stopVideoFrames() {}
	}, {
		key: '_startVideoFrames',
		value: function _startVideoFrames() {}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame() {}

		/*
  Create an anchor hung in space
  */

	}, {
		key: '_addAnchor',
		value: function _addAnchor(anchor, display) {
			// returns DOMString anchor UID
			throw new Error('Extending classes should implement _addAnchor');
		}

		/*
  Create an anchor attached to a surface, as found by a ray
  returns a Promise that resolves either to an AnchorOffset or null if the hit test failed
  normalized screen x and y are in range 0..1, with 0,0 at top left and 1,1 at bottom right
  */

	}, {
		key: '_findAnchor',
		value: function _findAnchor(normalizedScreenX, normalizedScreenY, display) {
			throw new Error('Extending classes should implement _findAnchor');
		}
	}, {
		key: '_createImageAnchor',
		value: function _createImageAnchor(uid, buffer, width, height, physicalWidthInMeters) {
			throw new Error('Extending classes should implement _createImageAnchor');
		}
	}, {
		key: 'activateDetectionImage',
		value: function activateDetectionImage(uid, display) {
			throw new Error('Extending classes should implement _activateDetectionImage');
		}

		/*
  Find an XRAnchorOffset that is at floor level below the current head pose
  returns a Promise that resolves either to an AnchorOffset or null if the floor level is unknown
  */

	}, {
		key: '_findFloorAnchor',
		value: function _findFloorAnchor(display) {
			var uid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			throw new Error('Extending classes should implement _findFloorAnchor');
		}
	}, {
		key: '_getAnchor',
		value: function _getAnchor(uid) {
			return this._anchors.get(uid) || null;
		}
	}, {
		key: '_removeAnchor',
		value: function _removeAnchor(uid) {
			// returns void
			throw new Error('Extending classes should implement _removeAnchor');
		}
	}, {
		key: '_hitTestNoAnchor',
		value: function _hitTestNoAnchor(normalizedScreenX, normalizedScreenY, display) {
			throw new Error('Extending classes should implement _hitTestNoAnchor');
		}
	}, {
		key: '_getLightAmbientIntensity',
		value: function _getLightAmbientIntensity() {
			throw new Error('Extending classes should implement _getLightAmbientIntensity');
		}
	}, {
		key: '_getWorldMap',
		value: function _getWorldMap() {
			throw new Error('Extending classes should implement _getWorldMap');
		}
	}, {
		key: '_setWorldMap',
		value: function _setWorldMap(worldMap) {
			throw new Error('Extending classes should implement _setWorldMap');
		}
	}, {
		key: '_getWorldMappingStatus',
		value: function _getWorldMappingStatus() {
			throw new Error('Extending classes should implement _getWorldMappingStatus');
		}
		// attribute EventHandler onchange;

	}, {
		key: 'name',
		get: function get() {
			return this._name;
		}
	}, {
		key: 'isShared',
		get: function get() {
			return this._isShared;
		}
	}, {
		key: 'isPassthrough',
		get: function get() {
			return this._isPassthrough;
		}
	}]);

	return Reality;
}(_EventHandlerBase3.default);

exports.default = Reality;


Reality.COMPUTER_VISION_DATA = 'cv_data';
Reality.WINDOW_RESIZE_EVENT = 'window-resize';
Reality.NEW_WORLD_ANCHOR = 'world-anchor';
Reality.UPDATE_WORLD_ANCHOR = 'update-world-anchor';
Reality.REMOVE_WORLD_ANCHOR = 'remove-world-anchor';

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRAnchor2 = __webpack_require__(1);

var _XRAnchor3 = _interopRequireDefault(_XRAnchor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
XRFaceAnchor represents a face anchor
*/
var XRFaceAnchor = function (_XRAnchor) {
    _inherits(XRFaceAnchor, _XRAnchor);

    function XRFaceAnchor(coordinateSystem) {
        var uid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var geometry = arguments[2];
        var blendShapeArray = arguments[3];

        _classCallCheck(this, XRFaceAnchor);

        var _this = _possibleConstructorReturn(this, (XRFaceAnchor.__proto__ || Object.getPrototypeOf(XRFaceAnchor)).call(this, coordinateSystem, uid));

        _this.geometry = geometry;
        _this.blendShapes = {};
        _this.updateBlendShapes(blendShapeArray);
        return _this;
    }

    _createClass(XRFaceAnchor, [{
        key: "updateBlendShapes",
        value: function updateBlendShapes(blendShapeArray) {
            for (var i = 0; i < blendShapeNames.length; i++) {
                this.blendShapes[blendShapeNames[i]] = blendShapeArray[i];
            }
        }
    }]);

    return XRFaceAnchor;
}(_XRAnchor3.default);

exports.default = XRFaceAnchor;


var blendShapeNames = ["browDownLeft", "browDownRight", "browInnerUp", "browOuterUpLeft", "browOuterUpRight", "cheekPuff", "cheekSquintLeft", "cheekSquintRight", "eyeBlinkLeft", "eyeBlinkRight", "eyeLookDownLeft", "eyeLookDownRight", "eyeLookInLeft", "eyeLookInRight", "eyeLookOutLeft", "eyeLookOutRight", "eyeLookUpLeft", "eyeLookUpRight", "eyeSquintLeft", "eyeSquintRight", "eyeWideLeft", "eyeWideRight", "jawForward", "jawLeft", "jawOpen", "jawRight", "mouthClose", "mouthDimpleLeft", "mouthDimpleRight", "mouthFrownLeft", "mouthFrownRight", "mouthFunnel", "mouthLeft", "mouthLowerDownLeft", "mouthLowerDownRight", "mouthPressLeft", "mouthPressRight", "mouthPucker", "mouthRight", "mouthRollLower", "mouthRollUpper", "mouthShrugLower", "mouthShrugUpper", "mouthSmileLeft", "mouthSmileRight", "mouthStretchLeft", "mouthStretchRight", "mouthUpperUpLeft", "mouthUpperUpRight", "noseSneerLeft", "noseSneerRight"];

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _XRAnchor2 = __webpack_require__(1);

var _XRAnchor3 = _interopRequireDefault(_XRAnchor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
XRFaceAnchor represents an anchor
*/
var XRImageAnchor = function (_XRAnchor) {
    _inherits(XRImageAnchor, _XRAnchor);

    function XRImageAnchor(coordinateSystem) {
        var uid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, XRImageAnchor);

        return _possibleConstructorReturn(this, (XRImageAnchor.__proto__ || Object.getPrototypeOf(XRImageAnchor)).call(this, coordinateSystem, uid));
    }

    return XRImageAnchor;
}(_XRAnchor3.default);

exports.default = XRImageAnchor;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRAnchor2 = __webpack_require__(1);

var _XRAnchor3 = _interopRequireDefault(_XRAnchor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
XRPlaneAnchor represents a flat surfaces like floors, table tops, or walls.
*/
var XRPlaneAnchor = function (_XRAnchor) {
	_inherits(XRPlaneAnchor, _XRAnchor);

	function XRPlaneAnchor(coordinateSystem) {
		var uid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		var center = arguments[2];
		var extent = arguments[3];
		var alignment = arguments[4];
		var geometry = arguments[5];

		_classCallCheck(this, XRPlaneAnchor);

		var _this = _possibleConstructorReturn(this, (XRPlaneAnchor.__proto__ || Object.getPrototypeOf(XRPlaneAnchor)).call(this, coordinateSystem, uid));

		_this.center = center;
		_this.extent = extent;
		_this.alignment = alignment;
		_this.geometry = geometry;
		return _this;
	}

	_createClass(XRPlaneAnchor, [{
		key: 'width',
		get: function get() {
			//readonly attribute double width;
			throw 'Not implemented';
		}
	}, {
		key: 'length',
		get: function get() {
			//readonly attribute double length;
			throw 'Not implemented';
		}
	}]);

	return XRPlaneAnchor;
}(_XRAnchor3.default);

exports.default = XRPlaneAnchor;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventHandlerBase2 = __webpack_require__(3);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _XRDisplay = __webpack_require__(6);

var _XRDisplay2 = _interopRequireDefault(_XRDisplay);

var _XRFaceAnchor = __webpack_require__(8);

var _XRFaceAnchor2 = _interopRequireDefault(_XRFaceAnchor);

var _XRImageAnchor = __webpack_require__(9);

var _XRImageAnchor2 = _interopRequireDefault(_XRImageAnchor);

var _XRAnchor = __webpack_require__(1);

var _XRAnchor2 = _interopRequireDefault(_XRAnchor);

var _ARKitWrapper = __webpack_require__(5);

var _ARKitWrapper2 = _interopRequireDefault(_ARKitWrapper);

var _XRPlaneAnchor = __webpack_require__(10);

var _XRPlaneAnchor2 = _interopRequireDefault(_XRPlaneAnchor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
A script that wishes to make use of an XRDisplay can request an XRSession.
An XRSession provides a list of the available Reality instances that the script may request as well as make a request for an animation frame.
*/
var XRSession = function (_EventHandlerBase) {
	_inherits(XRSession, _EventHandlerBase);

	function XRSession(xr, display, createParameters) {
		_classCallCheck(this, XRSession);

		var _this = _possibleConstructorReturn(this, (XRSession.__proto__ || Object.getPrototypeOf(XRSession)).call(this, xr));

		_this._xr = xr;
		_this._display = display;
		_this._createParameters = createParameters;
		_this._ended = false;

		_this._baseLayer = null;
		_this._stageBounds = null;

		_this._skip = false;

		_this._frameAnchors = [];
		_this._tempMatrix = _MatrixMath2.default.mat4_generateIdentity();
		_this._tempMatrix2 = _MatrixMath2.default.mat4_generateIdentity();

		_this._display.addEventListener(_XRDisplay2.default.TRACKING_CHANGED, _this._handleTrackingChanged.bind(_this));
		_this._display.addEventListener(_XRDisplay2.default.NEW_WORLD_ANCHOR, _this._handleNewWorldAnchor.bind(_this));
		_this._display.addEventListener(_XRDisplay2.default.REMOVE_WORLD_ANCHOR, _this._handleRemoveWorldAnchor.bind(_this));
		_this._display.addEventListener(_XRDisplay2.default.UPDATE_WORLD_ANCHOR, _this._handleUpdateWorldAnchor.bind(_this));
		return _this;
	}

	_createClass(XRSession, [{
		key: 'requestFrame',
		value: function requestFrame(callback) {
			if (this._ended) return null;
			if (typeof callback !== 'function') {
				throw 'Invalid callback';
			}
			return this._handleRequestFrame(callback);
		}
	}, {
		key: '_handleRequestFrame',
		value: function _handleRequestFrame(callback) {
			var _this2 = this;

			return this._display._requestAnimationFrame(function (timestamp) {
				if (_this2._skip) {
					_this2._skip = false;
					return _this2._handleRequestFrame(callback);
				}
				//this._skip = true;  // try skipping every second raf
				var frame = _this2._createPresentationFrame(timestamp);
				_this2._updateCameraAnchor(frame);

				_this2._display._reality._handleNewFrame(frame);
				_this2._display._handleNewFrame(frame);
				callback(frame);
				_this2._display._handleAfterFrame(frame);
			});
		}
	}, {
		key: 'cancelFrame',
		value: function cancelFrame(handle) {
			return this._display._cancelAnimationFrame(handle);
		}
	}, {
		key: 'end',
		value: function end() {
			if (this._ended) return;
			for (var i = 0; i < this._frameAnchors.length; i++) {
				this._display._reality._removeAnchor(this._frameAnchors[i].uid);
			}
			this._frameAnchors = [];
			this._ended = true;
			this._display._stop();
			return new Promise(function (resolve, reject) {
				resolve();
			});
		}
	}, {
		key: '_updateCameraAnchor',
		value: function _updateCameraAnchor(frame) {
			// new anchor each minute
			if (this._frameAnchors.length == 0 || this._frameAnchors[0].timestamp + 1000 < frame.timestamp) {
				var headCoordinateSystem = frame.getCoordinateSystem(XRCoordinateSystem.EYE_LEVEL);
				var anchorUID = frame.addAnchor(headCoordinateSystem, [0, -1, 0], [0, 0, 0, 1], 'cameraAnchor-' + new Date().getTime() + '-' + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
				var anchor = frame.getAnchor(anchorUID);
				anchor.timestamp = frame.timestamp;
				this._frameAnchors.unshift(anchor);

				if (this._frameAnchors.length > 5) {
					var oldAnchor = this._frameAnchors.pop();
					this._display._reality._removeAnchor(oldAnchor.uid);
				}
				return anchor;
			} else {
				return this._frameAnchors[0];
			}
		}
	}, {
		key: '_transformToCameraAnchor',
		value: function _transformToCameraAnchor(camera) {
			if (this._frameAnchors.length == 0) return camera.viewMatrix;

			var matrix = camera.viewMatrix;
			camera._anchorUid = this._frameAnchors[0].uid;

			var anchorCoords = this._frameAnchors[0].coordinateSystem;

			// should only have to invert anchor coords, but we're sending in the inverse
			// of the camera pose ...

			// get world to anchor by inverting anchor to world
			_MatrixMath2.default.mat4_invert(this._tempMatrix, anchorCoords._poseModelMatrix);

			// get camera to world by inverting world to camera
			// MatrixMath.mat4_invert(this._tempMatrix2, matrix)
			// MatrixMath.mat4_multiply(camera.viewMatrix, this._tempMatrix, this._tempMatrix2)
			_MatrixMath2.default.mat4_multiply(camera.viewMatrix, this._tempMatrix, matrix);
		}
	}, {
		key: 'setVideoFrameHandler',
		value: function setVideoFrameHandler(callback) {
			var _this3 = this;

			if (callback instanceof Worker) {
				var worker = callback;
				callback = function callback(ev) {
					// var cv = ev.detail
					// var buffers = cv.frame.buffers
					// var buffs = []
					// for (var i = 0; i < buffers.length; i++) {
					// 	buffs.push(buffers[i].buffer)
					// }
					// worker.postMessage(cv, buffs);
					_this3._transformToCameraAnchor(ev.detail.camera);
					ev.detail.postMessageToWorker(worker, { type: "newVideoFrame" });
					ev.detail.release();
				};
			} else {
				var originalCallback = callback;
				callback = function callback(ev) {
					_this3._transformToCameraAnchor(ev.detail.camera);
					originalCallback(ev);
				};
			}
			this._display.addEventListener("videoFrame", callback);
		}
	}, {
		key: 'getVideoFramePose',
		value: function getVideoFramePose(videoFrame, poseOut) {
			if (!videoFrame.camera._anchorUid) return;

			var anchorPose;
			var anchor = this.reality._getAnchor(videoFrame.camera._anchorUid);
			if (anchor) {
				anchorPose = anchor.coordinateSystem._poseModelMatrix;
			} else {
				var i = 0;
				for (; i < this._frameAnchors.length; i++) {
					if (videoFrame.camera._anchorUid == this._frameAnchors[i].uid) {
						anchorPose = this._frameAnchors[i].coordinateSystem._poseModelMatrix;
						break;
					}
				}

				if (i == this._frameAnchors.length) {
					// shouldn't happen!
					console.warn("should never get here: session.getVideoFramePose can't find anchor");
					return;
				}
			}
			_MatrixMath2.default.mat4_multiply(poseOut, anchorPose, videoFrame.camera.viewMatrix);
		}

		// normalized screen x and y are in range 0..1, with 0,0 at top left and 1,1 at bottom right

	}, {
		key: 'hitTest',
		value: function hitTest(normalizedScreenX, normalizedScreenY) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			// Promise<XRAnchorOffset?> findAnchor(float32, float32); // cast a ray to find or create an anchor at the first intersection in the Reality
			return this.reality._findAnchor(normalizedScreenX, normalizedScreenY, this.display, options);
		}
	}, {
		key: 'requestVideoFrame',
		value: function requestVideoFrame() {
			this._display._requestVideoFrame();
		}
	}, {
		key: 'stopVideoFrames',
		value: function stopVideoFrames() {
			this._display._stopVideoFrames();
		}
	}, {
		key: 'startVideoFrames',
		value: function startVideoFrames() {
			this._display._startVideoFrames();
		}
	}, {
		key: '_createPresentationFrame',
		value: function _createPresentationFrame(timestamp) {
			return new XRPresentationFrame(this, timestamp);
		}
	}, {
		key: '_getCoordinateSystem',
		value: function _getCoordinateSystem() {
			for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
				types[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var type = _step.value;

					switch (type) {
						case XRCoordinateSystem.HEAD_MODEL:
							return this._display._headModelCoordinateSystem;
						case XRCoordinateSystem.EYE_LEVEL:
							return this._display._eyeLevelCoordinateSystem;
						case XRCoordinateSystem.TRACKER:
							return this._display._trackerCoordinateSystem;
						case XRCoordinateSystem.GEOSPATIAL:
						// Not supported yet
						default:
							continue;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return null;
		}
	}, {
		key: 'createImageAnchor',
		value: function createImageAnchor(uid, buffer, width, height, physicalWidthInMeters) {
			return this.reality._createImageAnchor(uid, buffer, width, height, physicalWidthInMeters);
		}
	}, {
		key: 'activateDetectionImage',
		value: function activateDetectionImage(uid) {
			return this.reality._activateDetectionImage(uid, this._display);
		}
	}, {
		key: '_handleNewWorldAnchor',
		value: function _handleNewWorldAnchor(event) {
			var xrAnchor = event.detail;
			//console.log(`New world anchor: ${JSON.stringify(xrAnchor)}`)

			if (!xrAnchor.uid.startsWith('cameraAnchor-')) {
				try {
					this.dispatchEvent(new CustomEvent(XRSession.NEW_WORLD_ANCHOR, {
						source: this,
						detail: xrAnchor
					}));
				} catch (e) {
					console.error('NEW_WORLD_ANCHOR event error', e);
				}
			} else {
				// console.log('not passing NEW_WORLD_ANCHOR event to app for ', xrAnchor.uid)
			}
		}
	}, {
		key: '_handleUpdateWorldAnchor',
		value: function _handleUpdateWorldAnchor(event) {
			var xrAnchor = event.detail;
			//console.log(`New world anchor: ${JSON.stringify(xrAnchor)}`)

			try {
				this.dispatchEvent(new CustomEvent(XRSession.UPDATE_WORLD_ANCHOR, {
					source: this,
					detail: xrAnchor
				}));
			} catch (e) {
				console.error('UPDATE_WORLD_ANCHOR event error', e);
			}
		}
	}, {
		key: '_handleRemoveWorldAnchor',
		value: function _handleRemoveWorldAnchor(event) {
			var xrAnchor = event.detail;
			//console.log(`Remove world anchor: ${JSON.stringify(xrAnchor)}`)

			try {
				this.dispatchEvent(new CustomEvent(XRSession.REMOVE_WORLD_ANCHOR, {
					source: this,
					detail: xrAnchor
				}));
			} catch (e) {
				console.error('REMOVE_WORLD_ANCHOR event error', e);
			}
		}
	}, {
		key: '_handleTrackingChanged',
		value: function _handleTrackingChanged(event) {
			try {
				this.dispatchEvent(new CustomEvent(XRSession.TRACKING_CHANGED, {
					source: this,
					detail: event.detail
				}));
			} catch (e) {
				console.error('TRACKING_CHANGED event error', e);
			}
		}
	}, {
		key: 'getWorldMap',
		value: function getWorldMap() {
			return this.reality._getWorldMap();
		}
	}, {
		key: 'setWorldMap',
		value: function setWorldMap(worldMap) {
			return this.reality._setWorldMap(worldMap);
		}
	}, {
		key: 'getWorldMappingStatus',
		value: function getWorldMappingStatus() {
			return this.reality._getWorldMappingStatus();
		}
		/*
  attribute EventHandler onblur;
  attribute EventHandler onfocus;
  attribute EventHandler onresetpose;
  attribute EventHandler onrealitychanged;
  attribute EventHandler onrealityconnect;
  attribute EventHandler onrealitydisconnect;
  attribute EventHandler onboundschange;
  attribute EventHandler onended;
  */

	}, {
		key: 'display',
		get: function get() {
			return this._display;
		}
	}, {
		key: 'createParameters',
		get: function get() {
			return this._parameters;
		}
	}, {
		key: 'realities',
		get: function get() {
			return this._xr._sharedRealities;
		}
	}, {
		key: 'reality',
		get: function get() {
			return this._display._reality;
		}
	}, {
		key: 'baseLayer',
		get: function get() {
			return this._baseLayer;
		},
		set: function set(value) {
			this._baseLayer = value;
			this._display._handleNewBaseLayer(this._baseLayer);
		}
	}, {
		key: 'depthNear',
		get: function get() {
			this._display._depthNear;
		},
		set: function set(value) {
			this._display._depthNear = value;
		}
	}, {
		key: 'depthFar',
		get: function get() {
			this._display._depthFar;
		},
		set: function set(value) {
			this._display._depthFar = value;
		}
	}, {
		key: 'hasStageBounds',
		get: function get() {
			this._stageBounds !== null;
		}
	}, {
		key: 'stageBounds',
		get: function get() {
			return this._stageBounds;
		}
	}]);

	return XRSession;
}(_EventHandlerBase3.default);

exports.default = XRSession;


XRSession.REALITY = 'reality';
XRSession.AUGMENTATION = 'augmentation';

XRSession.TYPES = [XRSession.REALITY, XRSession.AUGMENTATION];

XRSession.TRACKING_CHANGED = 'tracking-changed';

XRSession.NEW_WORLD_ANCHOR = 'world-anchor';
XRSession.UPDATE_WORLD_ANCHOR = 'update-world-anchor';
XRSession.REMOVE_WORLD_ANCHOR = 'remove-world-anchor';

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEach = exports.sqrLen = exports.len = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = undefined;
exports.create = create;
exports.clone = clone;
exports.length = length;
exports.fromValues = fromValues;
exports.copy = copy;
exports.set = set;
exports.add = add;
exports.subtract = subtract;
exports.multiply = multiply;
exports.divide = divide;
exports.ceil = ceil;
exports.floor = floor;
exports.min = min;
exports.max = max;
exports.round = round;
exports.scale = scale;
exports.scaleAndAdd = scaleAndAdd;
exports.distance = distance;
exports.squaredDistance = squaredDistance;
exports.squaredLength = squaredLength;
exports.negate = negate;
exports.inverse = inverse;
exports.normalize = normalize;
exports.dot = dot;
exports.cross = cross;
exports.lerp = lerp;
exports.hermite = hermite;
exports.bezier = bezier;
exports.random = random;
exports.transformMat4 = transformMat4;
exports.transformMat3 = transformMat3;
exports.transformQuat = transformQuat;
exports.rotateX = rotateX;
exports.rotateY = rotateY;
exports.rotateZ = rotateZ;
exports.angle = angle;
exports.str = str;
exports.exactEquals = exactEquals;
exports.equals = equals;

var _common = __webpack_require__(4);

var glMatrix = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
  var out = new glMatrix.ARRAY_TYPE(3);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
  var out = new glMatrix.ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}

/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
}

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
function random(out, scale) {
  scale = scale || 1.0;

  var r = glMatrix.RANDOM() * 2.0 * Math.PI;
  var z = glMatrix.RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;

  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
function transformQuat(out, a, q) {
  // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

  var x = a[0],
      y = a[1],
      z = a[2];
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];

  // calculate quat * vec
  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return out;
}

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateX(out, a, b, c) {
  var p = [],
      r = [];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0];
  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateY(out, a, b, c) {
  var p = [],
      r = [];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateZ(out, a, b, c) {
  var p = [],
      r = [];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
  r[2] = p[2];

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
function angle(a, b) {
  var tempA = fromValues(a[0], a[1], a[2]);
  var tempB = fromValues(b[0], b[1], b[2]);

  normalize(tempA, tempA);
  normalize(tempB, tempB);

  var cosine = dot(tempA, tempB);

  if (cosine > 1.0) {
    return 0;
  } else if (cosine < -1.0) {
    return Math.PI;
  } else {
    return Math.acos(cosine);
  }
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
var sub = exports.sub = subtract;

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
var mul = exports.mul = multiply;

/**
 * Alias for {@link vec3.divide}
 * @function
 */
var div = exports.div = divide;

/**
 * Alias for {@link vec3.distance}
 * @function
 */
var dist = exports.dist = distance;

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
var sqrDist = exports.sqrDist = squaredDistance;

/**
 * Alias for {@link vec3.length}
 * @function
 */
var len = exports.len = length;

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
var sqrLen = exports.sqrLen = squaredLength;

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
var forEach = exports.forEach = function () {
  var vec = create();

  return function (a, stride, offset, count, fn, arg) {
    var i = void 0,
        l = void 0;
    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];vec[1] = a[i + 1];vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];a[i + 1] = vec[1];a[i + 2] = vec[2];
    }

    return a;
  };
}();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRViewport = __webpack_require__(22);

var _XRViewport2 = _interopRequireDefault(_XRViewport);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
An XRView describes a single view into an XR scene.
It provides several values directly, and acts as a key to query view-specific values from other interfaces.
*/
var XRView = function () {
	function XRView(fov, depthNear, depthFar) {
		var eye = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		_classCallCheck(this, XRView);

		this._fov = fov;
		this._depthNear = depthNear;
		this._depthFar = depthFar;
		this._eye = eye;
		this._viewport = new _XRViewport2.default(0, 0, 1, 1);
		this._projectionMatrix = new Float32Array(16);
		this._viewMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
		_MatrixMath2.default.mat4_perspectiveFromFieldOfView(this._projectionMatrix, this._fov, this._depthNear, this._depthFar);
	}

	_createClass(XRView, [{
		key: 'setProjectionMatrix',
		value: function setProjectionMatrix(array16) {
			for (var i = 0; i < 16; i++) {
				this._projectionMatrix[i] = array16[i];
			}
		}
	}, {
		key: 'setViewMatrix',
		value: function setViewMatrix(array16) {
			for (var i = 0; i < 16; i++) {
				this._viewMatrix[i] = array16[i];
			}
		}
	}, {
		key: 'getViewport',
		value: function getViewport(layer) {
			if (this._eye === XRView.LEFT) {
				this._viewport.x = 0;
				this._viewport.y = 0;
				this._viewport.width = layer.framebufferWidth / 2;
				this._viewport.height = layer.framebufferHeight;
			} else if (this._eye === XRView.RIGHT) {
				this._viewport.x = layer.framebufferWidth / 2;
				this._viewport.y = 0;
				this._viewport.width = layer.framebufferWidth / 2;
				this._viewport.height = layer.framebufferHeight;
			} else {
				this._viewport.x = 0;
				this._viewport.y = 0;
				this._viewport.width = layer.framebufferWidth;
				this._viewport.height = layer.framebufferHeight;
			}
			return this._viewport;
		}
	}, {
		key: 'fov',
		set: function set(value) {
			this._fov = value;
			_MatrixMath2.default.mat4_perspectiveFromFieldOfView(this._projectionMatrix, this._fov, this._depthNear, this._depthFar);
		}
	}, {
		key: 'eye',
		get: function get() {
			return this._eye;
		}
	}, {
		key: 'projectionMatrix',
		get: function get() {
			return this._projectionMatrix;
		}
	}, {
		key: 'viewMatrix',
		get: function get() {
			return this._viewMatrix;
		}
	}]);

	return XRView;
}();

exports.default = XRView;


XRView.LEFT = 'left';
XRView.RIGHT = 'right';
XRView.EYES = [XRView.LEFT, XRView.RIGHT];

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _Quaternion = __webpack_require__(2);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRDevicePose describes the position and orientation of an XRDisplay relative to the query XRCoordinateSystem.
It also describes the view and projection matrices that should be used by the application to render a frame of the XR scene.
*/
var XRViewPose = function () {
	function XRViewPose() {
		var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0];
		var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0, 1];

		_classCallCheck(this, XRViewPose);

		this._poseModelMatrix = new Float32Array(16);
		_MatrixMath2.default.mat4_fromRotationTranslation(this._poseModelMatrix, orientation, position);
	}

	_createClass(XRViewPose, [{
		key: '_setPoseModelMatrix',
		value: function _setPoseModelMatrix(array16) {
			for (var i = 0; i < 16; i++) {
				this._poseModelMatrix[i] = array16[i];
			}
		}
	}, {
		key: '_translate',
		value: function _translate(array3) {
			this._poseModelMatrix[12] += array3[0];
			this._poseModelMatrix[13] += array3[1];
			this._poseModelMatrix[14] += array3[2];
		}
	}, {
		key: 'getViewMatrix',
		value: function getViewMatrix(view) {
			var out = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (out === null) {
				out = new Float32Array(16);
			}
			_MatrixMath2.default.mat4_eyeView(out, this._poseModelMatrix); // TODO offsets
			return out;
		}
	}, {
		key: 'poseModelMatrix',
		get: function get() {
			return this._poseModelMatrix;
		}
	}, {
		key: '_position',
		get: function get() {
			return [this._poseModelMatrix[12], this._poseModelMatrix[13], this._poseModelMatrix[14]];
		},
		set: function set(array3) {
			this._poseModelMatrix[12] = array3[0];
			this._poseModelMatrix[13] = array3[1];
			this._poseModelMatrix[14] = array3[2];
		}
	}, {
		key: '_orientation',
		get: function get() {
			var quat = new _Quaternion2.default();
			quat.setFromRotationMatrix(this._poseModelMatrix);
			return quat.toArray();
		},
		set: function set(array4) {
			_MatrixMath2.default.mat4_fromRotationTranslation(this._poseModelMatrix, array4, this._position);
		}
	}]);

	return XRViewPose;
}();

// We are not going to use this any more.  The way it was handled was broken, we'll just
// use the raw values for the coordinate systems.


exports.default = XRViewPose;
XRViewPose.SITTING_EYE_HEIGHT = 0; // meters

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Vector3 wraps a vector of length 3, often used as a position in 3D space.

Taken from https://github.com/googlevr/webvr-polyfill/blob/master/src/math-util.js which took it from Three.js
*/
var Vector3 = function () {
	function Vector3() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		_classCallCheck(this, Vector3);

		this.x = x;
		this.y = y;
		this.z = z;
	}

	_createClass(Vector3, [{
		key: "set",
		value: function set(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;
			return this;
		}
	}, {
		key: "copy",
		value: function copy(v) {
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
			return this;
		}
	}, {
		key: "toArray",
		value: function toArray() {
			return [this.x, this.y, this.z];
		}
	}, {
		key: "length",
		value: function length() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		}
	}, {
		key: "add",
		value: function add(x, y, z) {
			this.x += x;
			this.y += y;
			this.z += z;
		}
	}, {
		key: "normalize",
		value: function normalize() {
			var scalar = this.length();
			if (scalar !== 0) {
				this.multiplyScalar(1 / scalar);
			} else {
				this.x = 0;
				this.y = 0;
				this.z = 0;
			}
			return this;
		}
	}, {
		key: "multiplyScalar",
		value: function multiplyScalar(scalar) {
			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
		}
	}, {
		key: "applyQuaternion",
		value: function applyQuaternion(q) {
			var x = this.x;
			var y = this.y;
			var z = this.z;

			var qx = q.x;
			var qy = q.y;
			var qz = q.z;
			var qw = q.w;

			// calculate quat * vector
			var ix = qw * x + qy * z - qz * y;
			var iy = qw * y + qz * x - qx * z;
			var iz = qw * z + qx * y - qy * x;
			var iw = -qx * x - qy * y - qz * z;

			// calculate result * inverse quat
			this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

			return this;
		}
	}, {
		key: "applyMatrix4",
		value: function applyMatrix4(matrix) {
			var x = this.x;
			var y = this.y;
			var z = this.z;
			var w = 1 / (matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15]);
			this.x = (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) * w;
			this.y = (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) * w;
			this.z = (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) * w;
			return this;
		}
	}, {
		key: "dot",
		value: function dot(v) {
			return this.x * v.x + this.y * v.y + this.z * v.z;
		}
	}, {
		key: "crossVectors",
		value: function crossVectors(a, b) {
			var ax = a.x,
			    ay = a.y,
			    az = a.z;
			var bx = b.x,
			    by = b.y,
			    bz = b.z;
			this.x = ay * bz - az * by;
			this.y = az * bx - ax * bz;
			this.z = ax * by - ay * bx;
			return this;
		}
	}]);

	return Vector3;
}();

exports.default = Vector3;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRFieldOFView represents the four boundaries of a camera's field of view: up, down, left, and right.
*/
var XRFieldOfView = function () {
	function XRFieldOfView(upDegrees, downDegrees, leftDegrees, rightDegrees) {
		_classCallCheck(this, XRFieldOfView);

		this._upDegrees = upDegrees;
		this._downDegrees = downDegrees;
		this._leftDegrees = leftDegrees;
		this._rightDegrees = rightDegrees;
	}

	_createClass(XRFieldOfView, [{
		key: "upDegrees",
		get: function get() {
			return this._upDegrees;
		}
	}, {
		key: "downDegrees",
		get: function get() {
			return this._downDegrees;
		}
	}, {
		key: "leftDegrees",
		get: function get() {
			return this._leftDegrees;
		}
	}, {
		key: "rightDegrees",
		get: function get() {
			return this._rightDegrees;
		}
	}]);

	return XRFieldOfView;
}();

exports.default = XRFieldOfView;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sub = exports.mul = undefined;
exports.create = create;
exports.clone = clone;
exports.copy = copy;
exports.fromValues = fromValues;
exports.set = set;
exports.identity = identity;
exports.transpose = transpose;
exports.invert = invert;
exports.adjoint = adjoint;
exports.determinant = determinant;
exports.multiply = multiply;
exports.translate = translate;
exports.scale = scale;
exports.rotate = rotate;
exports.rotateX = rotateX;
exports.rotateY = rotateY;
exports.rotateZ = rotateZ;
exports.fromTranslation = fromTranslation;
exports.fromScaling = fromScaling;
exports.fromRotation = fromRotation;
exports.fromXRotation = fromXRotation;
exports.fromYRotation = fromYRotation;
exports.fromZRotation = fromZRotation;
exports.fromRotationTranslation = fromRotationTranslation;
exports.getTranslation = getTranslation;
exports.getScaling = getScaling;
exports.getRotation = getRotation;
exports.fromRotationTranslationScale = fromRotationTranslationScale;
exports.fromRotationTranslationScaleOrigin = fromRotationTranslationScaleOrigin;
exports.fromQuat = fromQuat;
exports.frustum = frustum;
exports.perspective = perspective;
exports.perspectiveFromFieldOfView = perspectiveFromFieldOfView;
exports.ortho = ortho;
exports.lookAt = lookAt;
exports.targetTo = targetTo;
exports.str = str;
exports.frob = frob;
exports.add = add;
exports.subtract = subtract;
exports.multiplyScalar = multiplyScalar;
exports.multiplyScalarAndAdd = multiplyScalarAndAdd;
exports.exactEquals = exactEquals;
exports.equals = equals;

var _common = __webpack_require__(4);

var glMatrix = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 4x4 Matrix
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
  var out = new glMatrix.ARRAY_TYPE(16);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new glMatrix.ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}

/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];

    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];

  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];

  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];

  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}

/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];

  // Cache only the current line of the second matrix
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[4];b1 = b[5];b2 = b[6];b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[8];b1 = b[9];b2 = b[10];b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[12];b1 = b[13];b2 = b[14];b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00 = void 0,
      a01 = void 0,
      a02 = void 0,
      a03 = void 0;
  var a10 = void 0,
      a11 = void 0,
      a12 = void 0,
      a13 = void 0;
  var a20 = void 0,
      a21 = void 0,
      a22 = void 0,
      a23 = void 0;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
    a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
    a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

    out[0] = a00;out[1] = a01;out[2] = a02;out[3] = a03;
    out[4] = a10;out[5] = a11;out[6] = a12;out[7] = a13;
    out[8] = a20;out[9] = a21;out[10] = a22;out[11] = a23;

    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}

/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];

  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.sqrt(x * x + y * y + z * z);
  var s = void 0,
      c = void 0,
      t = void 0;
  var a00 = void 0,
      a01 = void 0,
      a02 = void 0,
      a03 = void 0;
  var a10 = void 0,
      a11 = void 0,
      a12 = void 0,
      a13 = void 0;
  var a20 = void 0,
      a21 = void 0,
      a22 = void 0,
      a23 = void 0;
  var b00 = void 0,
      b01 = void 0,
      b02 = void 0;
  var b10 = void 0,
      b11 = void 0,
      b12 = void 0;
  var b20 = void 0,
      b21 = void 0,
      b22 = void 0;

  if (Math.abs(len) < glMatrix.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
  a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
  a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c;b01 = y * x * t + z * s;b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;b11 = y * y * t + c;b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;b21 = y * z * t - x * s;b22 = z * z * t + c;

  // Perform rotation-specific matrix multiplication
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function fromRotation(out, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.sqrt(x * x + y * y + z * z);
  var s = void 0,
      c = void 0,
      t = void 0;

  if (Math.abs(len) < glMatrix.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  // Perform rotation-specific matrix multiplication
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;

  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];

  return out;
}

/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];

  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

  return out;
}

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
function getRotation(out, mat) {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  var trace = mat[0] + mat[5] + mat[10];
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (mat[6] - mat[9]) / S;
    out[1] = (mat[8] - mat[2]) / S;
    out[2] = (mat[1] - mat[4]) / S;
  } else if (mat[0] > mat[5] && mat[0] > mat[10]) {
    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S;
    out[0] = 0.25 * S;
    out[1] = (mat[1] + mat[4]) / S;
    out[2] = (mat[8] + mat[2]) / S;
  } else if (mat[5] > mat[10]) {
    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S;
    out[0] = (mat[1] + mat[4]) / S;
    out[1] = 0.25 * S;
    out[2] = (mat[6] + mat[9]) / S;
  } else {
    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S;
    out[0] = (mat[8] + mat[2]) / S;
    out[1] = (mat[6] + mat[9]) / S;
    out[2] = 0.25 * S;
  }

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;

  var sx = s[0];
  var sy = s[1];
  var sz = s[2];

  var ox = o[0];
  var oy = o[1];
  var oz = o[2];

  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;

  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;

  return out;
}

/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */
function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;

  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;

  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;

  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;

  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2);
  var nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);

  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function ortho(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis. 
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
  var x0 = void 0,
      x1 = void 0,
      x2 = void 0,
      y0 = void 0,
      y1 = void 0,
      y2 = void 0,
      z0 = void 0,
      z1 = void 0,
      z2 = void 0,
      len = void 0;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < glMatrix.EPSILON && Math.abs(eyey - centery) < glMatrix.EPSILON && Math.abs(eyez - centerz) < glMatrix.EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function targetTo(out, eye, target, up) {
  var eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];

  var z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];

  var len = z0 * z0 + z1 * z1 + z2 * z2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  var x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;

  len = x0 * x0 + x1 * x1 + x2 * x2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
}

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
}

/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}

/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];

  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
var mul = exports.mul = multiply;

/**
 * Alias for {@link mat4.subtract}
 * @function
 */
var sub = exports.sub = subtract;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAxes = exports.sqlerp = exports.rotationTo = exports.equals = exports.exactEquals = exports.normalize = exports.sqrLen = exports.squaredLength = exports.len = exports.length = exports.lerp = exports.dot = exports.scale = exports.mul = exports.add = exports.set = exports.copy = exports.fromValues = exports.clone = undefined;
exports.create = create;
exports.identity = identity;
exports.setAxisAngle = setAxisAngle;
exports.getAxisAngle = getAxisAngle;
exports.multiply = multiply;
exports.rotateX = rotateX;
exports.rotateY = rotateY;
exports.rotateZ = rotateZ;
exports.calculateW = calculateW;
exports.slerp = slerp;
exports.invert = invert;
exports.conjugate = conjugate;
exports.fromMat3 = fromMat3;
exports.fromEuler = fromEuler;
exports.str = str;

var _common = __webpack_require__(4);

var glMatrix = _interopRequireWildcard(_common);

var _mat = __webpack_require__(27);

var mat3 = _interopRequireWildcard(_mat);

var _vec = __webpack_require__(12);

var vec3 = _interopRequireWildcard(_vec);

var _vec2 = __webpack_require__(28);

var vec4 = _interopRequireWildcard(_vec2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

function create() {
  var out = new glMatrix.ARRAY_TYPE(4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */
function getAxisAngle(out_axis, q) {
  var rad = Math.acos(q[3]) * 2.0;
  var s = Math.sin(rad / 2.0);
  if (s != 0.0) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
}

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
function multiply(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];

  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateX(out, a, rad) {
  rad *= 0.5;

  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = Math.sin(rad),
      bw = Math.cos(rad);

  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateY(out, a, rad) {
  rad *= 0.5;

  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var by = Math.sin(rad),
      bw = Math.cos(rad);

  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateZ(out, a, rad) {
  rad *= 0.5;

  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bz = Math.sin(rad),
      bw = Math.cos(rad);

  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
function calculateW(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2];

  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];

  var omega = void 0,
      cosom = void 0,
      sinom = void 0,
      scale0 = void 0,
      scale1 = void 0;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  // calculate coefficients
  if (1.0 - cosom > 0.000001) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
function invert(out, a) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot ? 1.0 / dot : 0;

  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot = void 0;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;

    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}

/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */
function fromEuler(out, x, y, z) {
  var halfToRad = 0.5 * Math.PI / 180.0;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;

  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);

  out[0] = sx * cy * cz - cx * sy * sz;
  out[1] = cx * sy * cz + sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;

  return out;
}

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
var clone = exports.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
var fromValues = exports.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
var copy = exports.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
var set = exports.set = vec4.set;

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
var add = exports.add = vec4.add;

/**
 * Alias for {@link quat.multiply}
 * @function
 */
var mul = exports.mul = multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
var scale = exports.scale = vec4.scale;

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
var dot = exports.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
var lerp = exports.lerp = vec4.lerp;

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 */
var length = exports.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
var len = exports.len = length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
var squaredLength = exports.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
var sqrLen = exports.sqrLen = squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
var normalize = exports.normalize = vec4.normalize;

/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
var exactEquals = exports.exactEquals = vec4.exactEquals;

/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
var equals = exports.equals = vec4.equals;

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
var rotationTo = exports.rotationTo = function () {
  var tmpvec3 = vec3.create();
  var xUnitVec3 = vec3.fromValues(1, 0, 0);
  var yUnitVec3 = vec3.fromValues(0, 1, 0);

  return function (out, a, b) {
    var dot = vec3.dot(a, b);
    if (dot < -0.999999) {
      vec3.cross(tmpvec3, xUnitVec3, a);
      if (vec3.len(tmpvec3) < 0.000001) vec3.cross(tmpvec3, yUnitVec3, a);
      vec3.normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      vec3.cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize(out, out);
    }
  };
}();

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
var sqlerp = exports.sqlerp = function () {
  var temp1 = create();
  var temp2 = create();

  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));

    return out;
  };
}();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
var setAxes = exports.setAxes = function () {
  var matr = mat3.create();

  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];

    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];

    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];

    return normalize(out, fromMat3(out, matr));
  };
}();

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Uses the new array typed in javascript to binary base64 encode/decode
 * at the moment just decodes a binary base64 encoded
 * into either an ArrayBuffer (decodeArrayBuffer)
 * or into an Uint8Array (decode)
 * 
 * References:
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBuffer
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/Uint8Array
 */

var base64 = function () {
	function base64() {
		_classCallCheck(this, base64);
	}

	_createClass(base64, null, [{
		key: 'decodeLength',
		value: function decodeLength(input) {
			return input.length / 4 * 3;
		}

		/* will return a  Uint8Array type */

	}, {
		key: 'decodeArrayBuffer',
		value: function decodeArrayBuffer(input, buffer) {
			var bytes = input.length / 4 * 3;
			if (!buffer || buffer.byteLength != bytes) {
				// replace the buffer with a new, appropriately sized one
				buffer = new ArrayBuffer(bytes);
			}
			this.decode(input, buffer);

			return buffer;
		}
	}, {
		key: 'removePaddingChars',
		value: function removePaddingChars(input) {
			var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
			if (lkey == 64) {
				return input.substring(0, input.length - 1);
			}
			return input;
		}
	}, {
		key: 'decode',
		value: function decode(input, arrayBuffer) {
			//get last chars to see if are valid
			input = this.removePaddingChars(input);
			input = this.removePaddingChars(input);

			var bytes = parseInt(input.length / 4 * 3, 10);

			var uarray;
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			var j = 0;

			if (arrayBuffer) uarray = new Uint8Array(arrayBuffer);else uarray = new Uint8Array(bytes);

			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			for (i = 0; i < bytes; i += 3) {
				//get the 3 octects in 4 ascii chars
				enc1 = this._keyStr.indexOf(input.charAt(j++));
				enc2 = this._keyStr.indexOf(input.charAt(j++));
				enc3 = this._keyStr.indexOf(input.charAt(j++));
				enc4 = this._keyStr.indexOf(input.charAt(j++));

				chr1 = enc1 << 2 | enc2 >> 4;
				chr2 = (enc2 & 15) << 4 | enc3 >> 2;
				chr3 = (enc3 & 3) << 6 | enc4;

				uarray[i] = chr1;
				if (enc3 != 64) uarray[i + 1] = chr2;
				if (enc4 != 64) uarray[i + 2] = chr3;
			}

			return uarray;
		}

		// pass in a typedArray, ArrayBuffer, or ImageData object

	}, {
		key: 'encode',
		value: function encode(buffer) {
			var base64 = '';
			var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

			var bytes = buffer; // assume it's a typedArrayBuffer 

			if (buffer instanceof ArrayBuffer) {
				bytes = new Uint8Array(arrayBuffer);
			} else if (buffer instanceof ImageData) {
				bytes = buffer.data;
			}

			var byteLength = buffer.length;
			var byteRemainder = byteLength % 3;
			var mainLength = byteLength - byteRemainder;

			var a, b, c, d;
			var chunk;

			// Main loop deals with bytes in chunks of 3
			for (var i = 0; i < mainLength; i = i + 3) {
				// Combine the three bytes into a single integer
				chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];

				// Use bitmasks to extract 6-bit segments from the triplet
				a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
				b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
				c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
				d = chunk & 63; // 63       = 2^6 - 1

				// Convert the raw binary segments to the appropriate ASCII encoding
				base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
			}

			// Deal with the remaining bytes and padding
			if (byteRemainder == 1) {
				chunk = bytes[mainLength];

				a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

				// Set the 4 least significant bits to zero
				b = (chunk & 3) << 4; // 3   = 2^2 - 1

				base64 += encodings[a] + encodings[b] + '==';
			} else if (byteRemainder == 2) {
				chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];

				a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
				b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

				// Set the 2 least significant bits to zero
				c = (chunk & 15) << 2; // 15    = 2^4 - 1

				base64 += encodings[a] + encodings[b] + encodings[c] + '=';
			}

			return base64;
		}
	}]);

	return base64;
}();

exports.default = base64;

base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRLightEstimate represents the attributes of environmental light as supplied by the device's sensors.
*/
var XRLightEstimate = function () {
	function XRLightEstimate() {
		_classCallCheck(this, XRLightEstimate);

		this._ambientLightIntensity = 1;
	}

	_createClass(XRLightEstimate, [{
		key: 'getAmbientColorTemperature',
		value: function getAmbientColorTemperature() {
			//readonly attribute double ambientColorTemperature;
			throw new Error('Not implemented');
		}
	}, {
		key: 'ambientIntensity',
		set: function set(value) {
			// A value of 1000 represents "neutral" lighting. (https://developer.apple.com/documentation/arkit/arlightestimate/2878308-ambientintensity)
			this._ambientLightIntensity = value / 1000;
		},
		get: function get() {
			//readonly attribute double ambientIntensity;
			return this._ambientLightIntensity;
		}
	}]);

	return XRLightEstimate;
}();

exports.default = XRLightEstimate;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _Quaternion = __webpack_require__(2);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _XRAnchor = __webpack_require__(1);

var _XRAnchor2 = _interopRequireDefault(_XRAnchor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRAnchorOffset represents a pose in relation to an XRAnchor
*/
var XRAnchorOffset = function () {
	function XRAnchorOffset(anchorUID) {
		var poseMatrix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		_classCallCheck(this, XRAnchorOffset);

		this._anchorUID = anchorUID;
		this._tempArray = new Float32Array(16);
		this._poseMatrix = poseMatrix || _MatrixMath2.default.mat4_generateIdentity();
	}

	_createClass(XRAnchorOffset, [{
		key: 'setIdentityOffset',
		value: function setIdentityOffset() {
			var p = this._poseMatrix;
			p[0] = p[5] = p[10] = p[15] = 1;
			p[1] = p[2] = p[3] = 0;
			p[4] = p[6] = p[7] = 0;
			p[8] = p[9] = p[11] = 0;
			p[12] = p[13] = p[14] = 0;
		}
	}, {
		key: 'getOffsetTransform',


		/*
  Return a transform matrix that is offset by this XRAnchorOffset.poseMatrix relative to coordinateSystem
  */
		value: function getOffsetTransform(coordinateSystem) {
			return _MatrixMath2.default.mat4_multiply(this._tempArray, this._poseMatrix, coordinateSystem._poseModelMatrix);
		}
	}, {
		key: 'anchorUID',
		get: function get() {
			return this._anchorUID;
		}

		/*
  A Float32Array(16) representing a column major affine transform matrix
  */

	}, {
		key: 'poseMatrix',
		get: function get() {
			return this._poseMatrix;
		},
		set: function set(array16) {
			for (var i = 0; i < 16; i++) {
				this._poseMatrix[i] = array16[i];
			}
		}

		/*
  returns a Float32Array(4) representing an x, y, z position from this.poseMatrix
  */

	}, {
		key: 'position',
		get: function get() {
			return new Float32Array([this._poseMatrix[12], this._poseMatrix[13], this._poseMatrix[14]]);
		}

		/*
  returns a Float32Array(4) representing x, y, z, w of a quaternion from this.poseMatrix
  */

	}, {
		key: 'orientation',
		get: function get() {
			var quat = new _Quaternion2.default();
			quat.setFromRotationMatrix(this._poseMatrix);
			return quat.toArray();
		}
	}]);

	return XRAnchorOffset;
}();

exports.default = XRAnchorOffset;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRViewport represents the dimensions in pixels of an XRView.
*/
var XRViewport = function () {
	function XRViewport(x, y, width, height) {
		_classCallCheck(this, XRViewport);

		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
	}

	_createClass(XRViewport, [{
		key: "x",
		get: function get() {
			return this._x;
		},
		set: function set(value) {
			this._x = value;
		}
	}, {
		key: "y",
		get: function get() {
			return this._y;
		},
		set: function set(value) {
			this._y = value;
		}
	}, {
		key: "width",
		get: function get() {
			return this._width;
		},
		set: function set(value) {
			this._width = value;
		}
	}, {
		key: "height",
		get: function get() {
			return this._height;
		},
		set: function set(value) {
			this._height = value;
		}
	}]);

	return XRViewport;
}();

exports.default = XRViewport;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _EventHandlerBase2 = __webpack_require__(3);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
XRLayer defines a source of bitmap images and a description of how the image is to be rendered in the XRDisplay
*/
var XRLayer = function (_EventHandlerBase) {
	_inherits(XRLayer, _EventHandlerBase);

	function XRLayer() {
		_classCallCheck(this, XRLayer);

		return _possibleConstructorReturn(this, (XRLayer.__proto__ || Object.getPrototypeOf(XRLayer)).apply(this, arguments));
	}

	return XRLayer;
}(_EventHandlerBase3.default);

exports.default = XRLayer;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventHandlerBase2 = __webpack_require__(3);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

var _Vector = __webpack_require__(15);

var _Vector2 = _interopRequireDefault(_Vector);

var _Quaternion = __webpack_require__(2);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _Euler = __webpack_require__(38);

var _Euler2 = _interopRequireDefault(_Euler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
DeviceOrientationTracker keeps track of device orientation, which can be queried usnig `getOrientation`
*/
var DeviceOrientationTracker = function (_EventHandlerBase) {
	_inherits(DeviceOrientationTracker, _EventHandlerBase);

	function DeviceOrientationTracker() {
		_classCallCheck(this, DeviceOrientationTracker);

		var _this = _possibleConstructorReturn(this, (DeviceOrientationTracker.__proto__ || Object.getPrototypeOf(DeviceOrientationTracker)).call(this));

		_this._deviceOrientation = null;
		_this._windowOrientation = 0;

		window.addEventListener('orientationchange', function () {
			_this._windowOrientation = window.orientation || 0;
		}, false);
		window.addEventListener('deviceorientation', function (ev) {
			_this._deviceOrientation = ev;
			try {
				_this.dispatchEvent(new CustomEvent(DeviceOrientationTracker.ORIENTATION_UPDATE_EVENT, {
					deviceOrientation: _this._deviceOrientation,
					windowOrientation: _this._windowOrientation
				}));
			} catch (e) {
				console.error('deviceorientation event handler error', e);
			}
		}, false);
		return _this;
	}

	/*
 getOrientation sets the value of outQuaternion to the most recently tracked device orientation
 returns true if a device orientation has been received, otherwise false
 */


	_createClass(DeviceOrientationTracker, [{
		key: 'getOrientation',
		value: function getOrientation(outQuaternion) {
			if (this._deviceOrientation === null) {
				outQuaternion.set(0, 0, 0, 1);
				return false;
			}
			DeviceOrientationTracker.WORKING_EULER.set(this._deviceOrientation.beta * DeviceOrientationTracker.DEG_TO_RAD, this._deviceOrientation.alpha * DeviceOrientationTracker.DEG_TO_RAD, -1 * this._deviceOrientation.gamma * DeviceOrientationTracker.DEG_TO_RAD, 'YXZ');
			outQuaternion.setFromEuler(DeviceOrientationTracker.WORKING_EULER.x, DeviceOrientationTracker.WORKING_EULER.y, DeviceOrientationTracker.WORKING_EULER.z, DeviceOrientationTracker.WORKING_EULER.order);
			outQuaternion.multiply(DeviceOrientationTracker.HALF_PI_AROUND_X);
			outQuaternion.multiply(DeviceOrientationTracker.WORKING_QUATERNION.setFromAxisAngle(DeviceOrientationTracker.Z_AXIS, -this._windowOrientation * DeviceOrientationTracker.DEG_TO_RAD));
			return true;
		}
	}]);

	return DeviceOrientationTracker;
}(_EventHandlerBase3.default);

exports.default = DeviceOrientationTracker;


DeviceOrientationTracker.ORIENTATION_UPDATE_EVENT = 'orientation-update';

DeviceOrientationTracker.Z_AXIS = new _Vector2.default(0, 0, 1);
DeviceOrientationTracker.WORKING_EULER = new _Euler2.default();
DeviceOrientationTracker.WORKING_QUATERNION = new _Quaternion2.default();
DeviceOrientationTracker.HALF_PI_AROUND_X = new _Quaternion2.default(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
DeviceOrientationTracker.DEG_TO_RAD = Math.PI / 180;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRDisplay2 = __webpack_require__(6);

var _XRDisplay3 = _interopRequireDefault(_XRDisplay2);

var _XRSession2 = __webpack_require__(11);

var _XRSession3 = _interopRequireDefault(_XRSession2);

var _XRSessionCreateParameters2 = __webpack_require__(29);

var _XRSessionCreateParameters3 = _interopRequireDefault(_XRSessionCreateParameters2);

var _Reality2 = __webpack_require__(7);

var _Reality3 = _interopRequireDefault(_Reality2);

var _XRPointCloud2 = __webpack_require__(30);

var _XRPointCloud3 = _interopRequireDefault(_XRPointCloud2);

var _XRLightEstimate2 = __webpack_require__(20);

var _XRLightEstimate3 = _interopRequireDefault(_XRLightEstimate2);

var _XRAnchor2 = __webpack_require__(1);

var _XRAnchor3 = _interopRequireDefault(_XRAnchor2);

var _XRPlaneAnchor2 = __webpack_require__(10);

var _XRPlaneAnchor3 = _interopRequireDefault(_XRPlaneAnchor2);

var _XRFaceAnchor2 = __webpack_require__(8);

var _XRFaceAnchor3 = _interopRequireDefault(_XRFaceAnchor2);

var _XRImageAnchor2 = __webpack_require__(9);

var _XRImageAnchor3 = _interopRequireDefault(_XRImageAnchor2);

var _XRAnchorOffset2 = __webpack_require__(21);

var _XRAnchorOffset3 = _interopRequireDefault(_XRAnchorOffset2);

var _XRStageBounds2 = __webpack_require__(31);

var _XRStageBounds3 = _interopRequireDefault(_XRStageBounds2);

var _XRStageBoundsPoint2 = __webpack_require__(32);

var _XRStageBoundsPoint3 = _interopRequireDefault(_XRStageBoundsPoint2);

var _XRPresentationFrame2 = __webpack_require__(33);

var _XRPresentationFrame3 = _interopRequireDefault(_XRPresentationFrame2);

var _XRView2 = __webpack_require__(13);

var _XRView3 = _interopRequireDefault(_XRView2);

var _XRViewport2 = __webpack_require__(22);

var _XRViewport3 = _interopRequireDefault(_XRViewport2);

var _XRCoordinateSystem2 = __webpack_require__(34);

var _XRCoordinateSystem3 = _interopRequireDefault(_XRCoordinateSystem2);

var _XRViewPose2 = __webpack_require__(14);

var _XRViewPose3 = _interopRequireDefault(_XRViewPose2);

var _XRLayer2 = __webpack_require__(23);

var _XRLayer3 = _interopRequireDefault(_XRLayer2);

var _XRWebGLLayer2 = __webpack_require__(35);

var _XRWebGLLayer3 = _interopRequireDefault(_XRWebGLLayer2);

var _XRVideoFrame2 = __webpack_require__(36);

var _XRVideoFrame3 = _interopRequireDefault(_XRVideoFrame2);

var _EventHandlerBase2 = __webpack_require__(3);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

var _FlatDisplay = __webpack_require__(37);

var _FlatDisplay2 = _interopRequireDefault(_FlatDisplay);

var _HeadMountedDisplay = __webpack_require__(39);

var _HeadMountedDisplay2 = _interopRequireDefault(_HeadMountedDisplay);

var _CameraReality = __webpack_require__(40);

var _CameraReality2 = _interopRequireDefault(_CameraReality);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
XRPolyfill implements the window.XR functionality as a polyfill

Code below will check for window.XR and if it doesn't exist will install this polyfill,
so you can safely include this script in any page.
*/
var XRPolyfill = function (_EventHandlerBase) {
	_inherits(XRPolyfill, _EventHandlerBase);

	function XRPolyfill() {
		_classCallCheck(this, XRPolyfill);

		var _this = _possibleConstructorReturn(this, (XRPolyfill.__proto__ || Object.getPrototypeOf(XRPolyfill)).call(this));

		window.XRDisplay = _XRDisplay3.default;
		window.XRSession = _XRSession3.default;
		window.XRSessionCreateParameters = _XRSessionCreateParameters3.default;
		window.Reality = _Reality3.default;
		window.XRPointCloud = _XRPointCloud3.default;
		window.XRLightEstimate = _XRLightEstimate3.default;
		window.XRAnchor = _XRAnchor3.default;
		window.XRPlaneAnchor = _XRPlaneAnchor3.default;
		window.XRFaceAnchor = _XRFaceAnchor3.default;
		window.XRImageAnchor = _XRImageAnchor3.default;
		window.XRAnchorOffset = _XRAnchorOffset3.default;
		window.XRStageBounds = _XRStageBounds3.default;
		window.XRStageBoundsPoint = _XRStageBoundsPoint3.default;
		window.XRPresentationFrame = _XRPresentationFrame3.default;
		window.XRView = _XRView3.default;
		window.XRViewport = _XRViewport3.default;
		window.XRCoordinateSystem = _XRCoordinateSystem3.default;
		window.XRViewPose = _XRViewPose3.default;
		window.XRLayer = _XRLayer3.default;
		window.XRWebGLLayer = _XRWebGLLayer3.default;
		window.XRVideoFrame = _XRVideoFrame3.default;

		XRDisplay = window.XRDisplay;
		XRSession = window.XRSession;
		XRSessionCreateParameters = window.XRSessionCreateParameters;
		Reality = window.Reality;
		XRPointCloud = window.XRPointCloud;
		XRLightEstimate = window.XRLightEstimate;
		XRAnchor = window.XRAnchor;
		XRPlaneAnchor = window.XRPlaneAnchor;
		XRFaceAnchor = window.XRFaceAnchor;
		XRImageAnchor = window.XRImageAnchor;
		XRAnchorOffset = window.XRAnchorOffset;
		XRStageBounds = window.XRStageBounds;
		XRStageBoundsPoint = window.XRStageBoundsPoint;
		XRPresentationFrame = window.XRPresentationFrame;
		XRView = window.XRView;
		XRViewport = window.XRViewport;
		XRCoordinateSystem = window.XRCoordinateSystem;
		XRViewPose = window.XRViewPose;
		XRLayer = window.XRLayer;
		XRWebGLLayer = window.XRWebGLLayer;
		XRVideoFrame = window.XRVideoFrame;

		_this._getVRDisplaysFinished = false;

		// Reality instances that may be shared by multiple XRSessions
		_this._sharedRealities = [new _CameraReality2.default(_this)];
		_this._privateRealities = [];

		_this._displays = [new _FlatDisplay2.default(_this, _this._sharedRealities[0])];

		if (typeof navigator.getVRDisplays === 'function') {
			navigator.getVRDisplays().then(function (displays) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = displays[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var display = _step.value;

						if (display === null) continue;
						if (display.capabilities.canPresent) {
							_this._displays.push(new _HeadMountedDisplay2.default(_this, _this._sharedRealities[0], display));
						}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				_this._getVRDisplaysFinished = true;
			});
		} else {
			// if no WebVR, we don't need to wait
			_this._getVRDisplaysFinished = true;
		}

		// These elements are at the beginning of the body and absolutely positioned to fill the entire window
		// Sessions and realities add their elements to these divs so that they are in the right render order
		_this._sessionEls = document.createElement('div');
		_this._sessionEls.setAttribute('class', 'webxr-sessions');
		_this._realityEls = document.createElement('div');
		_this._realityEls.setAttribute('class', 'webxr-realities');
		var _arr = [_this._sessionEls, _this._realityEls];
		for (var _i = 0; _i < _arr.length; _i++) {
			var el = _arr[_i];
			el.style.position = 'absolute';
			el.style.width = '100%';
			el.style.height = '100%';
		}

		var prependElements = function prependElements() {
			document.body.style.width = '100%';
			document.body.style.height = '100%';
			document.body.prepend(_this._sessionEls);
			document.body.prepend(_this._realityEls); // realities must render behind the sessions
		};

		if (document.readyState !== 'loading') {
			prependElements();
		} else {
			document.addEventListener('DOMContentLoaded', prependElements);
		}
		return _this;
	}

	_createClass(XRPolyfill, [{
		key: 'getDisplays',
		value: function getDisplays() {
			var self = this;
			var waitTillDisplaysChecked = function waitTillDisplaysChecked(resolve) {
				if (!self._getVRDisplaysFinished) {
					setTimeout(waitTillDisplaysChecked.bind(self, resolve), 30);
				} else {
					resolve(self._displays);
				}
			};
			return new Promise(function (resolve, reject) {
				waitTillDisplaysChecked(resolve);
			});
		}

		//attribute EventHandler ondisplayconnect;
		//attribute EventHandler ondisplaydisconnect;

	}]);

	return XRPolyfill;
}(_EventHandlerBase3.default);

/* Install XRPolyfill if window.XR does not exist */


if (typeof navigator.XR === 'undefined') {
	navigator.XR = new XRPolyfill();
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Reality2 = __webpack_require__(7);

var _Reality3 = _interopRequireDefault(_Reality2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
VirtualReality is a Reality that is empty and waiting for fanstastic CG scenes.
*/
var VirtualReality = function (_Reality) {
	_inherits(VirtualReality, _Reality);

	function VirtualReality(xr) {
		_classCallCheck(this, VirtualReality);

		return _possibleConstructorReturn(this, (VirtualReality.__proto__ || Object.getPrototypeOf(VirtualReality)).call(this, xr, 'Virtual', false, false));
	}

	/*
 Called when at least one active XRSession is using this Reality
 */


	_createClass(VirtualReality, [{
		key: '_start',
		value: function _start(parameters) {}

		/*
  Called when no more active XRSessions are using this Reality
  */

	}, {
		key: '_stop',
		value: function _stop() {}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame() {}

		/*
  Create an anchor hung in space
  */

	}, {
		key: '_addAnchor',
		value: function _addAnchor(anchor, display) {
			this._anchors.set(anchor.uid, anchor);
			return anchor.uid;
		}

		/*
  Create an anchor attached to a surface, as found by a ray
  normalized screen x and y are in range 0..1, with 0,0 at top left and 1,1 at bottom right
  */

	}, {
		key: '_findAnchor',
		value: function _findAnchor(normalizedScreenX, normalizedScreenY, display) {
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			return new Promise(function (resolve, reject) {
				resolve(null);
			});
		}
	}, {
		key: '_removeAnchor',
		value: function _removeAnchor(uid) {
			this._anchors.delete(uid);
		}
	}, {
		key: '_hitTestNoAnchor',
		value: function _hitTestNoAnchor(normalizedScreenX, normalizedScreenY, display) {
			return null;
		}
	}, {
		key: '_getHasLightEstimate',
		value: function _getHasLightEstimate() {
			return false;
		}

		/*
  Find an XRAnchorOffset that is at floor level below the current head pose
  returns a Promise that resolves either to an AnchorOffset or null if the floor level is unknown
  */

	}, {
		key: '_findFloorAnchor',
		value: function _findFloorAnchor(display) {
			var _this2 = this;

			var uid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			// Copy the head model matrix for the current pose so we have it in the promise below
			var headModelMatrix = new Float32Array(display._headPose.poseModelMatrix);
			return new Promise(function (resolve, reject) {
				// For now, just create an anchor at origin level.  Probably want to use stage more intelligently
				headModelMatrix[13] = 0;
				var coordinateSystem = new XRCoordinateSystem(display, XRCoordinateSystem.TRACKER);
				coordinateSystem._relativeMatrix = headModelMatrix;
				var anchor = new XRAnchor(coordinateSystem, uid);
				_this2._addAnchor(anchor, display);
				resolve(new XRAnchorOffset(anchor.uid));
			});
		}
	}, {
		key: '_getTimeStamp',
		value: function _getTimeStamp(timestamp) {
			return timestamp;
		}
	}]);

	return VirtualReality;
}(_Reality3.default);

exports.default = VirtualReality;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sub = exports.mul = undefined;
exports.create = create;
exports.fromMat4 = fromMat4;
exports.clone = clone;
exports.copy = copy;
exports.fromValues = fromValues;
exports.set = set;
exports.identity = identity;
exports.transpose = transpose;
exports.invert = invert;
exports.adjoint = adjoint;
exports.determinant = determinant;
exports.multiply = multiply;
exports.translate = translate;
exports.rotate = rotate;
exports.scale = scale;
exports.fromTranslation = fromTranslation;
exports.fromRotation = fromRotation;
exports.fromScaling = fromScaling;
exports.fromMat2d = fromMat2d;
exports.fromQuat = fromQuat;
exports.normalFromMat4 = normalFromMat4;
exports.projection = projection;
exports.str = str;
exports.frob = frob;
exports.add = add;
exports.subtract = subtract;
exports.multiplyScalar = multiplyScalar;
exports.multiplyScalarAndAdd = multiplyScalarAndAdd;
exports.exactEquals = exactEquals;
exports.equals = equals;

var _common = __webpack_require__(4);

var glMatrix = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
function create() {
  var out = new glMatrix.ARRAY_TYPE(9);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */
function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  var out = new glMatrix.ARRAY_TYPE(9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}

/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */
function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];

  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20;

  // Calculate the determinant
  var det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];

  out[0] = a11 * a22 - a12 * a21;
  out[1] = a02 * a21 - a01 * a22;
  out[2] = a01 * a12 - a02 * a11;
  out[3] = a12 * a20 - a10 * a22;
  out[4] = a00 * a22 - a02 * a20;
  out[5] = a02 * a10 - a00 * a12;
  out[6] = a10 * a21 - a11 * a20;
  out[7] = a01 * a20 - a00 * a21;
  out[8] = a00 * a11 - a01 * a10;
  return out;
}

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];

  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];

  var b00 = b[0],
      b01 = b[1],
      b02 = b[2];
  var b10 = b[3],
      b11 = b[4],
      b12 = b[5];
  var b20 = b[6],
      b21 = b[7],
      b22 = b[8];

  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;

  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;

  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
function translate(out, a, v) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      x = v[0],
      y = v[1];

  out[0] = a00;
  out[1] = a01;
  out[2] = a02;

  out[3] = a10;
  out[4] = a11;
  out[5] = a12;

  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function rotate(out, a, rad) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      s = Math.sin(rad),
      c = Math.cos(rad);

  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;

  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;

  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
function scale(out, a, v) {
  var x = v[0],
      y = v[1];

  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];

  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];

  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function fromRotation(out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);

  out[0] = c;
  out[1] = s;
  out[2] = 0;

  out[3] = -s;
  out[4] = c;
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;

  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
function fromMat2d(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;

  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;

  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;

  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;

  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;

  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;

  return out;
}

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
function normalFromMat4(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];

  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

  return out;
}

/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */
function projection(out, width, height) {
  out[0] = 2 / width;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = -2 / height;
  out[5] = 0;
  out[6] = -1;
  out[7] = 1;
  out[8] = 1;
  return out;
}

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ')';
}

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2));
}

/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}

/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7],
      a8 = a[8];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7],
      b8 = b[8];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
}

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
var mul = exports.mul = multiply;

/**
 * Alias for {@link mat3.subtract}
 * @function
 */
var sub = exports.sub = subtract;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEach = exports.sqrLen = exports.len = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = undefined;
exports.create = create;
exports.clone = clone;
exports.fromValues = fromValues;
exports.copy = copy;
exports.set = set;
exports.add = add;
exports.subtract = subtract;
exports.multiply = multiply;
exports.divide = divide;
exports.ceil = ceil;
exports.floor = floor;
exports.min = min;
exports.max = max;
exports.round = round;
exports.scale = scale;
exports.scaleAndAdd = scaleAndAdd;
exports.distance = distance;
exports.squaredDistance = squaredDistance;
exports.length = length;
exports.squaredLength = squaredLength;
exports.negate = negate;
exports.inverse = inverse;
exports.normalize = normalize;
exports.dot = dot;
exports.lerp = lerp;
exports.random = random;
exports.transformMat4 = transformMat4;
exports.transformQuat = transformQuat;
exports.str = str;
exports.exactEquals = exactEquals;
exports.equals = equals;

var _common = __webpack_require__(4);

var glMatrix = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
function create() {
  var out = new glMatrix.ARRAY_TYPE(4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  return out;
}

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
function fromValues(x, y, z, w) {
  var out = new glMatrix.ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}

/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}

/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}

/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
}

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return x * x + y * y + z * z + w * w;
}

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
}

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
function random(out, vectorScale) {
  vectorScale = vectorScale || 1.0;

  //TODO: This is a pretty awful way of doing this. Find something better.
  out[0] = glMatrix.RANDOM();
  out[1] = glMatrix.RANDOM();
  out[2] = glMatrix.RANDOM();
  out[3] = glMatrix.RANDOM();
  normalize(out, out);
  scale(out, out, vectorScale);
  return out;
}

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
function transformQuat(out, a, q) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];

  // calculate quat * vec
  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
var sub = exports.sub = subtract;

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
var mul = exports.mul = multiply;

/**
 * Alias for {@link vec4.divide}
 * @function
 */
var div = exports.div = divide;

/**
 * Alias for {@link vec4.distance}
 * @function
 */
var dist = exports.dist = distance;

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
var sqrDist = exports.sqrDist = squaredDistance;

/**
 * Alias for {@link vec4.length}
 * @function
 */
var len = exports.len = length;

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
var sqrLen = exports.sqrLen = squaredLength;

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
var forEach = exports.forEach = function () {
  var vec = create();

  return function (a, stride, offset, count, fn, arg) {
    var i = void 0,
        l = void 0;
    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];vec[1] = a[i + 1];vec[2] = a[i + 2];vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];a[i + 1] = vec[1];a[i + 2] = vec[2];a[i + 3] = vec[3];
    }

    return a;
  };
}();

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
The XRSessionCreateParametersInit dictionary provides a session description, indicating the desired capabilities of a session to be returned from requestSession()
*/
var XRSessionCreateParameters = function () {
	function XRSessionCreateParameters() {
		_classCallCheck(this, XRSessionCreateParameters);
	}

	_createClass(XRSessionCreateParameters, [{
		key: 'exclusive',
		get: function get() {
			//readonly attribute boolean exclusive;
			throw 'Not implemented';
		}
	}, {
		key: 'type',
		get: function get() {
			//readonly attribute XRSessionRealityType type;
			throw 'Not implemented';
		}
	}]);

	return XRSessionCreateParameters;
}();

exports.default = XRSessionCreateParameters;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRPointCloud holds an array of float values where each four values represents [x, y, z, confidence in range 0-1] that describe a point in space detected by the device's sensors.
*/
var XRPointCloud = function () {
	function XRPointCloud() {
		_classCallCheck(this, XRPointCloud);
	}

	_createClass(XRPointCloud, [{
		key: 'points',
		get: function get() {
			//readonly attribute Float32Array points
			throw new Error('Not implemented');
		}
	}]);

	return XRPointCloud;
}();

exports.default = XRPointCloud;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
The XRStageBounds interface describes a space known as a "Stage".
The stage is a bounded, floor-relative play space that the user can be expected to safely be able to move within.
Other XR platforms sometimes refer to this concept as "room scale" or "standing XR".
*/
var XRStageBounds = function () {
	function XRStageBounds() {
		_classCallCheck(this, XRStageBounds);
	}

	_createClass(XRStageBounds, [{
		key: 'center',
		get: function get() {
			//readonly attribute XRCoordinateSystem center;
			throw new Error('Not implemented');
		}
	}, {
		key: 'geometry',
		get: function get() {
			//readonly attribute FrozenArray<XRStageBoundsPoint>? geometry;
			throw new Error('Not implemented');
		}
	}]);

	return XRStageBounds;
}();

exports.default = XRStageBounds;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRStageBoundPoints represent the offset in meters from the stage origin along the X and Z axes.
*/
var XRStageBoundsPoint = function () {
	function XRStageBoundsPoint() {
		_classCallCheck(this, XRStageBoundsPoint);
	}

	_createClass(XRStageBoundsPoint, [{
		key: 'x',
		get: function get() {
			//readonly attribute double x;
			throw new Error('Not implemented');
		}
	}, {
		key: 'y',
		get: function get() {
			//readonly attribute double z;
			throw new Error('Not implemented');
		}
	}]);

	return XRStageBoundsPoint;
}();

exports.default = XRStageBoundsPoint;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRAnchor = __webpack_require__(1);

var _XRAnchor2 = _interopRequireDefault(_XRAnchor);

var _ARKitWrapper = __webpack_require__(5);

var _ARKitWrapper2 = _interopRequireDefault(_ARKitWrapper);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRPresentationFrame provides all of the values needed to render a single frame of an XR scene to the XRDisplay.
*/
var XRPresentationFrame = function () {
	function XRPresentationFrame(session, timestamp) {
		_classCallCheck(this, XRPresentationFrame);

		this._session = session;
		this._timestamp = this._session.reality._getTimeStamp(timestamp);
	}

	_createClass(XRPresentationFrame, [{
		key: 'addAnchor',


		/*
  Create an anchor at a specific position defined by XRAnchor.coordinates
  */
		value: function addAnchor(coordinateSystem) {
			var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
			var orientation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 0, 1];
			var uid = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			//DOMString? addAnchor(XRCoordinateSystem, position, orientation);
			var poseMatrix = _MatrixMath2.default.mat4_fromRotationTranslation(new Float32Array(16), orientation, position);
			_MatrixMath2.default.mat4_multiply(poseMatrix, coordinateSystem.getTransformTo(this._session._display._trackerCoordinateSystem), poseMatrix);
			var anchorCoordinateSystem = new XRCoordinateSystem(this._session._display, XRCoordinateSystem.TRACKER);
			anchorCoordinateSystem._relativeMatrix = poseMatrix;
			return this._session.reality._addAnchor(new _XRAnchor2.default(anchorCoordinateSystem, uid), this._session.display);
		}

		// normalized screen x and y are in range 0..1, with 0,0 at top left and 1,1 at bottom right

	}, {
		key: 'findAnchor',
		value: function findAnchor(normalizedScreenX, normalizedScreenY) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			// Promise<XRAnchorOffset?> findAnchor(float32, float32); // cast a ray to find or create an anchor at the first intersection in the Reality
			return this._session.reality._findAnchor(normalizedScreenX, normalizedScreenY, this._session.display, options);
		}
	}, {
		key: 'hitTestNoAnchor',
		value: function hitTestNoAnchor(normalizedScreenX, normalizedScreenY) {
			// Array<VRHit> hitTestNoAnchor(float32, float32); // cast a ray to find all plane intersections in the Reality
			return this._session.reality._hitTestNoAnchor(normalizedScreenX, normalizedScreenY, this._session.display);
		}

		/*
  Find an XRAnchorOffset that is at floor level below the current head pose
  uid will be the resulting anchor uid (if any), or if null one will be assigned
  */

	}, {
		key: 'findFloorAnchor',
		value: function findFloorAnchor() {
			var uid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			// Promise<XRAnchorOffset?> findFloorAnchor();
			return this._session.reality._findFloorAnchor(this._session.display, uid);
		}
	}, {
		key: 'removeAnchor',
		value: function removeAnchor(uid) {
			// void removeAnchor(DOMString uid);
			return this._session.reality._removeAnchor(uid);
		}

		/*
  Returns an existing XRAnchor or null if uid is unknown
  */

	}, {
		key: 'getAnchor',
		value: function getAnchor(uid) {
			// XRAnchor? getAnchor(DOMString uid);
			return this._session.reality._getAnchor(uid);
		}
	}, {
		key: 'getCoordinateSystem',
		value: function getCoordinateSystem() {
			var _session;

			// XRCoordinateSystem? getCoordinateSystem(...XRFrameOfReferenceType types); // Tries the types in order, returning the first match or null if none is found
			return (_session = this._session)._getCoordinateSystem.apply(_session, arguments);
		}
	}, {
		key: 'getDisplayPose',
		value: function getDisplayPose(coordinateSystem) {
			// XRViewPose? getDisplayPose(XRCoordinateSystem coordinateSystem);
			switch (coordinateSystem._type) {
				case XRCoordinateSystem.HEAD_MODEL:
					return this._session._display._headPose;
				case XRCoordinateSystem.EYE_LEVEL:
					return this._session._display._eyeLevelPose;
				default:
					return null;
			}
		}
	}, {
		key: 'session',
		get: function get() {
			return this._session;
		}
	}, {
		key: 'views',
		get: function get() {
			//readonly attribute FrozenArray<XRView> views;
			return this._session._display._views;
		}
	}, {
		key: 'hasPointCloud',
		get: function get() {
			//readonly attribute boolean hasPointCloud;
			return false;
		}
	}, {
		key: 'pointCloud',
		get: function get() {
			//readonly attribute XRPointCloud? pointCloud;
			return null;
		}
	}, {
		key: 'hasLightEstimate',
		get: function get() {
			//readonly attribute boolean hasLightEstimate;
			return this._session.reality._getHasLightEstimate();
		}
	}, {
		key: 'lightEstimate',
		get: function get() {
			//readonly attribute XRLightEstimate? lightEstimate;
			return this._session.reality._getLightAmbientIntensity();
		}
	}, {
		key: 'timestamp',
		get: function get() {
			return this._timestamp;
		}
		/*
  Returns an array of known XRAnchor instances. May be empty.
  */

	}, {
		key: 'anchors',
		get: function get() {
			//readonly attribute sequence<XRAnchor> anchors;
			var results = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this._session.reality._anchors.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var value = _step.value;

					results.push(value);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return results;
		}
	}]);

	return XRPresentationFrame;
}();

// hit test types


exports.default = XRPresentationFrame;
XRPresentationFrame.HIT_TEST_TYPE_FEATURE_POINT = _ARKitWrapper2.default.HIT_TEST_TYPE_FEATURE_POINT;
XRPresentationFrame.HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE = _ARKitWrapper2.default.HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE;
XRPresentationFrame.HIT_TEST_TYPE_ESTIMATED_VERTICAL_PLANE = _ARKitWrapper2.default.HIT_TEST_TYPE_ESTIMATED_VERTICAL_PLANE;
XRPresentationFrame.HIT_TEST_TYPE_EXISTING_PLANE = _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE;
XRPresentationFrame.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT = _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT;
XRPresentationFrame.HIT_TEST_TYPE_EXISTING_PLANE_USING_GEOMETRY = _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE_USING_GEOMETRY;

XRPresentationFrame.HIT_TEST_TYPE_ALL = _ARKitWrapper2.default.HIT_TEST_TYPE_FEATURE_POINT | _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE | _ARKitWrapper2.default.HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE | _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT;

XRPresentationFrame.HIT_TEST_TYPE_EXISTING_PLANES = _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE | _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRCoordinateSystem represents the origin of a 3D coordinate system positioned at a known frame of reference.
The XRCoordinateSystem is a string from XRCoordinateSystem.TYPES:

These types are used by the app code when requesting a coordinate system from the session:
- XRCoordinateSystem.HEAD_MODEL: origin is aligned with the pose of the head, as sensed by HMD or handset trackers
- XRCoordinateSystem.EYE_LEVEL: origin is at a fixed distance above the ground

This is an internal type, specific to just this polyfill and not visible to the app code
- XRCoordinateSystem.TRACKER: The origin of this coordinate system is at floor level at or below the origin of the HMD or handset provided tracking system

*/
var XRCoordinateSystem = function () {
	function XRCoordinateSystem(display, type) {
		_classCallCheck(this, XRCoordinateSystem);

		this._display = display;
		this._type = type;

		this.__relativeMatrix = _MatrixMath2.default.mat4_generateIdentity();
		this._workingMatrix = _MatrixMath2.default.mat4_generateIdentity();
	}

	_createClass(XRCoordinateSystem, [{
		key: 'getTransformTo',
		value: function getTransformTo(otherCoordinateSystem) {
			// apply inverse of the poseModelMatrix to the identity matrix
			var inverse = _MatrixMath2.default.mat4_invert(new Float32Array(16), otherCoordinateSystem._poseModelMatrix);
			var out = _MatrixMath2.default.mat4_generateIdentity();
			_MatrixMath2.default.mat4_multiply(out, inverse, out);

			// apply the other system's poseModelMatrix
			_MatrixMath2.default.mat4_multiply(out, this._poseModelMatrix, out);
			return out;
		}
	}, {
		key: '_relativeMatrix',
		get: function get() {
			return this.__relativeMatrix;
		},
		set: function set(value) {
			for (var i = 0; i < 16; i++) {
				this.__relativeMatrix[i] = value[i];
			}
		}
	}, {
		key: '_poseModelMatrix',
		get: function get() {
			switch (this._type) {
				case XRCoordinateSystem.HEAD_MODEL:
					return this._display._headPose.poseModelMatrix;
				case XRCoordinateSystem.EYE_LEVEL:
					return this._display._eyeLevelPose.poseModelMatrix;
				case XRCoordinateSystem.TRACKER:
					_MatrixMath2.default.mat4_multiply(this._workingMatrix, this.__relativeMatrix, this._display._trackerPoseModelMatrix);
					return this._workingMatrix;
				default:
					throw new Error('Unknown coordinate system type: ' + this._type);
			}
		}
	}]);

	return XRCoordinateSystem;
}();

exports.default = XRCoordinateSystem;


XRCoordinateSystem.HEAD_MODEL = 'headModel';
XRCoordinateSystem.EYE_LEVEL = 'eyeLevel';
XRCoordinateSystem.TRACKER = 'tracker';

XRCoordinateSystem.TYPES = [XRCoordinateSystem.HEAD_MODEL, XRCoordinateSystem.EYE_LEVEL, XRCoordinateSystem.TRACKER];

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRLayer2 = __webpack_require__(23);

var _XRLayer3 = _interopRequireDefault(_XRLayer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
XRWebGLLayer defines the WebGL or WebGL 2 context that is rendering the visuals for this layer.
*/
var XRWebGLLayer = function (_XRLayer) {
	_inherits(XRWebGLLayer, _XRLayer);

	function XRWebGLLayer(session, context) {
		_classCallCheck(this, XRWebGLLayer);

		var _this = _possibleConstructorReturn(this, (XRWebGLLayer.__proto__ || Object.getPrototypeOf(XRWebGLLayer)).call(this));

		_this._session = session;
		_this._context = context;
		_this._width = _this._context.canvas.width;
		_this._height = _this._context.canvas.height;
		_this._framebuffer = null; // TODO
		return _this;
	}

	_createClass(XRWebGLLayer, [{
		key: 'requestViewportScaling',
		value: function requestViewportScaling(viewportScaleFactor) {
			// void requestViewportScaling(double viewportScaleFactor);
			throw 'Not implemented';
		}
	}, {
		key: 'context',
		get: function get() {
			return this._context;
		}
	}, {
		key: 'antialias',
		get: function get() {
			// readonly attribute boolean antialias;
			throw 'Not implemented';
		}
	}, {
		key: 'depth',
		get: function get() {
			// readonly attribute boolean depth;
			throw 'Not implemented';
		}
	}, {
		key: 'stencil',
		get: function get() {
			// readonly attribute boolean stencil;
			throw 'Not implemented';
		}
	}, {
		key: 'alpha',
		get: function get() {
			// readonly attribute boolean alpha;
			throw 'Not implemented';
		}
	}, {
		key: 'multiview',
		get: function get() {
			// readonly attribute boolean multiview;
			throw 'Not implemented';
		}
	}, {
		key: 'framebuffer',
		get: function get() {
			return this._framebuffer;
		}
	}, {
		key: 'framebufferWidth',
		set: function set(w) {
			this._width = w;
			this._context.canvas.width = w;
		},
		get: function get() {
			// not using this for now, on iOS it's not good.  
			// var pr = window.devicePixelRatio || 1;
			//return this._context.canvas.clientWidth;
			return this._width;
		}
	}, {
		key: 'framebufferHeight',
		set: function set(h) {
			this._height = h;
			this._context.canvas.height = h;
		},
		get: function get() {
			// not using this for now, on iOS it's not good.  
			// var pr = window.devicePixelRatio || 1;
			//return this._context.canvas.clientHeight;
			return this._height;
		}
	}]);

	return XRWebGLLayer;
}(_XRLayer3.default);

exports.default = XRWebGLLayer;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = __webpack_require__(4);

var glMatrix = _interopRequireWildcard(_common);

var _mat = __webpack_require__(17);

var mat4 = _interopRequireWildcard(_mat);

var _quat = __webpack_require__(18);

var quat = _interopRequireWildcard(_quat);

var _vec = __webpack_require__(12);

var vec3 = _interopRequireWildcard(_vec);

var _base64Binary = __webpack_require__(19);

var _base64Binary2 = _interopRequireDefault(_base64Binary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRVideoFrame represents the a video frame from a camera.

{
  "frame": {
    "buffers": [ // Array of base64 encoded string buffers
      {
        "size": {
          "width": 320,
          "height": 180,
          "bytesPerRow": 320,
          "bytesPerPixel": 1
        },
        "buffer": "e3x...d7d"   /// convert to Uint8 buffer in code below
      },
      {
        "size": {
          "width": 160,
          "height": 90,
          "bytesPerRow": 320,
          "bytesPerPixel": 2
        },
        "buffer": "ZZF.../fIJ7"  /// convert to Uint8 buffer in code below
      }
    ],
    "pixelFormat": "YUV420P",  /// Added in the code below, clients should ignore pixelFormatType
    "timestamp": 337791
  },
  "camera": {
    "cameraIntrinsics": [3x3 matrix],
        fx 0   px
        0  fy  py
        0  0   1
        fx and fy are the focal length in pixels.
        px and py are the coordinates of the principal point in pixels.
        The origin is at the center of the upper-left pixel.

    "cameraImageResolution": {
      "width": 1280,
      "height": 720
    },
    "viewMatrix": [4x4 camera view matrix],
    "arCamera": true;
    "cameraOrientation": 0,  // orientation in degrees of image relative to display
                            // normally 0, but on video mixed displays that keep the camera in a fixed 
                            // orientation, but rotate the UI, like on some phones, this will change
                            // as the display orientation changes
    "projectionMatrix": [4x4 camera projection matrix]
  }
}

frame.buffers.buffer[*] can be String (which will be lazily converted to ArrayBuffer) or ArrayBuffer.
pixelFormat should be one of XRVideoFrame.IMAGEFORMAT

*/

// store unused ArrayBuffers
// we'll push to it on release, pop from it when we need a new one.  In the common case, where the 
// same camera setup is running and the same cv is running, we should get some speed up by not reallocating
// because the same size and number of buffers will be pushed/popped in the same order
var _ab = [];

var XRVideoFrame = function () {
    function XRVideoFrame(buffers, pixelFormat, timestamp, camera) {
        _classCallCheck(this, XRVideoFrame);

        this._buffers = buffers;
        for (var i = 0; i < buffers.length; i++) {
            buffers[i]._buffer = buffers[i].buffer;
            buffers[i].buffer = null;

            // if we didn't pass in an abCache, as might happen when we pass this
            // to/from a worker, see if there is a saved ArrayBuffer of the right size
            if (!buffers[i]._abCache && typeof buffers[i]._buffer == "string") {
                var bytes = _base64Binary2.default.decodeLength(buffers[i]._buffer);
                for (var j = 0; j < _ab.length; j++) {
                    if (_ab[j].byteLength == bytes) {
                        buffers[i]._abCache = _ab[j];
                        _ab.splice(j, 1);
                        break;
                    }
                }
            } else if (!buffers[i]._abCache && buffers[i]._buffer instanceof ImageData) {
                var data = buffers[i]._buffer.data;
                var bytes = data.length;
                for (var j = 0; j < _ab.length; j++) {
                    if (_ab[j].byteLength == bytes) {
                        buffers[i]._abCache = _ab[j];
                        _ab.splice(j, 1);
                        break;
                    }
                }

                var ab = buffers[i]._abCache ? buffers[i]._abCache : new ArrayBuffer(bytes);
                buffers[i]._abCache = null;

                var buffData = new Uint8Array(ab);
                for (var k = 0; k < bytes; k++) {
                    buffData[k] = data[k];
                }buffers[i]._buffer = ab;
            }
        }
        this._pixelFormat = pixelFormat;
        this._timestamp = timestamp;
        this._camera = camera;
    }

    _createClass(XRVideoFrame, [{
        key: "numBuffers",
        value: function numBuffers() {
            this._buffers.length;
        }
    }, {
        key: "buffer",
        value: function buffer(index) {
            if (index >= 0 && index < this._buffers.length) {
                var buff = this._buffers[index];
                if (!buff.buffer) {
                    if (typeof buff._buffer == "string") {
                        // use the ArrayBuffer cache if there
                        buff._buffer = _base64Binary2.default.decodeArrayBuffer(buff._buffer, buff._abCache);
                        buff._abCache = null;
                        buff.buffer = new Uint8Array(buff._buffer);
                    } else if (buff._buffer instanceof ArrayBuffer) {
                        buff.buffer = new Uint8Array(buff._buffer);
                    } else if (buff._buffer instanceof ImageData) {
                        buff.buffer = ImageData.data;
                    }
                }
                return buff;
            }
            return null;
        }
    }, {
        key: "release",
        value: function release() {
            // if buffers are passed in, check if they are ArrayBuffers, and if so, save
            // them for possible use on the next frame.
            //
            // we do this because passing buffers down into Workers invalidates them, so we need to
            // return them here when we get them back from the Worker, so they can be reused. 
            var buffers = this._buffers;
            for (var i = 0; i < buffers.length; i++) {
                if (buffers[i]._buffer instanceof ArrayBuffer && buffers[i]._buffer.byteLength > 0) {
                    _ab.push(buffers[i]._buffer);
                }
                if (buffers[i]._abCache instanceof ArrayBuffer && buffers[i]._abCache.byteLength > 0) {
                    _ab.push(buffers[i]._abCache);
                }
            }
        }
    }, {
        key: "postMessageToWorker",
        value: function postMessageToWorker(worker, options) {
            var msg = Object.assign({}, options || {});
            msg.buffers = this._buffers;
            msg.timestamp = this._timestamp;
            msg.pixelFormat = this._pixelFormat;
            msg.camera = this._camera;

            var buffs = [];
            for (var i = 0; i < msg.buffers.length; i++) {
                msg.buffers[i].buffer = msg.buffers[i]._buffer;

                if (msg.buffers[i]._buffer instanceof ArrayBuffer || msg.buffers[i]._buffer instanceof ImageData) {
                    buffs.push(msg.buffers[i]._buffer);
                }
                msg.buffers[i]._buffer = null;

                if (msg.buffers[i]._abCache instanceof ArrayBuffer) {
                    buffs.push(msg.buffers[i]._abCache);
                }
            }
            worker.postMessage(msg, buffs);
        }
    }, {
        key: "postReplyMessage",
        value: function postReplyMessage(options) {
            var msg = Object.assign({}, options);
            msg.buffers = this._buffers;
            msg.timestamp = this._timestamp;
            msg.pixelFormat = this._pixelFormat;
            msg.camera = this._camera;

            var buffs = [];
            for (var i = 0; i < msg.buffers.length; i++) {
                msg.buffers[i].buffer = null;
                if (msg.buffers[i]._buffer instanceof ArrayBuffer || msg.buffers[i]._buffer instanceof ImageData) {
                    // any array buffers should be marked for transfer
                    buffs.push(msg.buffers[i]._buffer);
                    msg.buffers[i].buffer = msg.buffers[i]._buffer;
                }
                msg.buffers[i]._buffer = null;

                if (msg.buffers[i]._abCache instanceof ArrayBuffer) {
                    buffs.push(msg.buffers[i]._abCache);
                }
            }
            postMessage(msg, buffs);
        }
    }, {
        key: "pixelFormat",
        get: function get() {
            return this._pixelFormat;
        }
    }, {
        key: "timestamp",
        get: function get() {
            return this._timestamp;
        }
    }, {
        key: "camera",
        get: function get() {
            return this._camera;
        }
    }], [{
        key: "createFromMessage",
        value: function createFromMessage(event) {
            return new this(event.data.buffers, event.data.pixelFormat, event.data.timestamp, event.data.camera);
        }
    }]);

    return XRVideoFrame;
}();

/*
ImageFormat taken from
https://w3c.github.io/mediacapture-worker/#imagebitmap-extensions

enum ImageFormat {
    "RGBA32",
    "BGRA32",
    "RGB24",
    "BGR24",
    "GRAY8",
    "YUV444P",
    "YUV422P",
    "YUV420P",
    "YUV420SP_NV12",
    "YUV420SP_NV21",
    "HSV",
    "Lab",
    "DEPTH",
    // empty string 
    ""
};


*/


exports.default = XRVideoFrame;
XRVideoFrame.IMAGEFORMAT_RGBA32 = "RGBA32";
XRVideoFrame.IMAGEFORMAT_BGRA32 = "BGRA32";
XRVideoFrame.IMAGEFORMAT_RGB24 = "RGB24";
XRVideoFrame.IMAGEFORMAT_BGR24 = "BGR24";
XRVideoFrame.IMAGEFORMAT_GRAY8 = "GRAY8";
XRVideoFrame.IMAGEFORMAT_YUV444P = "YUV444P";
XRVideoFrame.IMAGEFORMAT_YUV422P = "YUV422P";
XRVideoFrame.IMAGEFORMAT_YUV420P = "YUV420P";
XRVideoFrame.IMAGEFORMAT_YUV420SP_NV12 = "YUV420SP_NV12";
XRVideoFrame.IMAGEFORMAT_YUV420SP_NV21 = "YUV420SP_NV21";
XRVideoFrame.IMAGEFORMAT_HSV = "HSV";
XRVideoFrame.IMAGEFORMAT_Lab = "Lab";
XRVideoFrame.IMAGEFORMAT_DEPTH = "DEPTH";
XRVideoFrame.IMAGEFORMAT_NULL = "";

XRVideoFrame.IMAGEFORMAT = [XRVideoFrame.IMAGEFORMAT_RGBA32, XRVideoFrame.IMAGEFORMAT_BGRA32, XRVideoFrame.IMAGEFORMAT_RGB24, XRVideoFrame.IMAGEFORMAT_BGR24, XRVideoFrame.IMAGEFORMAT_GRAY8, XRVideoFrame.IMAGEFORMAT_YUV444P, XRVideoFrame.IMAGEFORMAT_YUV422P, XRVideoFrame.IMAGEFORMAT_YUV420P, XRVideoFrame.IMAGEFORMAT_YUV420SP_NV12, XRVideoFrame.IMAGEFORMAT_YUV420SP_NV21, XRVideoFrame.IMAGEFORMAT_HSV, XRVideoFrame.IMAGEFORMAT_Lab, XRVideoFrame.IMAGEFORMAT_DEPTH, XRVideoFrame.IMAGEFORMAT_NULL];

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _XRDisplay2 = __webpack_require__(6);

var _XRDisplay3 = _interopRequireDefault(_XRDisplay2);

var _XRView = __webpack_require__(13);

var _XRView2 = _interopRequireDefault(_XRView);

var _XRSession = __webpack_require__(11);

var _XRSession2 = _interopRequireDefault(_XRSession);

var _XRFieldOfView = __webpack_require__(16);

var _XRFieldOfView2 = _interopRequireDefault(_XRFieldOfView);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _Quaternion = __webpack_require__(2);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _Vector = __webpack_require__(15);

var _Vector2 = _interopRequireDefault(_Vector);

var _DeviceOrientationTracker = __webpack_require__(24);

var _DeviceOrientationTracker2 = _interopRequireDefault(_DeviceOrientationTracker);

var _ARKitWrapper = __webpack_require__(5);

var _ARKitWrapper2 = _interopRequireDefault(_ARKitWrapper);

var _XRPlaneAnchor = __webpack_require__(10);

var _XRPlaneAnchor2 = _interopRequireDefault(_XRPlaneAnchor);

var _XRFaceAnchor = __webpack_require__(8);

var _XRFaceAnchor2 = _interopRequireDefault(_XRFaceAnchor);

var _XRAnchor = __webpack_require__(1);

var _XRAnchor2 = _interopRequireDefault(_XRAnchor);

var _XRImageAnchor = __webpack_require__(9);

var _XRImageAnchor2 = _interopRequireDefault(_XRImageAnchor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
FlatDisplay takes over a handset's full screen and presents a moving view into a Reality, as if it were a magic window.

If ARKit is present, it uses the ARKit updates to set the headModel pose.
If ARCore is available on the VRDisplays, use that to pose the headModel. (TODO)
Otherwise, use orientation events.
*/
var FlatDisplay = function (_XRDisplay) {
	_inherits(FlatDisplay, _XRDisplay);

	function FlatDisplay(xr, reality) {
		_classCallCheck(this, FlatDisplay);

		var _this = _possibleConstructorReturn(this, (FlatDisplay.__proto__ || Object.getPrototypeOf(FlatDisplay)).call(this, xr, 'Flat', false, reality));

		_this._started = false;
		_this._initialized = false;

		// This is used if we have ARKit support
		_this._arKitWrapper = null;

		// This is used if we have ARCore support
		_this._vrFrameData = null;

		// This is used if we are using orientation events
		_this._deviceOrientationTracker = null;

		// These are used if we have ARCore support or use window orientation events
		_this._deviceOrientation = null; // Quaternion
		_this._devicePosition = null; // Vector3
		_this._deviceWorldMatrix = null; // Float32Array(16)

		// Currently only support full screen views
		_this._views.push(new _XRView2.default(_this._fov, _this._depthNear, _this._depthFar));
		return _this;
	}

	_createClass(FlatDisplay, [{
		key: '_start',
		value: function _start() {
			var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (this._reality._vrDisplay) {
				// Use ARCore
				if (this._vrFrameData === null) {
					this._vrFrameData = new VRFrameData();
					this._views[0]._depthNear = this._reality._vrDisplay.depthNear;
					this._views[0]._depthFar = this._reality._vrDisplay.depthFar;
					this._deviceOrientation = new _Quaternion2.default();
					this._devicePosition = new _Vector2.default();
					this._deviceWorldMatrix = new Float32Array(16);
				}
			} else if (_ARKitWrapper2.default.HasARKit()) {
				// Use ARKit
				if (this._initialized === false) {
					this._initialized = true;
					this._arKitWrapper = _ARKitWrapper2.default.GetOrCreate();
					this._arKitWrapper.addEventListener(_ARKitWrapper2.default.INIT_EVENT, this._handleARKitInit.bind(this));
					this._arKitWrapper.addEventListener(_ARKitWrapper2.default.WATCH_EVENT, this._handleARKitUpdate.bind(this));
					this._arKitWrapper.addEventListener(_ARKitWrapper2.default.WINDOW_RESIZE_EVENT, this._handleARKitWindowResize.bind(this));
					this._arKitWrapper.addEventListener(_ARKitWrapper2.default.ON_ERROR, this._handleOnError.bind(this));
					this._arKitWrapper.addEventListener(_ARKitWrapper2.default.AR_TRACKING_CHANGED, this._handleArTrackingChanged.bind(this));
					this._arKitWrapper.addEventListener(_ARKitWrapper2.default.COMPUTER_VISION_DATA, this._handleComputerVisionData.bind(this));
					this._reality.addEventListener(Reality.NEW_WORLD_ANCHOR, this._handleNewWorldAnchor.bind(this));
					this._reality.addEventListener(Reality.UPDATE_WORLD_ANCHOR, this._handleUpdateWorldAnchor.bind(this));
					this._reality.addEventListener(Reality.REMOVE_WORLD_ANCHOR, this._handleRemoveWorldAnchor.bind(this));
					this._arKitWrapper.waitForInit().then(function () {
						// doing this in the reality
						// this._arKitWrapper.watch()
					});
				} else {
					// doing this in the reality
					// this._arKitWrapper.watch()
				}
			} else {
				// Use device orientation
				if (this._initialized === false) {
					this._initialized = true;
					this._deviceOrientation = new _Quaternion2.default();
					this._devicePosition = new _Vector2.default();
					this._deviceWorldMatrix = new Float32Array(16);
					this._deviceOrientationTracker = new _DeviceOrientationTracker2.default();
					this._deviceOrientationTracker.addEventListener(_DeviceOrientationTracker2.default.ORIENTATION_UPDATE_EVENT, this._updateFromDeviceOrientationTracker.bind(this));
					this._reality.addEventListener(Reality.COMPUTER_VISION_DATA, this._handleComputerVisionData.bind(this));
					this._reality.addEventListener(Reality.WINDOW_RESIZE_EVENT, this._handleWindowResize.bind(this));
				}
			}
			this.running = true;
			this._reality._start(parameters);
		}
	}, {
		key: '_stop',
		value: function _stop() {
			// TODO figure out how to stop ARKit and ARCore so that CameraReality can still work
			if (this.running === false) return;
			this.running = false;
			this._reality._stop();
		}
	}, {
		key: '_fixFov',
		value: function _fixFov(width, height, focalLength) {
			if (!this.baseLayer) {
				return;
			}
			var ratio = width / this.baseLayer._context.canvas.clientWidth;
			focalLength = focalLength / ratio;

			var x = 0.5 * this.baseLayer._context.canvas.clientWidth / focalLength;
			var fovx = 180 / Math.PI * 2 * Math.atan(x);
			var y = 0.5 * this.baseLayer._context.canvas.clientHeight / focalLength;
			var fovy = 180 / Math.PI * 2 * Math.atan(y);

			// var x = (Math.tan(0.5 * fov) / this.baseLayer.framebufferHeight) * this.baseLayer.framebufferWidth
			// var fovx = (Math.atan(x) * 2) / (Math.PI/180);
			this._fov = new _XRFieldOfView2.default(fovy / 2, fovy / 2, fovx / 2, fovx / 2);

			this._views[0].fov = this._fov;
		}
	}, {
		key: '_handleWindowResize',
		value: function _handleWindowResize(ev) {
			this._fixFov(ev.detail.width, ev.detail.height, ev.detail.focalLength);
		}
	}, {
		key: '_handleNewWorldAnchor',
		value: function _handleNewWorldAnchor(event) {
			var anchorObject = event.detail;
			var coordinateSystem = new XRCoordinateSystem(this, XRCoordinateSystem.TRACKER);
			coordinateSystem._relativeMatrix = anchorObject.transform;

			var anchor = void 0;
			switch (anchorObject.type) {
				case _ARKitWrapper2.default.ANCHOR_TYPE_PLANE:
					anchor = new _XRPlaneAnchor2.default(coordinateSystem, anchorObject.uuid, anchorObject.plane_center, [anchorObject.plane_extent.x, anchorObject.plane_extent.z], anchorObject.plane_alignment, anchorObject.geometry);
					break;
				case _ARKitWrapper2.default.ANCHOR_TYPE_FACE:
					anchor = new _XRFaceAnchor2.default(coordinateSystem, anchorObject.uuid, anchorObject.geometry, anchorObject.blendShapes);
					break;
				case _ARKitWrapper2.default.ANCHOR_TYPE_ANCHOR:
					anchor = new _XRAnchor2.default(coordinateSystem, anchorObject.uuid);
					break;
				case _ARKitWrapper2.default.ANCHOR_TYPE_IMAGE:
					anchor = new _XRImageAnchor2.default(coordinateSystem, anchorObject.uuid);
					break;
			}

			this._reality._anchors.set(anchorObject.uuid, anchor);
			//console.log(`New world anchor: ${JSON.stringify(ev)}`)

			try {
				this.dispatchEvent(new CustomEvent(_XRDisplay3.default.NEW_WORLD_ANCHOR, {
					source: this,
					detail: anchor
				}));
			} catch (e) {
				console.error('NEW_WORLD_ANCHOR event error', e);
			}
		}
	}, {
		key: '_handleUpdateWorldAnchor',
		value: function _handleUpdateWorldAnchor(event) {
			var anchorUUID = event.detail;
			var anchor = this._reality._anchors.get(anchorUUID);
			if (anchor !== null) {
				try {
					this.dispatchEvent(new CustomEvent(_XRDisplay3.default.UPDATE_WORLD_ANCHOR, {
						source: this,
						detail: anchor
					}));
				} catch (e) {
					console.error('UPDATE_WORLD_ANCHOR event error', e);
				}
			}
		}
	}, {
		key: '_handleRemoveWorldAnchor',
		value: function _handleRemoveWorldAnchor(event) {
			var anchorUUID = event.detail;
			var anchor = this._reality._anchors.get(anchorUUID);
			if (anchor !== null) {
				try {
					this.dispatchEvent(new CustomEvent(_XRDisplay3.default.REMOVE_WORLD_ANCHOR, {
						source: this,
						detail: anchor
					}));
				} catch (e) {
					console.error('REMOVE_WORLD_ANCHOR event error', e);
				}
			}
		}

		/*
  Called by a session to indicate that its baseLayer attribute has been set.
  FlatDisplay just adds the layer's canvas to DOM elements created by the XR polyfill
  */

	}, {
		key: '_handleNewBaseLayer',
		value: function _handleNewBaseLayer(baseLayer) {
			this.baseLayer = baseLayer;
			baseLayer._context.canvas.style.width = "100%";
			baseLayer._context.canvas.style.height = "100%";
			baseLayer.framebufferWidth = this._xr._sessionEls.clientWidth;
			baseLayer.framebufferHeight = this._xr._sessionEls.clientHeight;

			if (this._arKitWrapper === null) {
				// TODO:  Need to remove this listener if a new base layer is set
				window.addEventListener('resize', function () {
					baseLayer.framebufferWidth = baseLayer._context.canvas.clientWidth;
					baseLayer.framebufferHeight = baseLayer._context.canvas.clientHeight;
				}, false);
			}
			//this._fixFov(baseLayer.framebufferWidth, baseLayer.framebufferHeight, this._reality._focalLength)

			this._xr._sessionEls.appendChild(baseLayer._context.canvas);
		}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame(frame) {
			if (this._vrFrameData !== null) {
				this._updateFromVRDevice();
			}
		}
	}, {
		key: '_updateFromVRDevice',
		value: function _updateFromVRDevice() {
			var _deviceOrientation, _devicePosition;

			this._reality._vrDisplay.getFrameData(this._vrFrameData);
			this._views[0].setProjectionMatrix(this._vrFrameData.leftProjectionMatrix);
			(_deviceOrientation = this._deviceOrientation).set.apply(_deviceOrientation, _toConsumableArray(this._vrFrameData.pose.orientation));
			(_devicePosition = this._devicePosition).set.apply(_devicePosition, _toConsumableArray(this._vrFrameData.pose.position));
			this._devicePosition.add(0, XRViewPose.SITTING_EYE_HEIGHT, 0);
			_MatrixMath2.default.mat4_fromRotationTranslation(this._deviceWorldMatrix, this._deviceOrientation.toArray(), this._devicePosition.toArray());
			this._views[0].setViewMatrix(this._deviceWorldMatrix);
			this._headPose._setPoseModelMatrix(this._deviceWorldMatrix);
			this._eyeLevelPose._position = this._devicePosition.toArray();
		}
	}, {
		key: '_updateFromDeviceOrientationTracker',
		value: function _updateFromDeviceOrientationTracker() {
			// TODO set XRView's FOV
			this._deviceOrientationTracker.getOrientation(this._deviceOrientation);
			this._devicePosition.set(this._headPose.poseModelMatrix[12], this._headPose.poseModelMatrix[13], this._headPose.poseModelMatrix[14]);
			this._devicePosition.add(0, XRViewPose.SITTING_EYE_HEIGHT, 0);
			_MatrixMath2.default.mat4_fromRotationTranslation(this._deviceWorldMatrix, this._deviceOrientation.toArray(), this._devicePosition.toArray());
			this._headPose._setPoseModelMatrix(this._deviceWorldMatrix);
			this._views[0].setViewMatrix(this._deviceWorldMatrix);
			this._eyeLevelPose._position = this._devicePosition.toArray();
		}
	}, {
		key: '_handleARKitUpdate',
		value: function _handleARKitUpdate() {
			var cameraTransformMatrix = this._arKitWrapper.getData('camera_transform');
			if (cameraTransformMatrix) {
				this._headPose._setPoseModelMatrix(cameraTransformMatrix);
				this._views[0].setViewMatrix(cameraTransformMatrix);
				this._headPose._poseModelMatrix[13] += XRViewPose.SITTING_EYE_HEIGHT;
				this._eyeLevelPose._position = this._headPose._position;
			} else {
				console.log('no camera transform', this._arKitWrapper.rawARData);
			}

			var cameraProjectionMatrix = this._arKitWrapper.getData('projection_camera');
			if (cameraProjectionMatrix) {
				this._views[0].setProjectionMatrix(cameraProjectionMatrix);
			} else {
				console.log('no projection camera', this._arKitWrapper.rawARData);
			}
		}
	}, {
		key: '_handleARKitInit',
		value: function _handleARKitInit(ev) {
			// doing this in the reality
			// 	setTimeout(() => {
			// 		this._arKitWrapper.watch({
			// 			location: true,
			// 			camera: true,
			// 			objects: true,
			// 			light_intensity: true,
			//             computer_vision_data: true
			// 		})
			// 	}, 1000)
		}
	}, {
		key: '_handleARKitWindowResize',
		value: function _handleARKitWindowResize(ev) {
			this.baseLayer.framebufferWidth = ev.detail.width;
			this.baseLayer.framebufferHeight = ev.detail.height;
		}
	}, {
		key: '_handleOnError',
		value: function _handleOnError(ev) {
			//"domain": "error domain",
			//"code": 1234,
			//"message": "error message"
			// Ex: > {code: 3, message: "error.localizedDescription", domain: "error.domain"}
		}
	}, {
		key: '_handleArTrackingChanged',
		value: function _handleArTrackingChanged(ev) {
			// ev.detail values
			// #define WEB_AR_TRACKING_STATE_NORMAL               @"ar_tracking_normal"
			// #define WEB_AR_TRACKING_STATE_LIMITED              @"ar_tracking_limited"
			// #define WEB_AR_TRACKING_STATE_LIMITED_INITIALIZING @"ar_tracking_limited_initializing"
			// #define WEB_AR_TRACKING_STATE_LIMITED_MOTION       @"ar_tracking_limited_excessive_motion"
			// #define WEB_AR_TRACKING_STATE_LIMITED_FEATURES     @"ar_tracking_limited_insufficient_features"
			// #define WEB_AR_TRACKING_STATE_NOT_AVAILABLE        @"ar_tracking_not_available"
			// #define WEB_AR_TRACKING_STATE_RELOCALIZING 	 	  @"ar_tracking_relocalizing"

			// the string gets sent as a single member array, pull the member out
			try {
				this.dispatchEvent(new CustomEvent(_XRDisplay3.default.TRACKING_CHANGED, {
					source: this,
					detail: ev.detail[0]
				}));
			} catch (e) {
				console.error('trackingChanged callback error', e);
			}
		}
	}, {
		key: '_handleComputerVisionData',
		value: function _handleComputerVisionData(ev) {
			// Do whatever is needed with the image buffers here
			try {
				this.dispatchEvent(new CustomEvent(_XRDisplay3.default.VIDEO_FRAME, {
					source: this,
					detail: ev.detail
				}));
			} catch (e) {
				console.error('computer vision callback error', e);
			}
		}
	}, {
		key: '_requestVideoFrame',
		value: function _requestVideoFrame() {
			if (this._arKitWrapper) {
				// Use ARKit
				// call this._arKitWrapper.requestComputerVisionData(buffers) to request a new one
				this._arKitWrapper._requestComputerVisionData();
			} else {
				//  might have webrtc video in the reality
				this._reality._requestVideoFrame();
			}
		}
	}, {
		key: '_stopVideoFrames',
		value: function _stopVideoFrames() {
			if (this._arKitWrapper) {
				// Use ARKit
				// call this._arKitWrapper.requestComputerVisionData(buffers) to request a new one
				this._arKitWrapper._stopSendingComputerVisionData();
			} else {
				//  might have webrtc video in the reality
				this._reality._stopVideoFrames();
			}
		}
	}, {
		key: '_startVideoFrames',
		value: function _startVideoFrames() {
			if (this._arKitWrapper) {
				// Use ARKit
				// call this._arKitWrapper.requestComputerVisionData(buffers) to request a new one
				this._arKitWrapper._startSendingComputerVisionData();
			} else {
				//  might have webrtc video in the reality
				this._reality._startVideoFrames();
			}
		}
	}, {
		key: '_createSession',
		value: function _createSession() {
			var _this2 = this;

			var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			this._start(parameters);

			if (_ARKitWrapper2.default.HasARKit()) {
				// Use ARKit
				return this._arKitWrapper.waitForInit().then(function () {
					return _get(FlatDisplay.prototype.__proto__ || Object.getPrototypeOf(FlatDisplay.prototype), '_createSession', _this2).call(_this2, parameters);
				});
			} else {
				return _get(FlatDisplay.prototype.__proto__ || Object.getPrototypeOf(FlatDisplay.prototype), '_createSession', this).call(this, parameters);
			}
		}
	}, {
		key: '_supportedCreationParameters',
		value: function _supportedCreationParameters(parameters) {
			return parameters.type === _XRSession2.default.AUGMENTATION && parameters.exclusive === false;
		}

		//attribute EventHandler ondeactivate; // FlatDisplay never deactivates

	}]);

	return FlatDisplay;
}(_XRDisplay3.default);

exports.default = FlatDisplay;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Euler = function () {
	function Euler(x, y, z) {
		var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Euler.DefaultOrder;

		_classCallCheck(this, Euler);

		this.x = x;
		this.y = y;
		this.z = z;
		this.order = order;
	}

	_createClass(Euler, [{
		key: 'set',
		value: function set(x, y, z) {
			var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Euler.DefaultOrder;

			this.x = x;
			this.y = y;
			this.z = z;
			this.order = order;
		}
	}, {
		key: 'toArray',
		value: function toArray() {
			return [this.x, this.y, this.z];
		}
	}]);

	return Euler;
}();

exports.default = Euler;


Euler.RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];
Euler.DefaultOrder = 'XYZ';

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRDisplay2 = __webpack_require__(6);

var _XRDisplay3 = _interopRequireDefault(_XRDisplay2);

var _XRView = __webpack_require__(13);

var _XRView2 = _interopRequireDefault(_XRView);

var _XRSession = __webpack_require__(11);

var _XRSession2 = _interopRequireDefault(_XRSession);

var _XRViewPose = __webpack_require__(14);

var _XRViewPose2 = _interopRequireDefault(_XRViewPose);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _Quaternion = __webpack_require__(2);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _Vector = __webpack_require__(15);

var _Vector2 = _interopRequireDefault(_Vector);

var _DeviceOrientationTracker = __webpack_require__(24);

var _DeviceOrientationTracker2 = _interopRequireDefault(_DeviceOrientationTracker);

var _ARKitWrapper = __webpack_require__(5);

var _ARKitWrapper2 = _interopRequireDefault(_ARKitWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
HeadMountedDisplay wraps a WebVR 1.1 display, like a Vive, Rift, or Daydream.
*/
var HeadMountedDisplay = function (_XRDisplay) {
	_inherits(HeadMountedDisplay, _XRDisplay);

	function HeadMountedDisplay(xr, reality, vrDisplay) {
		_classCallCheck(this, HeadMountedDisplay);

		var _this = _possibleConstructorReturn(this, (HeadMountedDisplay.__proto__ || Object.getPrototypeOf(HeadMountedDisplay)).call(this, xr, vrDisplay.displayName, vrDisplay.capabilities.hasExternalDisplay, reality));

		_this._vrDisplay = vrDisplay;
		_this._vrFrameData = new VRFrameData();

		// The view projection matrices will be reset using VRFrameData during this._handleNewFrame
		_this._leftView = new _XRView2.default(_this._fov, _this._depthNear, _this._depthFar, _XRView2.default.LEFT);
		_this._rightView = new _XRView2.default(_this._fov, _this._depthNear, _this._depthFar, _XRView2.default.RIGHT);
		_this._views = [_this._leftView, _this._rightView];

		// These will be used to set the head and eye level poses during this._handleNewFrame
		_this._deviceOrientation = new _Quaternion2.default();
		_this._devicePosition = new _Vector2.default();
		_this._deviceWorldMatrix = new Float32Array(16);
		return _this;
	}

	/*
 Called via the XRSession.requestAnimationFrame
 */


	_createClass(HeadMountedDisplay, [{
		key: '_requestAnimationFrame',
		value: function _requestAnimationFrame(callback) {
			if (this._vrDisplay.isPresenting) {
				this._vrDisplay.requestAnimationFrame(callback);
			} else {
				window.requestAnimationFrame(callback);
			}
		}

		/*
  Called by a session to indicate that its baseLayer attribute has been set.
  This is where the VRDisplay is used to create a session 
  */

	}, {
		key: '_handleNewBaseLayer',
		value: function _handleNewBaseLayer(baseLayer) {
			var _this2 = this;

			this._vrDisplay.requestPresent([{
				source: baseLayer._context.canvas
			}]).then(function () {
				var leftEye = _this2._vrDisplay.getEyeParameters('left');
				var rightEye = _this2._vrDisplay.getEyeParameters('right');
				baseLayer.framebufferWidth = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
				baseLayer.framebufferHeight = Math.max(leftEye.renderHeight, rightEye.renderHeight);
				baseLayer._context.canvas.style.position = 'absolute';
				baseLayer._context.canvas.style.bottom = '1px';
				baseLayer._context.canvas.style.right = '1px';
				baseLayer._context.canvas.style.width = "100%";
				baseLayer._context.canvas.style.height = "100%";
				document.body.appendChild(baseLayer._context.canvas);
			}).catch(function (e) {
				console.error('Unable to init WebVR 1.1 display', e);
			});
		}
	}, {
		key: '_stop',
		value: function _stop() {
			// TODO figure out how to stop ARKit and ARCore so that CameraReality can still work
			if (this.running === false) return;
			this.running = false;
			this._reality._stop();
		}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame(frame) {
			if (this._vrDisplay.isPresenting) {
				this._updateFromVRFrameData();
			}
		}
	}, {
		key: '_handleAfterFrame',
		value: function _handleAfterFrame(frame) {
			if (this._vrDisplay.isPresenting) {
				this._vrDisplay.submitFrame();
			}
		}
	}, {
		key: '_supportedCreationParameters',
		value: function _supportedCreationParameters(parameters) {
			return parameters.type === _XRSession2.default.REALITY && parameters.exclusive === true;
		}
	}, {
		key: '_updateFromVRFrameData',
		value: function _updateFromVRFrameData() {
			this._vrDisplay.getFrameData(this._vrFrameData);
			this._leftView.setViewMatrix(this._vrFrameData.leftViewMatrix);
			this._rightView.setViewMatrix(this._vrFrameData.rightViewMatrix);
			this._leftView.setProjectionMatrix(this._vrFrameData.leftProjectionMatrix);
			this._rightView.setProjectionMatrix(this._vrFrameData.rightProjectionMatrix);
			if (this._vrFrameData.pose) {
				if (this._vrFrameData.pose.orientation) {
					var _deviceOrientation;

					(_deviceOrientation = this._deviceOrientation).set.apply(_deviceOrientation, _toConsumableArray(this._vrFrameData.pose.orientation));
				}
				if (this._vrFrameData.pose.position) {
					var _devicePosition;

					(_devicePosition = this._devicePosition).set.apply(_devicePosition, _toConsumableArray(this._vrFrameData.pose.position));
				}
				_MatrixMath2.default.mat4_fromRotationTranslation(this._deviceWorldMatrix, this._deviceOrientation.toArray(), this._devicePosition.toArray());
				if (this._vrDisplay.stageParameters && this._vrDisplay.stageParameters.sittingToStandingTransform) {
					_MatrixMath2.default.mat4_multiply(this._deviceWorldMatrix, this._vrDisplay.stageParameters.sittingToStandingTransform, this._deviceWorldMatrix);
				}
				this._headPose._setPoseModelMatrix(this._deviceWorldMatrix);
				this._eyeLevelPose.position = this._devicePosition.toArray();
			}
		}
	}]);

	return HeadMountedDisplay;
}(_XRDisplay3.default);

exports.default = HeadMountedDisplay;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Reality2 = __webpack_require__(7);

var _Reality3 = _interopRequireDefault(_Reality2);

var _XRAnchor = __webpack_require__(1);

var _XRAnchor2 = _interopRequireDefault(_XRAnchor);

var _XRViewPose = __webpack_require__(14);

var _XRViewPose2 = _interopRequireDefault(_XRViewPose);

var _XRAnchorOffset = __webpack_require__(21);

var _XRAnchorOffset2 = _interopRequireDefault(_XRAnchorOffset);

var _XRLightEstimate = __webpack_require__(20);

var _XRLightEstimate2 = _interopRequireDefault(_XRLightEstimate);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _Quaternion = __webpack_require__(2);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _ARKitWrapper = __webpack_require__(5);

var _ARKitWrapper2 = _interopRequireDefault(_ARKitWrapper);

var _ARCoreCameraRenderer = __webpack_require__(41);

var _ARCoreCameraRenderer2 = _interopRequireDefault(_ARCoreCameraRenderer);

var _XRImageAnchor = __webpack_require__(9);

var _XRImageAnchor2 = _interopRequireDefault(_XRImageAnchor);

var _XRPlaneAnchor = __webpack_require__(10);

var _XRPlaneAnchor2 = _interopRequireDefault(_XRPlaneAnchor);

var _XRFaceAnchor = __webpack_require__(8);

var _XRFaceAnchor2 = _interopRequireDefault(_XRFaceAnchor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
CameraReality displays the forward facing camera.

If this is running in the iOS ARKit wrapper app, the camera data will be displayed in a Metal layer below the WKWebKit layer.
If this is running in the Google ARCore Chrome application, it will create a canvas element and use the ARCore provided camera data.
If there is no ARKit or ARCore available, it will use WebRTC's MediaStream to render camera data into a canvas.
*/
var CameraReality = function (_Reality) {
	_inherits(CameraReality, _Reality);

	function CameraReality(xr) {
		_classCallCheck(this, CameraReality);

		var _this = _possibleConstructorReturn(this, (CameraReality.__proto__ || Object.getPrototypeOf(CameraReality)).call(this, xr, 'Camera', true, true));

		_this._initialized = false;
		_this._running = false;

		// camera fovy: start with 70 degrees on the long axis of at 320x240
		_this._cameraFov = 70 * Math.PI / 180;
		_this._focalLength = 160 / Math.tan(_this._cameraFov / 2);
		_this._cameraIntrinsics = [_this._focalLength, 0, 0, 0, _this._focalLength, 0, 160, 120, 1];

		// These are used if we have access to ARKit
		_this._arKitWrapper = null;

		// These are used if we do not have access to ARKit
		_this._mediaStream = null;
		_this._videoEl = null;

		// These are used if we're using the Google ARCore web app
		_this._arCoreCameraRenderer = null;
		_this._arCoreCanvas = null;
		_this._elContext = null;
		_this._vrDisplay = null;
		_this._vrFrameData = null;

		// dealing with video frames from webrtc
		_this._sendingVideo = false;
		_this._videoFramesPaused = false;
		_this._sendVideoFrame = false;
		_this._videoProjectionMatrix = _MatrixMath2.default.mat4_generateIdentity();
		_this._videoViewMatrix = _MatrixMath2.default.mat4_generateIdentity();

		_this._lightEstimate = new _XRLightEstimate2.default();

		// Try to find a WebVR 1.1 display that supports Google's ARCore extensions
		if (typeof navigator.getVRDisplays === 'function') {
			navigator.getVRDisplays().then(function (displays) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = displays[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var display = _step.value;

						if (display === null) continue;
						if (display.capabilities.hasPassThroughCamera) {
							// This is the ARCore extension to WebVR 1.1
							_this._vrDisplay = display;
							_this._vrFrameData = new VRFrameData();
							if (!window.WebARonARKitSetData) {
								_this._arCoreCanvas = document.createElement('canvas');
								_this._xr._realityEls.appendChild(_this._arCoreCanvas);
								_this._arCoreCanvas.width = window.innerWidth;
								_this._arCoreCanvas.height = window.innerHeight;
								_this._elContext = _this._arCoreCanvas.getContext('webgl');
								if (_this._elContext === null) {
									throw 'Could not create CameraReality GL context';
								}
							}
							break;
						}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			});
		}

		window.addEventListener('resize', function () {
			if (_this._arCoreCanvas) {
				_this._arCoreCanvas.width = window.innerWidth;
				_this._arCoreCanvas.height = window.innerHeight;
			}
			if (_this._videoEl) {
				setTimeout(function () {
					_this._adjustVideoSize();
				}, 10);
			}
		}, false);
		return _this;
	}

	_createClass(CameraReality, [{
		key: '_setFovy',
		value: function _setFovy(fovy) {
			this._cameraFov = fovy * Math.PI / 180;
			if (!this._videoEl) {
				this._focalLength = 0;
				return;
			}

			if (this._videoRenderWidth > this._videoRenderHeight) {
				this._focalLength = this._videoRenderWidth / 2 / Math.tan(this._cameraFov / 2);
			} else {
				this._focalLength = this._videoRenderHeight / 2 / Math.tan(this._cameraFov / 2);
			}
			this._cameraIntrinsics = [this._focalLength, 0, 0, 0, this._focalLength, 0, this._videoRenderWidth / 2, this._videoRenderHeight / 2, 1];
		}
	}, {
		key: '_adjustVideoSize',
		value: function _adjustVideoSize() {

			var canvasWidth = this._videoRenderWidth;
			var canvasHeight = this._videoRenderHeight;
			var cameraAspect = canvasWidth / canvasHeight;

			var width = this._videoEl.videoWidth;
			var height = this._videoEl.videoHeight;
			var videoSourceAspect = width / height;
			if (videoSourceAspect != cameraAspect) {
				// let's pick a size such that the video is below 512 in size in both dimensions
				while (width > 512 || height > 512) {
					width = width / 2;
					height = height / 2;
				}

				canvasWidth = this._videoRenderWidth = width;
				canvasHeight = this._videoRenderHeight = height;
				var cameraAspect = canvasWidth / canvasHeight;

				if (this._videoFrameCanvas) {
					this._videoFrameCanvas.width = width;
					this._videoFrameCanvas.height = height;
				}
			}

			this._setFovy(this._cameraFov / (Math.PI / 180));

			var windowWidth = this._xr._realityEls.clientWidth;
			var windowHeight = this._xr._realityEls.clientHeight;
			var windowAspect = windowWidth / windowHeight;

			var translateX = 0;
			var translateY = 0;
			if (cameraAspect > windowAspect) {
				canvasWidth = canvasHeight * windowAspect;
				windowWidth = windowHeight * cameraAspect;
				translateX = -(windowWidth - this._xr._realityEls.clientWidth) / 2;
			} else {
				canvasHeight = canvasWidth / windowAspect;
				windowHeight = windowWidth / cameraAspect;
				translateY = -(windowHeight - this._xr._realityEls.clientHeight) / 2;
			}

			this._videoEl.style.width = windowWidth.toFixed(2) + 'px';
			this._videoEl.style.height = windowHeight.toFixed(2) + 'px';
			this._videoEl.style.transform = "translate(" + translateX.toFixed(2) + "px, " + translateY.toFixed(2) + "px)";

			try {
				this.dispatchEvent(new CustomEvent(_Reality3.default.WINDOW_RESIZE_EVENT, {
					source: this,
					detail: {
						width: canvasWidth,
						height: canvasHeight,
						focalLength: this._focalLength
					}
				}));
			} catch (e) {
				console.error('WINDOW_RESIZE_EVENT error', e);
			}
		}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame(frame) {
			if (this._vrDisplay) {
				if (this._arCoreCameraRenderer) {
					this._arCoreCameraRenderer.render();
				}
				this._vrDisplay.getFrameData(this._vrFrameData);
			}

			// WebRTC video
			if (this._videoEl && this._sendVideoFrame && !this._videoFramesPaused) {
				this._sendVideoFrame = false;

				var canvasWidth = this._videoRenderWidth;
				var canvasHeight = this._videoRenderHeight;
				this._videoCtx.drawImage(this._videoEl, 0, 0, canvasWidth, canvasHeight);
				var imageData = this._videoCtx.getImageData(0, 0, canvasWidth, canvasHeight);

				var data = imageData.data;
				var len = imageData.data.length;
				// imageData = new ArrayBuffer(len)
				// var buffData = new Uint8Array(imageData);
				// for (var i = 0; i < len; i++) buffData[i] = data[i] 

				var buffers = [{
					size: {
						width: canvasWidth,
						height: canvasHeight,
						bytesPerRow: canvasWidth * 4,
						bytesPerPixel: 4
					},
					buffer: imageData
				}];

				var pixelFormat = XRVideoFrame.IMAGEFORMAT_RGBA32;

				var timestamp = frame.timestamp;

				// set from frame
				var view = frame.views[0];

				//this._videoViewMatrix.set(view.viewMatrix);
				_MatrixMath2.default.mat4_invert(this._videoViewMatrix, view.viewMatrix);

				this._videoProjectionMatrix.set(view.projectionMatrix);

				var camera = {
					arCamera: false,
					cameraOrientation: 0,
					cameraIntrinsics: this._cameraIntrinsics.slice(0),
					// cameraIntrinsics: [(this._videoEl.videoWidth/2) / Math.tan(view._fov.leftDegrees * Math.PI/180), 0, (this._videoEl.videoWidth/2), 
					// 					0, (this._videoEl.videoHeight/2) / Math.tan(view._fov.upDegrees * Math.PI/180), (this._videoEl.videoHeight/2), 
					// 					0, 0, 1],
					cameraImageResolution: {
						width: this._videoEl.videoWidth,
						height: this._videoEl.videoHeight
					},
					viewMatrix: this._videoViewMatrix,
					projectionMatrix: this._videoProjectionMatrix
				};

				var xrVideoFrame = new XRVideoFrame(buffers, pixelFormat, timestamp, camera);

				try {
					this.dispatchEvent(new CustomEvent(_Reality3.default.COMPUTER_VISION_DATA, {
						source: this,
						detail: xrVideoFrame
					}));
				} catch (e) {
					console.error('COMPUTER_VISION_DATA event error', e);
				}
			}
			// TODO update the anchor positions using ARCore or ARKit
		}
	}, {
		key: '_start',
		value: function _start() {
			var _this2 = this;

			var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (this._running) return;
			this._running = true;

			if (this._vrDisplay !== null) {
				// Using WebAR
				if (window.WebARonARKitSetData) {
					// WebARonARKit renders camera separately
				} else {
					this._arCoreCameraRenderer = new _ARCoreCameraRenderer2.default(this._vrDisplay, this._elContext);
				}
				this._initialized = true;
			} else if (_ARKitWrapper2.default.HasARKit()) {
				// Using ARKit
				if (this._initialized === false) {
					this._initialized = true;
					this._arKitWrapper = _ARKitWrapper2.default.GetOrCreate();
					this._arKitWrapper.addEventListener(_ARKitWrapper2.default.WATCH_EVENT, this._handleARKitWatch.bind(this));
					this._arKitWrapper.waitForInit().then(function () {
						_this2._arKitWrapper.watch(parameters);
					});
				} else {
					this._arKitWrapper.watch(parameters);
				}
			} else {
				// Using WebRTC
				if (this._initialized === false) {
					this._initialized = true;
					navigator.mediaDevices.getUserMedia({
						audio: false,
						video: { facingMode: "environment" }
					}).then(function (stream) {
						_this2._videoEl = document.createElement('video');
						_this2._xr._realityEls.appendChild(_this2._videoEl);
						_this2._videoEl.setAttribute('class', 'camera-reality-video');
						_this2._videoEl.setAttribute('playsinline', true);
						_this2._videoEl.style.width = '100%';
						_this2._videoEl.style.height = '100%';
						_this2._videoEl.srcObject = stream;
						_this2._videoEl.play();
						_this2._setupWebRTC(parameters);
					}).catch(function (err) {
						console.error('Could not set up video stream', err);
						_this2._initialized = false;
						_this2._running = false;
					});
				} else {
					if (this._videoEl) {
						this._xr._realityEls.appendChild(this._videoEl);
						this._videoEl.play();
						this._setupWebRTC(parameters);
					}
				}
			}
		}
	}, {
		key: '_setupWebRTC',
		value: function _setupWebRTC(parameters) {
			var _this3 = this;

			if (parameters.videoFrames) {
				this._sendingVideo = true;

				this._videoEl.addEventListener('loadedmetadata', function () {
					var width = _this3._videoEl.videoWidth;
					var height = _this3._videoEl.videoHeight;

					// let's pick a size such that the video is below 512 in size in both dimensions
					while (width > 256 || height > 256) {
						width = width / 2;
						height = height / 2;
					}

					_this3._videoRenderWidth = width;
					_this3._videoRenderHeight = height;
					_this3._videoFrameCanvas = document.createElement('canvas');
					_this3._videoFrameCanvas.width = width;
					_this3._videoFrameCanvas.height = height;
					_this3._videoCtx = _this3._videoFrameCanvas.getContext('2d');

					_this3._adjustVideoSize();

					_this3._sendVideoFrame = true;
				});
			}
		}
	}, {
		key: '_requestVideoFrame',
		value: function _requestVideoFrame() {
			this._sendVideoFrame = true;
		}
	}, {
		key: '_stopVideoFrames',
		value: function _stopVideoFrames() {
			this._videoFramesPaused = true;
		}
	}, {
		key: '_startVideoFrames',
		value: function _startVideoFrames() {
			this._videoFramesPaused = false;
		}
	}, {
		key: '_stop',
		value: function _stop() {
			if (this._running === false) return;
			this._running = false;
			if (_ARKitWrapper2.default.HasARKit()) {
				if (this._arKitWrapper === null) {
					return;
				}
				this._arKitWrapper.stop();
			} else if (this._arCoreCanvas) {
				this._xr._realityEls.removeChild(this._arCoreCanvas);
				this._arCoreCanvas = null;
			} else if (this._videoEl !== null) {
				this._videoEl.pause();
				this._xr._realityEls.removeChild(this._videoEl);
			}
		}
	}, {
		key: '_handleARKitWatch',
		value: function _handleARKitWatch(ev) {
			if (ev.detail && ev.detail.objects) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = ev.detail.objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var anchorInfo = _step2.value;

						this._updateAnchorFromARKitUpdate(anchorInfo.uuid, anchorInfo);
						try {
							this.dispatchEvent(new CustomEvent(_Reality3.default.UPDATE_WORLD_ANCHOR, {
								source: this,
								detail: anchorInfo.uuid
							}));
						} catch (e) {
							console.error('UPDATE_WORLD_ANCHOR event error', e);
						}
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}

			if (ev.detail && ev.detail.removedObjects) {
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = ev.detail.removedObjects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var removedAnchor = _step3.value;

						try {
							this.dispatchEvent(new CustomEvent(_Reality3.default.REMOVE_WORLD_ANCHOR, {
								source: this,
								detail: removedAnchor
							}));
						} catch (e) {
							console.error('REMOVE_WORLD_ANCHOR event error', e);
						}
						this._deleteAnchorFromARKitUpdate(removedAnchor);
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}
			}

			if (ev.detail && ev.detail.newObjects) {
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = ev.detail.newObjects[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var addedAnchor = _step4.value;

						try {
							this.dispatchEvent(new CustomEvent(_Reality3.default.NEW_WORLD_ANCHOR, {
								source: this,
								detail: addedAnchor
							}));
						} catch (e) {
							console.error('NEW_WORLD_ANCHOR event error', e);
						}
					}
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}
			}
		}
	}, {
		key: '_deleteAnchorFromARKitUpdate',
		value: function _deleteAnchorFromARKitUpdate(anchorUUID) {
			this._anchors.delete(anchorUUID);
		}
	}, {
		key: '_handleARKitAddObject',
		value: function _handleARKitAddObject(anchorInfo) {
			this._updateAnchorFromARKitUpdate(anchorInfo.uuid, anchorInfo);
		}
	}, {
		key: '_updateAnchorFromARKitUpdate',
		value: function _updateAnchorFromARKitUpdate(uid, anchorInfo) {
			var anchor = this._anchors.get(uid) || null;
			if (anchor === null) {
				// console.log('unknown anchor', anchor)
				return;
			}
			// This assumes that the anchor's coordinates are in the tracker coordinate system
			anchor.coordinateSystem._relativeMatrix = anchorInfo.transform;

			// update internal data if any
			switch (anchorInfo.type) {
				case _ARKitWrapper2.default.ANCHOR_TYPE_PLANE:
					anchor.center = anchorInfo.plane_center;
					anchor.extent = [anchorInfo.plane_extent.x, anchorInfo.plane_extent.z];
					anchor.alignment = anchorInfo.plane_alignment;
					anchor.geometry = anchorInfo.geometry;
					break;
				case _ARKitWrapper2.default.ANCHOR_TYPE_FACE:
					if (anchorInfo.geometry) {
						anchor.geometry.vertices = anchorInfo.geometry.vertices;
					}
					if (anchorInfo.blendShapes) {
						anchor.updateBlendShapes(anchorInfo.blendShapes);
					}
					break;
				case _ARKitWrapper2.default.ANCHOR_TYPE_ANCHOR:
					break;
				case _ARKitWrapper2.default.ANCHOR_TYPE_IMAGE:
					break;
			}
		}
	}, {
		key: '_addAnchor',
		value: function _addAnchor(anchor, display) {
			var _this4 = this;

			// Convert coordinates to the tracker coordinate system so that updating from ARKit transforms is simple
			if (this._arKitWrapper !== null) {
				this._arKitWrapper.addAnchor(anchor.uid, anchor.coordinateSystem._poseModelMatrix).then(function (detail) {
					return _this4._handleARKitAddObject(detail);
				});
			}
			// ARCore as implemented in the browser does not offer anchors except on a surface, so we just use untracked anchors
			// We also use untracked anchors for in-browser display, with WebRTC
			this._anchors.set(anchor.uid, anchor);
			return anchor.uid;
		}

		/*
  Creates an anchor offset relative to a surface, as found by a ray
  normalized screen x and y are in range 0..1, with 0,0 at top left and 1,1 at bottom right
  returns a Promise that resolves either to an AnchorOffset with the first hit result or null if the hit test failed
  */

	}, {
		key: '_findAnchor',
		value: function _findAnchor(normalizedScreenX, normalizedScreenY, display) {
			var _this5 = this;

			var testOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			return new Promise(function (resolve, reject) {
				if (_this5._arKitWrapper !== null) {
					// Perform a hit test using the ARKit integration
					_this5._arKitWrapper.hitTest(normalizedScreenX, normalizedScreenY, testOptions || _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANES).then(function (hits) {
						if (hits.length === 0) {
							resolve(null);
							// console.log('miss')
							return;
						}
						var hit = _this5._pickARKitHit(hits);

						// if it's a plane
						if (hit.anchor_transform) {
							hit.anchor_transform[13] += _XRViewPose2.default.SITTING_EYE_HEIGHT;
							hit.world_transform[13] += _XRViewPose2.default.SITTING_EYE_HEIGHT;

							// Use the first hit to create an XRAnchorOffset, creating the XRAnchor as necessary

							// TODO use XRPlaneAnchor for anchors with extents;  hopefully the plane will have been created, tho
							var anchor = _this5._getAnchor(hit.uuid);
							if (anchor === null) {
								var coordinateSystem = new XRCoordinateSystem(display, XRCoordinateSystem.TRACKER);
								coordinateSystem._relativeMatrix = hit.anchor_transform;
								anchor = new _XRAnchor2.default(coordinateSystem, hit.uuid);
								_this5._anchors.set(anchor.uid, anchor);
							}

							var offsetPosition = [hit.world_transform[12] - hit.anchor_transform[12], hit.world_transform[13] - hit.anchor_transform[13], hit.world_transform[14] - hit.anchor_transform[14]];
							var worldRotation = new _Quaternion2.default().setFromRotationMatrix(hit.world_transform);
							var inverseAnchorRotation = new _Quaternion2.default().setFromRotationMatrix(hit.anchor_transform).inverse();
							var offsetRotation = new _Quaternion2.default().multiplyQuaternions(worldRotation, inverseAnchorRotation);
							var anchorOffset = new _XRAnchorOffset2.default(anchor.uid);
							anchorOffset.poseMatrix = _MatrixMath2.default.mat4_fromRotationTranslation(new Float32Array(16), offsetRotation.toArray(), offsetPosition);
							resolve(anchorOffset);
						} else {
							var _coordinateSystem = new XRCoordinateSystem(display, XRCoordinateSystem.TRACKER);
							_coordinateSystem._relativeMatrix = hit.world_transform;
							var _anchor = new _XRAnchor2.default(_coordinateSystem, hit.uuid);
							_this5._anchors.set(_anchor.uid, _anchor);

							var _anchorOffset = new _XRAnchorOffset2.default(_anchor.uid);
							resolve(_anchorOffset);
						}
					});
				} else if (_this5._vrDisplay !== null) {
					// Perform a hit test using the ARCore data
					var hits = _this5._vrDisplay.hitTest(normalizedScreenX, normalizedScreenY);
					if (hits.length == 0) {
						resolve(null);
						return;
					}
					hits.sort(function (a, b) {
						return a.distance - b.distance;
					});
					var anchor = _this5._getAnchor(hits[0].uuid);
					if (anchor === null) {
						var coordinateSystem = new XRCoordinateSystem(display, XRCoordinateSystem.TRACKER);
						coordinateSystem._relativeMatrix = hits[0].modelMatrix;
						coordinateSystem._relativeMatrix[13] += _XRViewPose2.default.SITTING_EYE_HEIGHT;
						anchor = new _XRAnchor2.default(coordinateSystem);
						_this5._anchors.set(anchor.uid, anchor);
					}
					resolve(new _XRAnchorOffset2.default(anchor.uid));
				} else {
					resolve(null); // No platform support for finding anchors
				}
			});
		}

		/**
  * Creates an ARReferenceImage in the ARKit native side
   * @param uid the ID of the image to create
   * @param buffer the base64 encoded image
   * @param width
   * @param height
   * @param physicalWidthInMeters
   * @returns a promise when the image has been created, error otherwise
   * @private
   */

	}, {
		key: '_createImageAnchor',
		value: function _createImageAnchor(uid, buffer, width, height, physicalWidthInMeters) {
			if (this._arKitWrapper) {
				return this._arKitWrapper.createImageAnchor(uid, buffer, width, height, physicalWidthInMeters);
			} else {
				return null;
			}
		}

		/**
  * _activateDetectionImage Uses the ARKit wrapper to add a new reference image to the set of detection images in the ARKit configuration object
  * and runs the session again. The promise is resolved when the image is detected by ARKit
   * @param uid The name (id) if the image to activate. It has to be previously created calling the "createImageAnchor" method
   * @param display The current display
   * @returns {Promise<any>} A promise resolved with the image transform in case of success, rejected with error otherwise
   */

	}, {
		key: '_activateDetectionImage',
		value: function _activateDetectionImage(uid, display) {
			var _this6 = this;

			return new Promise(function (resolve, reject) {
				if (_this6._arKitWrapper) {
					_this6._arKitWrapper.activateDetectionImage(uid).then(function (aRKitImageAnchor) {
						if (aRKitImageAnchor.activated === true) {
							var coordinateSystem = new XRCoordinateSystem(display, XRCoordinateSystem.TRACKER);
							coordinateSystem._relativeMatrix = aRKitImageAnchor.imageAnchor.transform;
							var anchor = new _XRImageAnchor2.default(coordinateSystem, aRKitImageAnchor.imageAnchor.uuid);
							_this6._anchors.set(aRKitImageAnchor.imageAnchor.uuid, anchor);
							resolve(aRKitImageAnchor.imageAnchor.transform);
						} else if (aRKitImageAnchor.error !== null) {
							reject(aRKitImageAnchor.error);
						} else {
							reject(null);
						}
					});
				} else {
					reject('ARKit not supported');
				}
			});
		}
	}, {
		key: '_removeAnchor',
		value: function _removeAnchor(uid) {
			if (this._arKitWrapper) {
				this._arKitWrapper.removeAnchor(uid);
			} else if (this._getAnchor(uid)) {
				this._anchors.delete(uid);
			}
		}
	}, {
		key: '_pickARKitHit',
		value: function _pickARKitHit(data) {
			if (data.length === 0) return null;
			var info = null;

			var planeResults = data.filter(function (hitTestResult) {
				return hitTestResult.type != _ARKitWrapper2.default.HIT_TEST_TYPE_FEATURE_POINT;
			});
			var planeExistingUsingExtentResults = planeResults.filter(function (hitTestResult) {
				return hitTestResult.type == _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT;
			});
			var planeExistingResults = planeResults.filter(function (hitTestResult) {
				return hitTestResult.type == _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE;
			});

			if (planeExistingUsingExtentResults.length) {
				// existing planes using extent first
				planeExistingUsingExtentResults = planeExistingUsingExtentResults.sort(function (a, b) {
					return a.distance - b.distance;
				});
				info = planeExistingUsingExtentResults[0];
			} else if (planeExistingResults.length) {
				// then other existing planes
				planeExistingResults = planeExistingResults.sort(function (a, b) {
					return a.distance - b.distance;
				});
				info = planeExistingResults[0];
			} else if (planeResults.length) {
				// other types except feature points
				planeResults = planeResults.sort(function (a, b) {
					return a.distance - b.distance;
				});
				info = planeResults[0];
			} else {
				// feature points if any
				info = data[0];
			}
			return info;
		}

		/*
  Found intersections with anchors and planes by a ray normalized screen x and y are in range 0..1, with 0,0 at top left and 1,1 at bottom right
  returns an Array of VRHit
  */

	}, {
		key: '_hitTestNoAnchor',
		value: function _hitTestNoAnchor(normalizedScreenX, normalizedScreenY, display) {
			if (this._arKitWrapper !== null) {
				// Perform a hit test using the ARKit integration
				var hits = this._arKitWrapper.hitTestNoAnchor(normalizedScreenX, normalizedScreenY);
				for (var i = 0; i < hits.length; i++) {
					hits[i].modelMatrix[13] += _XRViewPose2.default.SITTING_EYE_HEIGHT;
				}
				if (hits.length == 0) {
					return null;
				}
				return hits;
			} else if (this._vrDisplay !== null) {
				// Perform a hit test using the ARCore data
				var _hits = this._vrDisplay.hitTest(normalizedScreenX, normalizedScreenY);
				for (var _i = 0; _i < _hits.length; _i++) {
					_hits[_i].modelMatrix[13] += _XRViewPose2.default.SITTING_EYE_HEIGHT;
				}
				if (_hits.length == 0) {
					return null;
				}
				return _hits;
			} else {
				// No platform support for finding anchors
				return null;
			}
		}
	}, {
		key: '_getHasLightEstimate',
		value: function _getHasLightEstimate() {
			if (this._arKitWrapper !== null) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: '_getLightAmbientIntensity',
		value: function _getLightAmbientIntensity() {
			if (this._arKitWrapper !== null) {
				this._lightEstimate.ambientIntensity = this._arKitWrapper.lightIntensity;
				return this._lightEstimate.ambientIntensity;
			} else {
				// No platform support for ligth estimation
				return null;
			}
		}
	}, {
		key: '_getWorldMappingStatus',
		value: function _getWorldMappingStatus() {
			if (this._arKitWrapper !== null) {
				return this._arKitWrapper.worldMappingStatus;
			} else {
				// No platform support for ligth estimation
				return null;
			}
		}

		/**
  * retrieves a worldMap from the platform, if possible
     * @returns a promise when the worldMap has been retrieved
     * @private
     */

	}, {
		key: '_getWorldMap',
		value: function _getWorldMap() {
			var _this7 = this;

			return new Promise(function (resolve, reject) {
				if (_this7._arKitWrapper) {
					_this7._arKitWrapper.getWorldMap().then(function (ARKitWorldMap) {
						if (ARKitWorldMap.saved === true) {
							resolve(ARKitWorldMap.worldMap);
						} else if (ARKitWorldMap.error !== null) {
							reject(ARKitWorldMap.error);
						} else {
							reject(null);
						}
					});
				} else {
					reject('ARKit not supported');
				}
			});
		}

		/**
   * sets a worldMap for the platform, if possible
   * @param worldMap a platform specific worldmap
      * @returns a promise when the worldMap has been set
      * @private
      */

	}, {
		key: '_setWorldMap',
		value: function _setWorldMap(worldMap) {
			if (this._arKitWrapper) {
				return this._arKitWrapper.setWorldMap(worldMap);
			} else {
				return new Promise(function (resolve, reject) {
					reject(new Error('setWorldMap not supported'));
				});
			}
		}
	}, {
		key: '_getTimeStamp',
		value: function _getTimeStamp(timestamp) {
			if (this._arKitWrapper !== null) {
				return this._arKitWrapper.timestamp;
			} else {
				// use performance.now()
				//return 	( performance || Date ).now();
				return timestamp;
			}
		}
		/*
  No floor in AR
  */

	}, {
		key: '_findFloorAnchor',
		value: function _findFloorAnchor(display) {
			var uid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			return new Promise(function (resolve, reject) {
				resolve(null);
			});
		}
	}]);

	return CameraReality;
}(_Reality3.default);

exports.default = CameraReality;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License')
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fragmentSource = '#extension GL_OES_EGL_image_external : require\n\nprecision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform samplerExternalOES uSampler;\n\nvoid main(void) {\n  gl_FragColor = texture2D(uSampler, vTextureCoord);\n}';

var vertexSource = 'attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n  gl_Position = vec4(aVertexPosition, 1.0);\n  vTextureCoord = aTextureCoord;\n}';

/**
 * Creates and load a shader from a string, type specifies either 'vertex' or 'fragment'
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} str
 * @param {string} type
 * @return {!WebGLShader}
 */
function getShader(gl, str, type) {
	if (type == 'fragment') {
		var shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (type == 'vertex') {
		var shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	var result = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!result) {
		console.error(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

/**
 * Creates a shader program from vertex and fragment shader sources
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vs
 * @param {string} fs
 * @return {!WebGLProgram}
 */
function getProgram(gl, vs, fs) {
	var vertexShader = getShader(gl, vs, 'vertex');
	var fragmentShader = getShader(gl, fs, 'fragment');
	if (!fragmentShader) {
		return null;
	}

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	var result = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
	if (!result) {
		console.error('Could not initialise arview shaders');
	}

	return shaderProgram;
}

/**
 * Calculate the correct orientation depending on the device and the camera
 * orientations.
 *
 * @param {number} screenOrientation
 * @param {number} seeThroughCameraOrientation
 * @return {number}
 */
function combineOrientations(screenOrientation, seeThroughCameraOrientation) {
	var seeThroughCameraOrientationIndex = 0;
	switch (seeThroughCameraOrientation) {
		case 90:
			seeThroughCameraOrientationIndex = 1;
			break;
		case 180:
			seeThroughCameraOrientationIndex = 2;
			break;
		case 270:
			seeThroughCameraOrientationIndex = 3;
			break;
		default:
			seeThroughCameraOrientationIndex = 0;
			break;
	}
	var screenOrientationIndex = 0;
	switch (screenOrientation) {
		case 90:
			screenOrientationIndex = 1;
			break;
		case 180:
			screenOrientationIndex = 2;
			break;
		case 270:
			screenOrientationIndex = 3;
			break;
		default:
			screenOrientationIndex = 0;
			break;
	}
	var ret = screenOrientationIndex - seeThroughCameraOrientationIndex;
	if (ret < 0) {
		ret += 4;
	}
	return ret % 4;
}

/**
 * Renders the ar camera's video texture
 */

var ARVideoRenderer = function () {
	/**
  * @param {VRDisplay} vrDisplay
  * @param {WebGLRenderingContext} gl
  */
	function ARVideoRenderer(vrDisplay, gl) {
		_classCallCheck(this, ARVideoRenderer);

		this.vrDisplay = vrDisplay;
		this.gl = gl;
		this.passThroughCamera = vrDisplay.getPassThroughCamera();
		this.program = getProgram(gl, vertexSource, fragmentSource);

		gl.useProgram(this.program);

		// Setup a quad
		this.vertexPositionAttribute = gl.getAttribLocation(this.program, 'aVertexPosition');
		this.textureCoordAttribute = gl.getAttribLocation(this.program, 'aTextureCoord');

		this.samplerUniform = gl.getUniformLocation(this.program, 'uSampler');

		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		var vertices = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0];
		var f32Vertices = new Float32Array(vertices);
		gl.bufferData(gl.ARRAY_BUFFER, f32Vertices, gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = 12;

		this.textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
		// Precalculate different texture UV coordinates depending on the possible
		// orientations of the device depending if there is a VRDisplay or not
		var textureCoords = null;
		if (this.vrDisplay) {
			var u = this.passThroughCamera.width / this.passThroughCamera.textureWidth;
			var v = this.passThroughCamera.height / this.passThroughCamera.textureHeight;
			textureCoords = [[0.0, 0.0, 0.0, v, u, 0.0, u, v], [u, 0.0, 0.0, 0.0, u, v, 0.0, v], [u, v, u, 0.0, 0.0, v, 0.0, 0.0], [0.0, v, u, v, 0.0, 0.0, u, 0.0]];
		} else {
			textureCoords = [[0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0], [1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0], [1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0], [0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0]];
		}

		this.f32TextureCoords = [];
		for (var i = 0; i < textureCoords.length; i++) {
			this.f32TextureCoords.push(new Float32Array(textureCoords[i]));
		}
		// Store the current combined orientation to check if it has changed
		// during the update calls and use the correct texture coordinates.
		this.combinedOrientation = combineOrientations(screen.orientation.angle, this.passThroughCamera.orientation);

		gl.bufferData(gl.ARRAY_BUFFER, this.f32TextureCoords[this.combinedOrientation], gl.STATIC_DRAW);
		this.textureCoordBuffer.itemSize = 2;
		this.textureCoordBuffer.numItems = 8;
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		var indices = [0, 1, 2, 2, 1, 3];
		var ui16Indices = new Uint16Array(indices);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ui16Indices, gl.STATIC_DRAW);
		this.indexBuffer.itemSize = 1;
		this.indexBuffer.numItems = 6;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		this.texture = gl.createTexture();
		gl.useProgram(null);

		// The projection matrix will be based on an identify orthographic camera
		this.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
		this.mvMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
		return this;
	}

	/**
  * Renders the quad
  */


	_createClass(ARVideoRenderer, [{
		key: 'render',
		value: function render() {
			var gl = this.gl;
			gl.useProgram(this.program);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
			gl.enableVertexAttribArray(this.vertexPositionAttribute);
			gl.vertexAttribPointer(this.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

			// Check the current orientation of the device combined with the
			// orientation of the VRSeeThroughCamera to determine the correct UV
			// coordinates to be used.
			var combinedOrientation = combineOrientations(screen.orientation.angle, this.passThroughCamera.orientation);
			if (combinedOrientation !== this.combinedOrientation) {
				this.combinedOrientation = combinedOrientation;
				gl.bufferData(gl.ARRAY_BUFFER, this.f32TextureCoords[this.combinedOrientation], gl.STATIC_DRAW);
			}
			gl.enableVertexAttribArray(this.textureCoordAttribute);
			gl.vertexAttribPointer(this.textureCoordAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_EXTERNAL_OES, this.texture);
			// Update the content of the texture in every frame.
			gl.texImage2D(gl.TEXTURE_EXTERNAL_OES, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.passThroughCamera);
			gl.uniform1i(this.samplerUniform, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

			gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

			// Disable enabled states to allow other render calls to correctly work
			gl.bindTexture(gl.TEXTURE_EXTERNAL_OES, null);
			gl.disableVertexAttribArray(this.vertexPositionAttribute);
			gl.disableVertexAttribArray(this.textureCoordAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
			gl.useProgram(null);
		}
	}]);

	return ARVideoRenderer;
}();

/**
 * A helper class that takes a VRDisplay with AR capabilities
 * and renders the see through camera to the passed in WebGL context.
 */


var ARCoreCameraRenderer = function () {
	function ARCoreCameraRenderer(vrDisplay, gl) {
		_classCallCheck(this, ARCoreCameraRenderer);

		this.vrDisplay = vrDisplay;
		this.gl = gl;

		this.videoRenderer = new ARVideoRenderer(vrDisplay, this.gl);

		// Cache the width/height so we're not potentially forcing
		// a reflow if there's been a style invalidation
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		window.addEventListener('resize', this.onWindowResize.bind(this), false);
	}

	/**
  * Updates the stored width/height of window on resize.
  */


	_createClass(ARCoreCameraRenderer, [{
		key: 'onWindowResize',
		value: function onWindowResize() {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		}

		/**
   * Renders the see through camera to the passed in gl context
   */

	}, {
		key: 'render',
		value: function render() {
			var gl = this.gl;
			var dpr = 1;
			var width = this.width * dpr;
			var height = this.height * dpr;

			if (gl.viewportWidth !== width) {
				gl.viewportWidth = width;
			}

			if (gl.viewportHeight !== height) {
				gl.viewportHeight = height;
			}

			this.gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			this.videoRenderer.render();
		}
	}]);

	return ARCoreCameraRenderer;
}();

exports.default = ARCoreCameraRenderer;

/***/ })
/******/ ]);
XRDisplay = window.XRDisplay
XRSession = window.XRSession
XRSessionCreateParameters = window.XRSessionCreateParameters
Reality = window.Reality
XRPointCloud = window.XRPointCloud
XRLightEstimate = window.XRLightEstimate
XRAnchor = window.XRAnchor;
XRPlaneAnchor = window.XRPlaneAnchor;
XRFaceAnchor = window.XRFaceAnchor;
XRImageAnchor = window.XRImageAnchor;
XRAnchorOffset = window.XRAnchorOffset;
XRStageBounds = window.XRStageBounds;
XRStageBoundsPoint = window.XRStageBoundsPoint;
XRPresentationFrame = window.XRPresentationFrame;
XRView = window.XRView;
XRViewport = window.XRViewport;
XRCoordinateSystem = window.XRCoordinateSystem;
XRViewPose = window.XRViewPose;
XRLayer = window.XRLayer;
XRWebGLLayer = window.XRWebGLLayer; 
XRVideoFrame = window.XRVideoFrame;
