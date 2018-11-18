import Control from './Control';

/**
 * 工具栏填充器
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ToolbarFiller(options) {
    Control.call(this, options);
}

ToolbarFiller.prototype = Object.create(Control.prototype);
ToolbarFiller.prototype.constructor = ToolbarFiller;

ToolbarFiller.prototype.render = function () {
    this.children = [{
        xtype: 'div',
        parent: this.parent,
        style: {
            flex: 1
        }
    }];

    var control = UI.create(this.children[0]);
    control.render();
    this.dom = control.dom;
};

export default ToolbarFiller;