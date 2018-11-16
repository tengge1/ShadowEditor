import { UI } from '../third_party';
import ModelWindow from './window/ModelWindow';

/**
 * 工具栏
 * @author tengge / https://github.com/tengge1
 */
function Toolbar(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

Toolbar.prototype = Object.create(UI.Control.prototype);
Toolbar.prototype.constructor = Toolbar;

Toolbar.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'toolbar',
        children: [{
            xtype: 'iconbutton',
            id: 'selectBtn',
            scope: this.id,
            icon: 'icon-select',
            title: '选择',
            onClick: this.enterSelectMode.bind(this)
        }, {
            xtype: 'iconbutton',
            id: 'translateBtn',
            scope: this.id,
            icon: 'icon-translate',
            cls: 'Button IconButton selected',
            title: '平移(W)',
            onClick: this.enterTranslateMode.bind(this)
        }, {
            xtype: 'iconbutton',
            id: 'rotateBtn',
            scope: this.id,
            icon: 'icon-rotate',
            title: '旋转(E)',
            onClick: this.enterRotateMode.bind(this)
        }, {
            xtype: 'iconbutton',
            id: 'scaleBtn',
            scope: this.id,
            icon: 'icon-scale',
            title: '缩放(R)',
            onClick: this.enterScaleMode.bind(this)
        }, {
            xtype: 'hr'
        }, {
            xtype: 'iconbutton',
            icon: 'icon-model-view',
            title: '模型',
            onClick: this.showModelWindow.bind(this)
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

// --------------------------------- 选择模式 -------------------------------------

Toolbar.prototype.enterSelectMode = function () {
    this.app.call('changeMode', this, 'select');
};

// -------------------------------- 平移模式 --------------------------------------

Toolbar.prototype.enterTranslateMode = function () {
    this.app.call('changeMode', this, 'translate');
};

// -------------------------------- 旋转模式 ---------------------------------------

Toolbar.prototype.enterRotateMode = function () {
    this.app.call('changeMode', this, 'rotate');
};

// -------------------------------- 缩放模式 ---------------------------------------

Toolbar.prototype.enterScaleMode = function () {
    this.app.call('changeMode', this, 'scale');
};

// ------------------------------ 模式改变事件 -------------------------------------

Toolbar.prototype.onChangeMode = function (mode) {
    var selectBtn = UI.get('selectBtn', this.id);
    var translateBtn = UI.get('translateBtn', this.id);
    var rotateBtn = UI.get('rotateBtn', this.id);
    var scaleBtn = UI.get('scaleBtn', this.id);

    selectBtn.unselect();
    translateBtn.unselect();
    rotateBtn.unselect();
    scaleBtn.unselect();

    switch (mode) {
        case 'select':
            selectBtn.select();
            break;
        case 'translate':
            translateBtn.select();
            break;
        case 'rotate':
            rotateBtn.select();
            break;
        case 'scale':
            scaleBtn.select();
            break;
    }
};

// -------------------------------- 模型窗口 ---------------------------------------

Toolbar.prototype.showModelWindow = function () {
    if (this.modelWindow == null) {
        this.modelWindow = new ModelWindow({
            parent: this.app.container,
            app: this.app
        });
        this.modelWindow.render();
    }
    this.modelWindow.show();
};

export default Toolbar;