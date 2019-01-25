import BaseComponent from '../BaseComponent';

/**
 * 残影特效组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AfterimageComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

AfterimageComponent.prototype = Object.create(BaseComponent.prototype);
AfterimageComponent.prototype.constructor = AfterimageComponent;

AfterimageComponent.prototype.render = function () {
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
                text: L_AFTERIMAGE_EFFECT
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
                text: L_DAMP
            }, {
                xtype: 'number',
                id: 'damp',
                scope: this.id,
                value: 0.92,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

AfterimageComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

AfterimageComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

AfterimageComponent.prototype.updateUI = function () {
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
    var damp = UI.get('damp', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.afterimage) {
        enabled.setValue(postProcessing.afterimage.enabled);
        damp.setValue(postProcessing.afterimage.damp);
    }
};

AfterimageComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var damp = UI.get('damp', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        afterimage: {
            enabled: enabled.getValue(),
            damp: damp.getValue()
        },
    });

    this.app.call(`postProcessingChanged`, this);
};

export default AfterimageComponent;