import UI from '../../ui/UI';

/**
 * 历史记录面板
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */
function HistoryPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
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
            xtype: 'outliner',
            id: 'historyOutlinear',
            onChange: this.onChange.bind(this)
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
    this.app.on(`editorCleared.${this.id}`, this.refreshUI.bind(this));
    this.app.on(`historyChanged.${this.id}`, this.refreshUI.bind(this));
};

HistoryPanel.prototype.onAppStarted = function () {
    var outliner = UI.get('historyOutlinear');
    outliner.editor = this.app.editor;
    this.refreshUI();
};

HistoryPanel.prototype.refreshUI = function () {
    var history = this.app.editor.history;
    var outliner = UI.get('historyOutlinear');

    var options = [];

    function buildOption(object) {
        var option = document.createElement('div');
        option.value = object.id;
        return option;
    }

    (function addObjects(objects) {
        for (var i = 0, l = objects.length; i < l; i++) {
            var object = objects[i];
            var option = buildOption(object);
            option.innerHTML = '&nbsp;' + object.name;
            options.push(option);
        }
    })(history.undos);


    (function addObjects(objects, pad) {
        for (var i = objects.length - 1; i >= 0; i--) {
            var object = objects[i];
            var option = buildOption(object);
            option.innerHTML = '&nbsp;' + object.name;
            option.style.opacity = 0.3;
            options.push(option);
        }
    })(history.redos, '&nbsp;');

    outliner.setOptions(options);
};

HistoryPanel.prototype.onChange = function () {
    var history = this.app.editor.history;
    var outliner = UI.get('historyOutlinear');

    history.goToState(parseInt(outliner.getValue()));
};

export default HistoryPanel;