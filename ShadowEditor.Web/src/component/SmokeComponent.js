import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 烟组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SmokeComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;

    this.isPlaying = false;
}

SmokeComponent.prototype = Object.create(BaseComponent.prototype);
SmokeComponent.prototype.constructor = SmokeComponent;

SmokeComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'smokePanel',
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
            text: '烟组件'
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

SmokeComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SmokeComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SmokeComponent.prototype.updateUI = function () {
    var container = UI.get('smokePanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected.userData.type === 'Smoke') {
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

SmokeComponent.prototype.onPreview = function () {
    if (this.isPlaying) {
        this.stopPreview();
    } else {
        this.startPreview();
    }
};

SmokeComponent.prototype.startPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = true;
    btnPreview.setText('取消');

    this.app.on(`animate.${this.id}`, this.onAnimate.bind(this));
};

SmokeComponent.prototype.stopPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = false;
    btnPreview.setText('预览');

    this.app.on(`animate.${this.id}`, null);
};

SmokeComponent.prototype.onAnimate = function (clock, deltaTime) {
    var elapsed = clock.getElapsedTime();
    this.selected.update(elapsed);
};

export default SmokeComponent;