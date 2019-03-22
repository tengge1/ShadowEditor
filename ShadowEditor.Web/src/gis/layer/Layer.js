var ID = -1;

/**
 * 图层
 */
function Layer() {
    this.id = `${this.constructor.name}${ID--}`;
    this.name = this.constructor.name;
}

Layer.prototype.get = function () {

};

Layer.prototype.dispose = function () {

};

export default Layer;