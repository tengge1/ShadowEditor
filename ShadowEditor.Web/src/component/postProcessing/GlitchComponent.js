import BaseComponent from '../BaseComponent';

/**
 * 毛刺组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function GlitchComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

GlitchComponent.prototype = Object.create(BaseComponent.prototype);
GlitchComponent.prototype.constructor = GlitchComponent;

GlitchComponent.prototype.render = function () {
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
                text: '毛刺特效'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '启用状态'
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
                text: '疯狂模式'
            }, {
                xtype: 'checkbox',
                id: 'wild',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

GlitchComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

GlitchComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

GlitchComponent.prototype.updateUI = function () {
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
    var wild = UI.get('wild', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.glitch) {
        enabled.setValue(postProcessing.glitch.enabled);
        wild.setValue(postProcessing.glitch.wild);
    }
};

GlitchComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var wild = UI.get('wild', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        glitch: {
            enabled: enabled.getValue(),
            wild: wild.getValue()
        },
    });

    this.app.call(`postProcessingChanged`, this);
};

export default GlitchComponent;