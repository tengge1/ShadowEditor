/**
 * 精灵
 * @param {*} material 材质
 */
function Sprite(material = new THREE.SpriteMaterial()) {
    THREE.Sprite.call(this, material);

    this.name = L_SPRITE;
}

Sprite.prototype = Object.create(THREE.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;