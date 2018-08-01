import Control from './Control';

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