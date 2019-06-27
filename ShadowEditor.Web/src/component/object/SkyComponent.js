import BaseComponent from '../BaseComponent';
import Sky from '../../object/component/Sky';

/**
 * 天空组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SkyComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SkyComponent.prototype = Object.create(BaseComponent.prototype);
SkyComponent.prototype.constructor = SkyComponent;

SkyComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        id: 'skyPanel',
        scope: this.id,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    width: '100%',
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: L_SKY
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_TURBIDITY
            }, {
                xtype: 'number',
                id: 'turbidity',
                scope: this.id,
                range: [0, Infinity],
                value: 10,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_RAYLEIGH
            }, {
                xtype: 'number',
                id: 'rayleigh',
                scope: this.id,
                range: [0, Infinity],
                value: 2,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_LUMINANCE
            }, {
                xtype: 'number',
                id: 'luminance',
                scope: this.id,
                range: [0, Infinity],
                value: 1,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MIE_COEFFICIENT
            }, {
                xtype: 'number',
                id: 'mieCoefficient',
                scope: this.id,
                range: [0, Infinity],
                value: 0.005,
                unit: '%',
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MIE_DIRECTIONAL_G
            }, {
                xtype: 'number',
                id: 'mieDirectionalG',
                scope: this.id,
                range: [0, Infinity],
                value: 0.005,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SkyComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SkyComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SkyComponent.prototype.updateUI = function () {
    var container = UI.get('skyPanel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected instanceof Sky) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var turbidity = UI.get('turbidity', this.id);
    var rayleigh = UI.get('rayleigh', this.id);
    var luminance = UI.get('luminance', this.id);
    var mieCoefficient = UI.get('mieCoefficient', this.id);
    var mieDirectionalG = UI.get('mieDirectionalG', this.id);

    turbidity.setValue(this.selected.userData.turbidity);
    rayleigh.setValue(this.selected.userData.rayleigh);
    luminance.setValue(this.selected.userData.luminance);
    mieCoefficient.setValue(this.selected.userData.mieCoefficient * 100);
    mieDirectionalG.setValue(this.selected.userData.mieDirectionalG);
};

SkyComponent.prototype.onChange = function () {
    var turbidity = UI.get('turbidity', this.id);
    var rayleigh = UI.get('rayleigh', this.id);
    var luminance = UI.get('luminance', this.id);
    var mieCoefficient = UI.get('mieCoefficient', this.id);
    var mieDirectionalG = UI.get('mieDirectionalG', this.id);

    this.selected.userData.turbidity = turbidity.getValue();
    this.selected.userData.rayleigh = rayleigh.getValue();
    this.selected.userData.luminance = luminance.getValue();
    this.selected.userData.mieCoefficient = mieCoefficient.getValue() / 100;
    this.selected.userData.mieDirectionalG = mieDirectionalG.getValue();

    var sky = this.selected.children.filter(n => n instanceof THREE.Sky)[0];
    if (sky) {
        var uniforms = sky.material.uniforms;
        uniforms.turbidity.value = turbidity.getValue();
        uniforms.rayleigh.value = rayleigh.getValue();
        uniforms.luminance.value = luminance.getValue();
        uniforms.mieCoefficient.value = mieCoefficient.getValue() / 100;
        uniforms.mieDirectionalG.value = mieDirectionalG.getValue();
        sky.material.needsUpdate = true;
    }

    app.call(`objectSelected`, this, this.selected);
};

export default SkyComponent;