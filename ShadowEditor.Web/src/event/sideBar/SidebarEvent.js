import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 侧边栏事件
 * @param {*} app 
 */
function SidebarEvent(app) {
    BaseEvent.call(this, app);
}

SidebarEvent.prototype = Object.create(BaseEvent.prototype);
SidebarEvent.prototype.constructor = SidebarEvent;

SidebarEvent.prototype.start = function () {
    this.app.on(`selectTab.${this.id}`, this.onSelectTab.bind(this));
    this.onSelectTab('场景');
};

SidebarEvent.prototype.stop = function () {
    this.app.on(`selectTab.${this.id}`, null);
};

SidebarEvent.prototype.onSelectTab = function (section) {
    var sceneTab = UI.get('sceneTab');
    var settingsTab = UI.get('settingsTab');

    var scene = UI.get('scene');
    var settings = UI.get('settings');

    sceneTab.dom.className = '';
    settingsTab.dom.className = '';

    scene.dom.style.display = 'none';
    settings.dom.style.display = 'none';

    switch (section) {
        case '场景':
            sceneTab.dom.className = 'selected';
            scene.dom.style.display = '';
            break;
        case '设置':
            settingsTab.dom.className = 'selected';
            settings.dom.style.display = '';
            break;
    }
};

export default SidebarEvent;