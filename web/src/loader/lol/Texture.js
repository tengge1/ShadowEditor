/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * @author lolking / http://www.lolking.net/models
 * @author tengge / https://github.com/tengge1
 * @param {Model} model 模型
 * @param {String} url 地址
 */
function Texture(model, url) {
    var self = this;
    self.model = model;
    self.url = url;
    self.texture = null;
    self.load();
}

Texture.prototype.load = function () {
    var self = this;

    self.texture = new THREE.TextureLoader().load(self.url, function (texture) {
        self.onLoad.call(self, texture);
    });
};

Texture.prototype.onLoad = function (texture) {
    var self = this;
    texture.flipY = false;
    self.model.material.map = texture;
    self.model.material.needsUpdate = true;

    self.model.dispatch.call('loadTexture');
};

export default Texture;