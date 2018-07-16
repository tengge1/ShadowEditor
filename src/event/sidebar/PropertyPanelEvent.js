import { System } from '../../third_party';
import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';

/**
 * 属性面板事件
 * @param {*} app 
 */
function PropertyPanelEvent(app) {
    BaseEvent.call(this, app);
}

PropertyPanelEvent.prototype = Object.create(BaseEvent.prototype);
PropertyPanelEvent.prototype.constructor = PropertyPanelEvent;

PropertyPanelEvent.prototype.start = function () {
    this.app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
    this.app.on(`selectPropertyTab.${this.id}`, this.select.bind(this));
};

PropertyPanelEvent.prototype.stop = function () {
    this.app.on(`appStarted.${this.id}`, null);
    this.app.on(`selectPropertyTab.${this.id}`, null);
};

PropertyPanelEvent.prototype.onAppStarted = function () {
    this.select('物体');
};

PropertyPanelEvent.prototype.select = function (section) {
    var objectTab = XType.getControl('objectTab');
    var geometryTab = XType.getControl('geometryTab');
    var materialTab = XType.getControl('materialTab');
    var objectPanel = XType.getControl('objectPanel');
    var geometryPanel = XType.getControl('geometryPanel');
    var materialPanel = XType.getControl('materialPanel');

    objectTab.dom.className = '';
    geometryTab.dom.className = '';
    materialTab.dom.className = '';

    objectPanel.dom.style.display = 'none';
    geometryPanel.dom.style.display = 'none';
    materialPanel.dom.style.display = 'none';

    switch (section) {
        case '物体':
            objectTab.dom.className = 'selected';
            objectPanel.dom.style.display = '';
            break;
        case '几何':
            geometryTab.dom.className = 'selected';
            geometryPanel.dom.style.display = '';
            break;
        case '材质':
            materialTab.dom.className = 'selected';
            materialPanel.dom.style.display = '';
            break;
    }
};

export default PropertyPanelEvent;