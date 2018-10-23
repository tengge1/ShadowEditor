import BaseComponent from '../BaseComponent';

/**
 * 柏林地形组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function PerlinTerrainComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

PerlinTerrainComponent.prototype = Object.create(BaseComponent.prototype);
PerlinTerrainComponent.prototype.constructor = PerlinTerrainComponent;

PerlinTerrainComponent.prototype.render = function () {
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
                text: '天空'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '浑浊度'
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
                text: '瑞利'
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
                text: '亮度'
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
                text: 'Mie系数'
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
                text: 'Mie方向'
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

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

PerlinTerrainComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

PerlinTerrainComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

PerlinTerrainComponent.prototype.updateUI = function () {
    var container = UI.get('skyPanel', this.id);
    var editor = this.app.editor;
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

PerlinTerrainComponent.prototype.onChange = function () {
    this.app.call(`objectSelected`, this, this.selected);
};

export default PerlinTerrainComponent;