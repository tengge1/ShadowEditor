import BaseComponent from '../BaseComponent';

/**
 * 多重采样抗锯齿(SMAA)组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SmaaComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SmaaComponent.prototype = Object.create(BaseComponent.prototype);
SmaaComponent.prototype.constructor = SmaaComponent;

SmaaComponent.prototype.render = function () {
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
                text: L_SMAA
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
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SmaaComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SmaaComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SmaaComponent.prototype.updateUI = function () {
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

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.smaa) {
        enabled.setValue(postProcessing.smaa.enabled);
    }
};

SmaaComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        smaa: {
            enabled: enabled.getValue(),
        },
    });

    this.app.call(`postProcessingChanged`, this);
};

export default SmaaComponent;