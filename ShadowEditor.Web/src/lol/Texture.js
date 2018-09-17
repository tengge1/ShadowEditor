/**
 * @author lolking / http://www.lolking.net/models
 * @author tengge / https://github.com/tengge1
 */
function Texture(model, url) {
    var self = this;
    self.model = model;
    self.url = url;
    self.texture = null;
    self.load()
};

Texture.prototype.load = function () {
    var self = this;

    self.texture = new THREE.TextureLoader().load(self.url, function (texture) {
        self.onLoad.call(self, texture);
    });
};

Texture.prototype.onLoad = function (texture) {
    var self = this;
    texture.flipY = false;
    self.model.material.uniforms.uHasTexture.value = 1;
    self.model.material.uniforms.uTexture.value = texture;
    self.model.material.needsUpdate = true;

    self.model.dispatch.call('loadTexture');
};

export default Texture;