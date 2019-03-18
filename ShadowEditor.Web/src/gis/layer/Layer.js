var ID = -1;

/**
 * 层
 */
function Layer() {
    this.id = `${this.constructor.name}${ID--}`;
    this.name = `Layer`;
}

export default Layer;