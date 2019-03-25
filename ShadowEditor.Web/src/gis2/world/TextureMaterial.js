define(["world/Utils"], function(Utils) {
  var TextureMaterial = function(args) {
    if (args) {
      this.texture = gl.createTexture();
      this.image = null;
      this.loaded = false;
      this.delete = false;
      if (args.image instanceof Image && args.image.width > 0 && args.image.height > 0) {
        this.setImage(args.image);
      } else if (typeof args.url == "string") {
        this.setImageUrl(args.url);
      }
    }
  };

  TextureMaterial.prototype.setImage = function(image) {
    if (image instanceof Image && image.width > 0 && image.height > 0) {
      this.image = image;
      this.onLoad();
    }
  };
  TextureMaterial.prototype.setImageUrl = function(url) {
    if (!Utils.isString(url)) {
      throw "invalid url: not string";
    }
    this.image = new Image();
    this.image.crossOrigin = 'anonymous'; //很重要，因为图片是跨域获得的，所以一定要加上此句代码
    this.image.onload = this.onLoad.bind(this);
    this.image.src = url;
  };
  //图片加载完成时触发
  TextureMaterial.prototype.onLoad = function() {
    //要考虑纹理已经被移除掉了图片才进入onLoad这种情况
    if (this.delete) {
      return;
    }

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //使用MipMap
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //LINEAR_MIPMAP_NEAREST LINEAR_MIPMAP_LINEAR
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.loaded = true;
  };
  //释放显卡中的texture资源
  TextureMaterial.prototype.releaseTexture = function() {
    if (gl.isTexture(this.texture)) {
      gl.deleteTexture(this.texture);
      this.delete = true;
    }
  };
  return TextureMaterial;
});