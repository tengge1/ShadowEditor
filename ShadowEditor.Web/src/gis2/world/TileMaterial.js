define(["world/TextureMaterial", "world/Image"], function(TextureMaterial, Image1) {
  //TileMaterial继承自TextureMaterial
  var TileMaterial = function(args) {
    if (args) {
      if (!args.image && typeof args.url == "string") {
        var tileImage = Image1.get(args.url);
        if (tileImage) {
          args.image = tileImage;
          delete args.url;
        }
      }
      this.level = typeof args.level == "number" && args.level >= 0 ? args.level : 20;
      TextureMaterial.apply(this, arguments);
    }
  };
  TileMaterial.prototype = new TextureMaterial();
  TileMaterial.prototype.constructor = TileMaterial;
  TileMaterial.prototype.onLoad = function(event) {
    if (this.level <= Image1.MAX_LEVEL) {
      Image1.add(this.image.src, this.image);
    }
    TextureMaterial.prototype.onLoad.apply(this, arguments);
  };
  return TileMaterial;
});