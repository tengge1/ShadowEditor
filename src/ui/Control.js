import XType from './XType';

var ID = -1;

/**
 * 所有控件基类
 * @param {*} options 选项
 */
function Control(options) {
    options = options || {};
    this.parent = options.parent || document.body;
    this.id = options.id || 'Control' + ID--;
}

/**
 * 渲染控件
 */
Control.prototype.render = function () {

};

XType.add('control', Control);

export default Control;