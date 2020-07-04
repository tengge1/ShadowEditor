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
 * 精灵
 * @param {THREE.SpriteMaterial} material 材质
 */
function Sprite(material = new THREE.SpriteMaterial()) {
    THREE.Sprite.call(this, material);

    this.name = _t('Sprite');
}

Sprite.prototype = Object.create(THREE.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;