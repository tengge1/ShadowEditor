import { System } from '../../third_party';
import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 属性面板事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function PropertyPanelEvent(app) {
    BaseEvent.call(this, app);
}

PropertyPanelEvent.prototype = Object.create(BaseEvent.prototype);
PropertyPanelEvent.prototype.constructor = PropertyPanelEvent;

PropertyPanelEvent.prototype.start = function () {
    this.app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
    this.app.on(`selectPropertyTab.${this.id}`, this.onSelectPropertyTab.bind(this));
};

PropertyPanelEvent.prototype.stop = function () {
    this.app.on(`appStarted.${this.id}`, null);
    this.app.on(`selectPropertyTab.${this.id}`, null);
};

PropertyPanelEvent.prototype.onAppStarted = function () {
    this.app.call('selectPropertyTab', this, '物体');
};

PropertyPanelEvent.prototype.onSelectPropertyTab = function (tabName) {
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
};

export default PropertyPanelEvent;