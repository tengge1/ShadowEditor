import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';

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
    var sceneTab = XType.getControl('sceneTab');
    var projectTab = XType.getControl('projectTab');
    var settingsTab = XType.getControl('settingsTab');
    var scene = XType.getControl('scene');
    var project = XType.getControl('project');
    var settings = XType.getControl('settings');

    sceneTab.dom.className = '';
    projectTab.dom.className = '';
    settingsTab.dom.className = '';

    scene.dom.style.display = 'none';
    project.dom.style.display = 'none';
    settings.dom.style.display = 'none';

    switch (section) {
        case '场景':
            sceneTab.dom.className = 'selected';
            scene.dom.style.display = '';
            break;
        case '工程':
            projectTab.dom.className = 'selected';
            project.dom.style.display = '';
            break;
        case '设置':
            settingsTab.dom.className = 'selected';
            settings.dom.style.display = '';
            break;
    }
};

export default SidebarEvent;