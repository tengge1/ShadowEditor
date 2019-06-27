import BaseComponent from '../BaseComponent';

/**
 * 点阵化组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function DotScreenComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

DotScreenComponent.prototype = Object.create(BaseComponent.prototype);
DotScreenComponent.prototype.constructor = DotScreenComponent;

DotScreenComponent.prototype.render = function () {
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
                text: L_DOT_SCREEN_EFFECT
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
                text: L_SCALE
            }, {
                xtype: 'number',
                id: 'scale',
                scope: this.id,
                value: 4,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

DotScreenComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

DotScreenComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

DotScreenComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected === editor.scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var enabled = UI.get('enabled', this.id);
    var scale = UI.get('scale', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.dotScreen) {
        enabled.setValue(postProcessing.dotScreen.enabled);
        scale.setValue(postProcessing.dotScreen.scale);
    }
};

DotScreenComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var scale = UI.get('scale', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        dotScreen: {
            enabled: enabled.getValue(),
            scale: scale.getValue(),
        },
    });

    app.call(`postProcessingChanged`, this);
};

export default DotScreenComponent;