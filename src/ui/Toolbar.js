/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function (editor) {

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setId('toolbar');

    var buttons = new UI.Panel();
    container.add(buttons);

    // translate / rotate / scale

    var translate = new UI.Button('移动');
    translate.dom.title = 'W';
    translate.dom.className = 'Button selected';
    translate.onClick(function () {

        signals.transformModeChanged.dispatch('translate');

    });
    buttons.add(translate);

    var rotate = new UI.Button('旋转');
    rotate.dom.title = 'E';
    rotate.onClick(function () {

        signals.transformModeChanged.dispatch('rotate');

    });
    buttons.add(rotate);

    var scale = new UI.Button('缩放');
    scale.dom.title = 'R';
    scale.onClick(function () {

        signals.transformModeChanged.dispatch('scale');

    });
    buttons.add(scale);

    signals.transformModeChanged.add(function (mode) {

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

    var snap = new UI.THREE.Boolean(false, '单元').onChange(update);
    buttons.add(snap);

    var local = new UI.THREE.Boolean(false, '本地').onChange(update);
    buttons.add(local);

    var showGrid = new UI.THREE.Boolean(true, '显示').onChange(update);
    buttons.add(showGrid);

    function update() {

        signals.snapChanged.dispatch(snap.getValue() === true ? grid.getValue() : null);
        signals.spaceChanged.dispatch(local.getValue() === true ? "本地" : "世界");
        signals.showGridChanged.dispatch(showGrid.getValue());

    }

    return container;

};
