import BaseTool from './BaseTool';

/**
 * 挖坑工具
 * @param {*} app 
 */
function DigTool(app) {
    BaseTool.call(this, app);
}

DigTool.prototype = Object.create(BaseTool.prototype);
DigTool.prototype.constructor = DigTool;

DigTool.prototype.start = function () {
    this.app.on(`raycast.${this.id}`, this.onRaycast.bind(this));
    this.app.on(`dblclick.${this.id}`, this.onDblClick.bind(this));
};

DigTool.prototype.stop = function () {
    this.app.on(`raycast.${this.id}`, null);
};

DigTool.prototype.onRaycast = function (obj) {

};

DigTool.prototype.onDblClick = function () {
    this.call('end');
};

export default DigTool;