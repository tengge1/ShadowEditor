define(["world/Utils"], function(Utils) {
  //缓存图片信息1、2、3、4级的图片信息
  var Image1 = {
    MAX_LEVEL: 4, //缓存图片的最大level
    images: {}
  };
  Image1.add = function(url, img) {
    if (!Utils.isString(url)) {
      throw "invalid url: not string";
    }
    if (!(img instanceof HTMLImageElement)) {
      throw "invalid img: not HTMLImageElement";
    }
    this.images[url] = img;
  };
  Image1.get = function(url) {
    if (!Utils.isString(url)) {
      throw "invalid url: not string";
    }
    return this.images[url];
  };
  Image1.remove = function(url) {
    if (!(Utils.isString(url))) {
      throw "invalid url: not string";
    }
    delete this.images[url];
  };
  Image1.clear = function() {
    this.images = {};
  };
  Image1.getCount = function() {
    var count = 0;
    for (var url in this.images) {
      if (this.images.hasOwnProperty(url)) {
        count++;
      }
    }
    return count;
  };
  return Image1;
});