var ID = -1;

/**
 * 图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 地球
 */
function Layer(globe) {
    this.globe = globe;

    this.id = `${this.constructor.name}${ID--}`;
    this.name = this.constructor.name;
}

/**
 * 获取某个经纬度范围内的资源
 * @param {THREE.Box2} aabb 包围盒
 */
Layer.prototype.get = function (aabb) { // eslint-disable-line

};

/**
 * 释放该图层所有资源
 */
Layer.prototype.dispose = function () {
    delete this.globe;
};

export default Layer;