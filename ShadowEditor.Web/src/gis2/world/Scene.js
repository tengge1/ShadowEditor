import Object3DComponents from './Object3DComponents';

var Scene = function (args) {
    Object3DComponents.apply(this, arguments);
};

Scene.prototype = new Object3DComponents();
Scene.prototype.constructor = Scene;

export default Scene;