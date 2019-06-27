var ID = -1;

/**
 * 工具基类
 * @author tengge / https://github.com/tengge1
 */
function BaseTool(app) {
    app = app;
    this.id = `${this.constructor.name}${ID--}`;

    this.dispatch = d3.dispatch('end');

    this.call = this.dispatch.call.bind(this.dispatch);
    this.on = this.dispatch.on.bind(this.dispatch);
}

BaseTool.prototype.start = function () {

};

BaseTool.prototype.stop = function () {

};

export default BaseTool;