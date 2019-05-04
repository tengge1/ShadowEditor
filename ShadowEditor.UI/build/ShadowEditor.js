(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Shadow = {})));
}(this, (function (exports) { 'use strict';

	function Button() {
	  return React.createElement("button", null);
	}

	exports.Button = Button;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
