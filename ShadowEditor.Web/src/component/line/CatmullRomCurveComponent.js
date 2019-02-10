import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 曲线组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function CatmullRomCurveComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

CatmullRomCurveComponent.prototype = Object.create(BaseComponent.prototype);
CatmullRomCurveComponent.prototype.constructor = CatmullRomCurveComponent;

CatmullRomCurveComponent.prototype.render = function () {
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
            text: '曲线组件'
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '闭合'
            }, {
                xtype: 'checkbox',
                id: 'closed',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '线型'
                }, {
                    xtype: 'select',
                    id: 'curveType',
                    scope: this.id,
                    options: {
                        centripetal: '向心力',
                        chordal: '弦线',
                        catmullrom: 'catmullrom'
                    },
                    onChange: this.onChange.bind(this)
                }]
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '张力'
            }, {
                xtype: 'number',
                id: 'tension',
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

CatmullRomCurveComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

CatmullRomCurveComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

CatmullRomCurveComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Line && editor.selected.userData.type === 'CatmullRomCurve') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var closed = UI.get('closed', this.id);
    var curveType = UI.get('curveType', this.id);
    var tension = UI.get('tension', this.id);

    closed.setValue(this.selected.userData.closed);
    curveType.setValue(this.selected.userData.curveType);
    tension.setValue(this.selected.userData.tension);
};

CatmullRomCurveComponent.prototype.onChange = function () {
    var closed = UI.get('closed', this.id);
    var curveType = UI.get('curveType', this.id);
    var tension = UI.get('tension', this.id);

    Object.assign(this.selected.userData, {
        closed: closed.getValue(),
        curveType: curveType.getValue(),
        tension: tension.getValue(),
    });

    this.selected.update();

    this.app.call('objectChanged', this, this.selected);
};

export default CatmullRomCurveComponent;