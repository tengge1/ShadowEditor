/**
* 瓦片材质
*/
ZeroGIS.TileMaterial = function (args) {
    if (args) {
        if (!args.image && typeof args.url == "string") {
            var tileImage = ZeroGIS.Image.get(args.url);
            if (tileImage) {
                args.image = tileImage;
                delete args.url;
            }
        }
        this.level = typeof args.level == "number" && args.level >= 0 ? args.level : 20;
        ZeroGIS.TextureMaterial.apply(this, arguments);
    }
};

ZeroGIS.TileMaterial.prototype = new ZeroGIS.TextureMaterial();

ZeroGIS.TileMaterial.prototype.constructor = ZeroGIS.TileMaterial;

ZeroGIS.TileMaterial.prototype.onLoad = function (event) {
    if (this.level <= ZeroGIS.Image.MAX_LEVEL) {
        ZeroGIS.Image.add(this.image.src, this.image);
    }
    ZeroGIS.TextureMaterial.prototype.onLoad.apply(this, arguments);
};