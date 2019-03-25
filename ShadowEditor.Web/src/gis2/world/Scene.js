define(["world/Object3DComponents"], function(Object3DComponents) {
  var Scene = function(args) {
    Object3DComponents.apply(this, arguments);
  };
  Scene.prototype = new Object3DComponents();
  Scene.prototype.constructor = Scene;
  return Scene;
});