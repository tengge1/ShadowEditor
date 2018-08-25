import UI from '../../ui/UI';

/**
 * 场景层次图面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function HierachyPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

HierachyPanel.prototype = Object.create(UI.Control.prototype);
HierachyPanel.prototype.constructor = HierachyPanel;

HierachyPanel.prototype.render = function () {
    var editor = this.app.editor;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        children: [{
            xtype: 'outliner',
            id: 'outliner',
            editor: editor,
            onChange: this.onChange.bind(this),
            onDblClick: this.onDblClick.bind(this)
        }]
    };

    var control = UI.create(data);
    control.render();
};

HierachyPanel.prototype.onChange = function () {
    var editor = this.app.editor;
    var outliner = UI.get('outliner');

    editor.selectById(parseInt(outliner.getValue()));
};

HierachyPanel.prototype.onDblClick = function () {
    var editor = this.app.editor;
    var outliner = UI.get('outliner');

    editor.focusById(parseInt(outliner.getValue()));
};

export default HierachyPanel;