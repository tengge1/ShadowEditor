import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 三次贝塞尔曲线组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function CubicBezierCurveComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

CubicBezierCurveComponent.prototype = Object.create(BaseComponent.prototype);
CubicBezierCurveComponent.prototype.constructor = CubicBezierCurveComponent;

CubicBezierCurveComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        id: 'panel',
        scope: this.id,
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
            text: '三次贝塞尔曲线'
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '点0'
            }, {
                xtype: 'number',
                id: 'v0x',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'v0y',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'v0z',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '点1'
            }, {
                xtype: 'number',
                id: 'v1x',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'v1y',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'v1z',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '点2'
            }, {
                xtype: 'number',
                id: 'v2x',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'v2y',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'v2z',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '点3'
            }, {
                xtype: 'number',
                id: 'v3x',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'v3y',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'v3z',
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

CubicBezierCurveComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

CubicBezierCurveComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

CubicBezierCurveComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected.userData.type === 'CubicBezierCurve') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var v0x = UI.get('v0x', this.id);
    var v0y = UI.get('v0y', this.id);
    var v0z = UI.get('v0z', this.id);
    var v1x = UI.get('v1x', this.id);
    var v1y = UI.get('v1y', this.id);
    var v1z = UI.get('v1z', this.id);
    var v2x = UI.get('v2x', this.id);
    var v2y = UI.get('v2y', this.id);
    var v2z = UI.get('v2z', this.id);
    var v3x = UI.get('v3x', this.id);
    var v3y = UI.get('v3y', this.id);
    var v3z = UI.get('v3z', this.id);

    v0x.setValue(this.selected.userData.v0.x);
    v0y.setValue(this.selected.userData.v0.y);
    v0z.setValue(this.selected.userData.v0.z);
    v1x.setValue(this.selected.userData.v1.x);
    v1y.setValue(this.selected.userData.v1.y);
    v1z.setValue(this.selected.userData.v1.z);
    v2x.setValue(this.selected.userData.v2.x);
    v2y.setValue(this.selected.userData.v2.y);
    v2z.setValue(this.selected.userData.v2.z);
    v3x.setValue(this.selected.userData.v3.x);
    v3y.setValue(this.selected.userData.v3.y);
    v3z.setValue(this.selected.userData.v3.z);
};

CubicBezierCurveComponent.prototype.onChange = function () {
    var v0x = UI.get('v0x', this.id);
    var v0y = UI.get('v0y', this.id);
    var v0z = UI.get('v0z', this.id);
    var v1x = UI.get('v1x', this.id);
    var v1y = UI.get('v1y', this.id);
    var v1z = UI.get('v1z', this.id);
    var v2x = UI.get('v2x', this.id);
    var v2y = UI.get('v2y', this.id);
    var v2z = UI.get('v2z', this.id);
    var v3x = UI.get('v3x', this.id);
    var v3y = UI.get('v3y', this.id);
    var v3z = UI.get('v3z', this.id);

    Object.assign(this.selected.userData, {
        v0: new THREE.Vector3(v0x.getValue(), v0y.getValue(), v0z.getValue()),
        v1: new THREE.Vector3(v1x.getValue(), v1y.getValue(), v1z.getValue()),
        v2: new THREE.Vector3(v2x.getValue(), v2y.getValue(), v2z.getValue()),
        v3: new THREE.Vector3(v3x.getValue(), v3y.getValue(), v3z.getValue()),
    });

    this.selected.update();

    this.app.call('objectChanged', this, this.selected);
};

export default CubicBezierCurveComponent;