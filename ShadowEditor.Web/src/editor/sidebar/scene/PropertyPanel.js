import UI from '../../../ui/UI';
import ObjectPanel from './ObjectPanel';
import GeometryPanel from './GeometryPanel';
import MaterialPanel from './MaterialPanel';

/**
 * 属性面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function PropertyPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

PropertyPanel.prototype = Object.create(UI.Control.prototype);
PropertyPanel.prototype.constructor = PropertyPanel;

PropertyPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'propertyPanel',
        parent: this.parent,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                id: 'objectTab',
                text: '物体',
                onClick: () => {
                    this.selectTab('物体');
                }
            }, {
                xtype: 'text',
                id: 'geometryTab',
                text: '几何',
                onClick: () => {
                    this.selectTab('几何');
                }
            }, {
                xtype: 'text',
                id: 'materialTab',
                text: '材质',
                onClick: () => {
                    this.selectTab('材质');
                }
            }]
        }, { // 物体面板
            xtype: 'div',
            id: 'objectPanel',
            scope: this.id,
            children: [
                new ObjectPanel({ app: this.app })
            ]
        }, { // 几何面板
            xtype: 'div',
            id: 'geometryPanel',
            scope: this.id,
            children: [
                new GeometryPanel({ app: this.app })
            ]
        }, { // 材质面板
            xtype: 'div',
            id: 'materialPanel',
            scope: this.id,
            children: [
                new MaterialPanel({ app: this.app })
            ]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
};

PropertyPanel.prototype.onAppStarted = function () {
    this.selectTab('物体');
};

PropertyPanel.prototype.selectTab = function (tabName) {
    const objectTab = UI.get('objectTab');
    const geometryTab = UI.get('geometryTab');
    const materialTab = UI.get('materialTab');

    const objectPanel = UI.get('objectPanel', this.id);
    const geometryPanel = UI.get('geometryPanel', this.id);
    const materialPanel = UI.get('materialPanel', this.id);

    objectTab.dom.className = '';
    geometryTab.dom.className = '';
    materialTab.dom.className = '';

    objectPanel.dom.style.display = 'none';
    geometryPanel.dom.style.display = 'none';
    materialPanel.dom.style.display = 'none';

    switch (tabName) {
        case '物体':
            objectTab.dom.className = 'selected';
            geometryTab.dom.className = '';
            materialTab.dom.className = '';
            objectPanel.dom.style.display = '';
            geometryPanel.dom.style.display = 'none';
            materialPanel.dom.style.display = 'none';
            break;
        case '几何':
            objectTab.dom.className = '';
            geometryTab.dom.className = 'selected';
            materialTab.dom.className = '';
            objectPanel.dom.style.display = 'none';
            geometryPanel.dom.style.display = '';
            materialPanel.dom.style.display = 'none';
            break;
        case '材质':
            objectTab.dom.className = '';
            geometryTab.dom.className = '';
            materialTab.dom.className = 'selected';
            objectPanel.dom.style.display = 'none';
            geometryPanel.dom.style.display = 'none';
            materialPanel.dom.style.display = '';
            break;
    }

    this.app.call('selectPropertyTab', this, tabName);
};

export default PropertyPanel;