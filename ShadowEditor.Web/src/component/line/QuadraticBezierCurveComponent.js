import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 二次贝塞尔曲线组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function QuadraticBezierCurveComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

QuadraticBezierCurveComponent.prototype = Object.create(BaseComponent.prototype);
QuadraticBezierCurveComponent.prototype.constructor = QuadraticBezierCurveComponent;

QuadraticBezierCurveComponent.prototype.render = function () {
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
            text: '二次贝塞尔曲线'
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
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

QuadraticBezierCurveComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

QuadraticBezierCurveComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

QuadraticBezierCurveComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected.userData.type === 'QuadraticBezierCurve') {
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

    var points = this.selected.userData.points;

    v0x.setValue(points[0].x);
    v0y.setValue(points[0].y);
    v0z.setValue(points[0].z);
    v1x.setValue(points[1].x);
    v1y.setValue(points[1].y);
    v1z.setValue(points[1].z);
    v2x.setValue(points[2].x);
    v2y.setValue(points[2].y);
    v2z.setValue(points[2].z);
};

QuadraticBezierCurveComponent.prototype.onChange = function () {
    var v0x = UI.get('v0x', this.id);
    var v0y = UI.get('v0y', this.id);
    var v0z = UI.get('v0z', this.id);
    var v1x = UI.get('v1x', this.id);
    var v1y = UI.get('v1y', this.id);
    var v1z = UI.get('v1z', this.id);
    var v2x = UI.get('v2x', this.id);
    var v2y = UI.get('v2y', this.id);
    var v2z = UI.get('v2z', this.id);

    this.selected.userData.points = [
        new THREE.Vector3(v0x.getValue(), v0y.getValue(), v0z.getValue()),
        new THREE.Vector3(v1x.getValue(), v1y.getValue(), v1z.getValue()),
        new THREE.Vector3(v2x.getValue(), v2y.getValue(), v2z.getValue())
    ];

    this.selected.update();

    this.app.call('objectChanged', this, this.selected);
};

export default QuadraticBezierCurveComponent;