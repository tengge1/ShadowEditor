import UI from '../../ui/UI';

/**
 * 组件面板
 * @author tengge / https://github.com/tengge1
 */
function ComponentPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

ComponentPanel.prototype = Object.create(UI.Control.prototype);
ComponentPanel.prototype.constructor = ComponentPanel;

ComponentPanel.prototype.render = function () {
    var editor = this.app.editor;
    var history = editor.history;

    var _this = this;

    var ignoreObjectSelectedSignal = false;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        children: [{
            xtype: 'label',
            text: '组件'
        }, {
            xtype: 'br'
        }, {
            xtype: 'br'
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default ComponentPanel;