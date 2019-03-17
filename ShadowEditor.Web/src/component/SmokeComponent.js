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
            text: L_SMOKE_COMPONENT
        },
        // {
        //     xtype: 'row',
        //     children: [{
        //         xtype: 'label',
        //         text: '数量'
        //     }, {
        //         xtype: 'int',
        //         id: 'particleCount',
        //         scope: this.id,
        //         range: [0, Infinity],
        //         onChange: this.onChange.bind(this)
        //     }]
        // }, 
        {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '尺寸'
            }, {
                xtype: 'int',
                id: 'size',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '时长'
            }, {
                xtype: 'int',
                id: 'lifetime',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label'
            }, {
                xtype: 'button',
                id: 'btnPreview',
                scope: this.id,
                text: L_PREVIEW,
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

    // var particleCount = UI.get('particleCount', this.id);
    var size = UI.get('size', this.id);
    var lifetime = UI.get('lifetime', this.id);
    var btnPreview = UI.get('btnPreview', this.id);

    // particleCount.setValue(this.selected.userData.particleCount);
    size.setValue(this.selected.userData.size);
    lifetime.setValue(this.selected.userData.lifetime);

    if (this.isPlaying) {
        btnPreview.setText(L_CANCEL);
    } else {
        btnPreview.setText(L_PREVIEW);
    }
};

SmokeComponent.prototype.onChange = function () {
    // var particleCount = UI.get('particleCount', this.id);
    var size = UI.get('size', this.id);
    var lifetime = UI.get('lifetime', this.id);

    // this.selected.userData.particleCount = particleCount.getValue();
    this.selected.userData.size = size.getValue();
    this.selected.userData.lifetime = lifetime.getValue();

    this.selected.material.uniforms.size.value = size.getValue();
    this.selected.material.uniforms.lifetime.value = lifetime.getValue();
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
    btnPreview.setText(L_CANCEL);

    this.app.on(`animate.${this.id}`, this.onAnimate.bind(this));
};

SmokeComponent.prototype.stopPreview = function () {
    var btnPreview = UI.get('btnPreview', this.id);

    this.isPlaying = false;
    btnPreview.setText(L_PREVIEW);

    this.app.on(`animate.${this.id}`, null);
};

SmokeComponent.prototype.onAnimate = function (clock, deltaTime) {
    var elapsed = clock.getElapsedTime();
    this.selected.update(elapsed);
};

export default SmokeComponent;