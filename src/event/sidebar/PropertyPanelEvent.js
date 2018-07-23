import { System } from '../../third_party';
import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

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
    var editor = this.app.editor;

    var objectTab = UI.get('objectTab');
    var geometryTab = UI.get('geometryTab');
    var materialTab = UI.get('materialTab');
    var objectPanel = UI.get('objectPanel');
    var geometryPanel = UI.get('geometryPanel');
    var materialPanel = UI.get('materialPanel');

    objectTab.dom.className = '';
    geometryTab.dom.className = '';
    materialTab.dom.className = '';

    objectPanel.dom.style.display = 'none';
    geometryPanel.dom.style.display = 'none';
    materialPanel.dom.style.display = 'none';

    switch (section) {
        case '物体':
            objectTab.dom.className = 'selected';
            if (editor.selected) {
                objectPanel.dom.style.display = '';
            }
            break;
        case '几何':
            geometryTab.dom.className = 'selected';
            if (editor.selected) {
                geometryPanel.dom.style.display = '';
            }
            break;
        case '材质':
            materialTab.dom.className = 'selected';
            if (editor.selected) {
                materialPanel.dom.style.display = '';
            }
            break;
    }
};

export default PropertyPanelEvent;