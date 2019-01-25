import BaseComponent from '../BaseComponent';

/**
 * 背景虚化特效组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function BokehComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

BokehComponent.prototype = Object.create(BaseComponent.prototype);
BokehComponent.prototype.constructor = BokehComponent;

BokehComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'panel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold',
                    width: '100%'
                },
                text: L_BOKEH_EFFECT
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ENABLE_STATE
            }, {
                xtype: 'checkbox',
                id: 'enabled',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_FOCUS
            }, {
                xtype: 'number',
                id: 'focus',
                scope: this.id,
                value: 50, // 距离相机距离，哪里最清晰
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_APERTURE
            }, {
                xtype: 'number',
                id: 'aperture',
                scope: this.id,
                value: 2.8, // *1e-4，光圈越小越清楚
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MAX_BLUR
            }, {
                xtype: 'number',
                id: 'maxBlur',
                scope: this.id,
                value: 1, // 最大模糊程度，越大越模糊
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

BokehComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

BokehComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

BokehComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var enabled = UI.get('enabled', this.id);
    var focus = UI.get('focus', this.id);
    var aperture = UI.get('aperture', this.id);
    var maxBlur = UI.get('maxBlur', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.bokeh) {
        enabled.setValue(postProcessing.bokeh.enabled);
        focus.setValue(postProcessing.bokeh.focus);
        aperture.setValue(postProcessing.bokeh.aperture);
        maxBlur.setValue(postProcessing.bokeh.maxBlur);
    }
};

BokehComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var focus = UI.get('focus', this.id);
    var aperture = UI.get('aperture', this.id);
    var maxBlur = UI.get('maxBlur', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        bokeh: {
            enabled: enabled.getValue(),
            focus: focus.getValue(),
            aperture: aperture.getValue(),
            maxBlur: maxBlur.getValue(),
        },
    });

    this.app.call(`postProcessingChanged`, this);
};

export default BokehComponent;