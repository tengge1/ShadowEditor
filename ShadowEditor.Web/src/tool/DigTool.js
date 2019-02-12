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
    debugger
};

DigTool.prototype.stop = function () {

};

export default DigTool;