import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function StatusBar(app) {
    this.app = app;
    var editor = this.app.editor;

    var container = new UI.Panel();
    container.setId('toolbar');

    var buttons = new UI.Panel();
    container.add(buttons);

    // translate / rotate / scale

    var translate = new UI.Button('移动');
    translate.dom.title = 'W';
    translate.dom.className = 'Button selected';

    var _this = this;
    translate.onClick(function () {
        _this.app.call('transformModeChanged', _this, 'translate');
    });
    buttons.add(translate);

    var rotate = new UI.Button('旋转');
    rotate.dom.title = 'E';
    rotate.onClick(function () {
        _this.app.call('transformModeChanged', _this, 'rotate');
    });
    buttons.add(rotate);

    var scale = new UI.Button('缩放');
    scale.dom.title = 'R';
    scale.onClick(function () {
        _this.app.call('transformModeChanged', _this, 'scale');
    });
    buttons.add(scale);

    this.app.on('transformModeChanged.Toolbar', function (mode) {
        translate.dom.classList.remove('selected');
        rotate.dom.classList.remove('selected');
        scale.dom.classList.remove('selected');

        switch (mode) {

            case 'translate': translate.dom.classList.add('selected'); break;
            case 'rotate': rotate.dom.classList.add('selected'); break;
            case 'scale': scale.dom.classList.add('selected'); break;

        }
    });

    // grid

    var grid = new UI.Number(25).setWidth('40px').onChange(update);
    buttons.add(new UI.Text('网格：'));
    buttons.add(grid);

    var snap = new UI.Boolean(false, '单元').onChange(update);
    buttons.add(snap);

    var local = new UI.Boolean(false, '本地').onChange(update);
    buttons.add(local);

    var showGrid = new UI.Boolean(true, '网格').onChange(update);
    buttons.add(showGrid);

    function update() {
        _this.app.call('snapChanged', _this, snap.getValue() === true ? grid.getValue() : null);
        _this.app.call('spaceChanged', _this, local.getValue() === true ? "local" : "world");
        _this.app.call('showGridChanged', _this, showGrid.getValue());
    }

    return container;
};

export default StatusBar;