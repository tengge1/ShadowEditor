import BaseComponent from '../BaseComponent';

/**
 * 水组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function WaterComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;

    this.isPlaying = false;
}

WaterComponent.prototype = Object.create(BaseComponent.prototype);
WaterComponent.prototype.constructor = WaterComponent;

WaterComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'waterPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'label',
            style: {
                width: '100%',
                color: '#555',
                fontWeight: 'bold'
            },
            text: '水组件'
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label'
            }, {
                xtype: 'button',
                id: 'btnPreview',
                scope: this.id,
                text: '预览',
                onClick: this.onPreview.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

WaterComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

WaterComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

WaterComponent.prototype.updateUI = function () {
    var container = UI.get('waterPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected.userData.type === 'Water') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var btnPreview = UI.get('btnPreview', this.id);

    if (this.isPlaying) {
        btnPreview.setText('取消');
    } else {
        btnPreview.setText('预览');
    }
};

WaterComponent.prototype.onPreview = function () {
    if (this.isPlaying) {
        this.stopPreview();
    } else {
        this.startPreview();
    }
};

WaterComponent.prototype.startPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = true;
    btnPreview.setText('取消');

    this.app.on(`animate.${this.id}`, this.onAnimate.bind(this));
};

WaterComponent.prototype.stopPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = false;
    btnPreview.setText('预览');

    this.app.on(`animate.${this.id}`, null);
};

WaterComponent.prototype.onAnimate = function (clock, deltaTime) {
    this.selected.update();
};

export default WaterComponent;