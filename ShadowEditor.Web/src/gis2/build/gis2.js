(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Shadow = {})));
}(this, (function (exports) { 'use strict';

	/**
	* 地球
	*/

	/**
	* 谷歌瓦片图层
	*/
	function GoogleTiledLayer(args) {
	    ZeroGIS.TiledLayer.apply(this, arguments);
	}
	GoogleTiledLayer.prototype = new ZeroGIS.TiledLayer();
	GoogleTiledLayer.prototype.constructor = GoogleTiledLayer;

	GoogleTiledLayer.prototype.getImageUrl = function (level, row, column) {
	    ZeroGIS.TiledLayer.prototype.getImageUrl.apply(this, arguments);
	    var sum = level + row + column;
	    var idx = 1 + sum % 3;
	    var url = "//mt" + idx + ".google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x=" + column + "&y=" + row + "&z=" + level + "&s=Galil";
	    return url;
	};

	exports.Globe = GLobe;
	exports.GoogleTiledLayer = GoogleTiledLayer;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
