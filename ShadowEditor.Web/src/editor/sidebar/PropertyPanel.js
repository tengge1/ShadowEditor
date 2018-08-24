import UI from '../../ui/UI';
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
        }, {
            xtype: 'div',
            children: [
                new ObjectPanel({ app: this.app, id: 'object' })
            ]
        }, {
            xtype: 'div',
            children: [
                new GeometryPanel({ app: this.app, id: 'geometry' })
            ]
        }, {
            xtype: 'div',
            children: [
                new MaterialPanel({ app: this.app, id: 'material' })
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
    var objectTab = UI.get('objectTab');
    var geometryTab = UI.get('geometryTab');
    var materialTab = UI.get('materialTab');

    objectTab.dom.className = '';
    geometryTab.dom.className = '';
    materialTab.dom.className = '';

    switch (tabName) {
        case '物体':
            objectTab.dom.className = 'selected';
            break;
        case '几何':
            geometryTab.dom.className = 'selected';
            break;
        case '材质':
            materialTab.dom.className = 'selected';
            break;
    }

    this.app.call('selectPropertyTab', this, tabName);
};

export default PropertyPanel;