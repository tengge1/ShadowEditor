import UI from '../../ui/UI';

/**
 * 历史记录面板
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */
function HistoryPanel(options) {
    UI.Control.call(this, options);
};

HistoryPanel.prototype = Object.create(UI.Control.prototype);
HistoryPanel.prototype.constructor = HistoryPanel;

HistoryPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        children: [{
            xtype: 'label',
            text: L_HISTORY
        }, {
            xtype: 'br'
        }, {
            xtype: 'br'
        }, {
            xtype: 'div',
            id: 'panel',
            scope: this.id,
            style: {
                width: '100%',
                height: '320px',
                border: '1px solid #ddd',
                overflowY: 'auto'
            }
        }]
    };

    var control = UI.create(data);
    control.render();

    var panel = UI.get('panel', this.id);
    panel.dom.addEventListener('click', this.onChange.bind(this));

    app.on(`editorCleared.${this.id}`, this.refreshUI.bind(this));
    app.on(`historyChanged.${this.id}`, this.refreshUI.bind(this));
};

HistoryPanel.prototype.refreshUI = function () {
    var panel = UI.get('panel', this.id);

    panel.dom.innerHTML = '';

    var history = app.editor.history;

    // 撤销
    for (var i = 0, l = history.undos.length; i < l; i++) {
        var undo = history.undos[i];
        var option = document.createElement('div');
        option.value = undo.id;
        option.innerHTML = `&nbsp;${undo.name}`;
        option.style.padding = '4px';
        panel.dom.appendChild(option);
    }

    // 重做
    for (var i = history.redos.length - 1; i >= 0; i--) {
        var redo = history.redos[i];
        var option = document.createElement('div');
        option.value = redo.id;
        option.innerHTML = `&nbsp;${redo.name}`;
        option.style.opacity = 0.3;
        option.style.padding = '4px';
        panel.dom.appendChild(option);
    }
};

HistoryPanel.prototype.onChange = function (event) {
    if (!event.target.value) {
        return;
    }

    app.editor.history.goToState(event.target.value);
};

export default HistoryPanel;