var ID = -1;

/**
 * 工具基类
 * @author tengge / https://github.com/tengge1
 */
function BaseTool(app) {
    this.app = app;
    this.id = `${this.constructor.name}${ID--}`;
}

BaseTool.prototype.start = function () {

};

BaseTool.prototype.stop = function () {

};

export default BaseTool;