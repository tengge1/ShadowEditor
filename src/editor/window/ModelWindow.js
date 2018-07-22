import UI from '../../ui/UI';

/**
 * 模型窗口
 * @param {*} options 
 */
function ModelWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

ModelWindow.prototype = Object.create(UI.Control.prototype);
ModelWindow.prototype.constructor = ModelWindow;

ModelWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'modal',
        id: 'modelWindow',
        parent: this.parent,
        children: [{
            xtype: 'button',
            text: '确定'
        }]
    });
    container.render();
};

ModelWindow.prototype.show = function () {
    UI.get('modelWindow').show();
};

export default ModelWindow;