import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 曲线组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SplineComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SplineComponent.prototype = Object.create(BaseComponent.prototype);
SplineComponent.prototype.constructor = SplineComponent;

SplineComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        id: 'panel',
        scope: this.id,
        style: {
            borderTop: 0,
            marginTop: '8px',
            display: 'none'
        },
        children: [{
            xtype: 'label',
            style: {
                width: '100%',
                color: '#555',
                fontWeight: 'bold'
            },
            text: "Spline Component"
        }, {
            xtype: 'row',
            children: [{
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_WIDTH
                }, {
                    xtype: 'number',
                    id: 'width',
                    scope: this.id,
                    value: 1,
                    onChange: this.onChange.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_HEIGHT
                }, {
                    xtype: 'number',
                    id: 'height',
                    scope: this.id,
                    value: 1,
                    onChange: this.onChange.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_DEPTH
                }, {
                    xtype: 'number',
                    id: 'depth',
                    scope: this.id,
                    value: 1,
                    onChange: this.onChange.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_WIDTH_SEGMENTS
                }, {
                    xtype: 'int',
                    id: 'widthSegments',
                    scope: this.id,
                    value: 1,
                    range: [1, Infinity],
                    onChange: this.onChange.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_HEIGHT_SEGMENTS
                }, {
                    xtype: 'int',
                    id: 'heightSegments',
                    scope: this.id,
                    value: 1,
                    range: [1, Infinity],
                    onChange: this.onChange.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_DEPTH_SEGMENTS
                }, {
                    xtype: 'int',
                    id: 'depthSegments',
                    scope: this.id,
                    value: 1,
                    range: [1, Infinity],
                    onChange: this.onChange.bind(this)
                }]
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SplineComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SplineComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SplineComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Line && editor.selected.userData.type === 'Spline') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;
};

SplineComponent.prototype.onChange = function () {

};

export default SplineComponent;