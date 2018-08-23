import UI from '../../ui/UI';

/**
 * 场景面板
 * @author mrdoob / http://mrdoob.com/
 */
function HierachyPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

HierachyPanel.prototype = Object.create(UI.Control.prototype);
HierachyPanel.prototype.constructor = HierachyPanel;

HierachyPanel.prototype.render = function () {
    var editor = this.app.editor;

    var _this = this;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        children: [{ // outliner
            xtype: 'outliner',
            id: 'outliner',
            editor: editor,
            onChange: function () {
                _this.app.call('outlinerChange', _this, this);
            },
            onDblClick: function () {
                editor.focusById(parseInt(this.getValue()));
            }
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default HierachyPanel;