/**
* 场景
*/
ZeroGIS.Scene = function (args) {
    ZeroGIS.Object3DComponents.apply(this, arguments);
};

ZeroGIS.Scene.prototype = new ZeroGIS.Object3DComponents();

ZeroGIS.Scene.prototype.constructor = ZeroGIS.Scene;
