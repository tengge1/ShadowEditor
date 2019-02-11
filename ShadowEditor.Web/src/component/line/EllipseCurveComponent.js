import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 椭圆曲线组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function EllipseCurveComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

EllipseCurveComponent.prototype = Object.create(BaseComponent.prototype);
EllipseCurveComponent.prototype.constructor = EllipseCurveComponent;

EllipseCurveComponent.prototype.render = function () {
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
            text: '椭圆曲线'
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '中心'
            }, {
                xtype: 'number',
                id: 'aX',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'aY',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '半径'
            }, {
                xtype: 'number',
                id: 'xRadius',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'yRadius',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '旋转角度'
            }, {
                xtype: 'number',
                id: 'aStartAngle',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'aEndAngle',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '顺时针'
            }, {
                xtype: 'checkbox',
                id: 'aClockwise',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '偏转'
            }, {
                xtype: 'number',
                id: 'aRotation',
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

EllipseCurveComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

EllipseCurveComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

EllipseCurveComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected.userData.type === 'EllipseCurve') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var aX = UI.get('aX', this.id);
    var aY = UI.get('aY', this.id);
    var xRadius = UI.get('xRadius', this.id);
    var yRadius = UI.get('yRadius', this.id);
    var aStartAngle = UI.get('aStartAngle', this.id);
    var aEndAngle = UI.get('aEndAngle', this.id);
    var aClockwise = UI.get('aClockwise', this.id);
    var aRotation = UI.get('aRotation', this.id);

    aX.setValue(this.selected.userData.aX);
    aY.setValue(this.selected.userData.aY);
    xRadius.setValue(this.selected.userData.xRadius);
    yRadius.setValue(this.selected.userData.yRadius);
    aStartAngle.setValue(this.selected.userData.aStartAngle);
    aEndAngle.setValue(this.selected.userData.aEndAngle);
    aClockwise.setValue(this.selected.userData.aClockwise);
    aRotation.setValue(this.selected.userData.aRotation);
};

EllipseCurveComponent.prototype.onChange = function () {
    var aX = UI.get('aX', this.id);
    var aY = UI.get('aY', this.id);
    var xRadius = UI.get('xRadius', this.id);
    var yRadius = UI.get('yRadius', this.id);
    var aStartAngle = UI.get('aStartAngle', this.id);
    var aEndAngle = UI.get('aEndAngle', this.id);
    var aClockwise = UI.get('aClockwise', this.id);
    var aRotation = UI.get('aRotation', this.id);

    Object.assign(this.selected.userData, {
        aX: aX.getValue(),
        aY: aY.getValue(),
        xRadius: xRadius.getValue(),
        yRadius: yRadius.getValue(),
        aStartAngle: aStartAngle.getValue(),
        aEndAngle: aEndAngle.getValue(),
        aClockwise: aClockwise.getValue(),
        aRotation: aRotation.getValue(),
    });

    this.selected.update();

    this.app.call('objectChanged', this, this.selected);
};

export default EllipseCurveComponent;