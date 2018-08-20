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
    var historyTab = UI.get('historyTab');

    var scene = UI.get('scene');
    var histories = UI.get('histories');

    sceneTab.dom.className = '';
    historyTab.dom.className = '';

    scene.dom.style.display = 'none';
    histories.dom.style.display = 'none';

    switch (section) {
        case '场景':
            sceneTab.dom.className = 'selected';
            scene.dom.style.display = '';
            break;
        case '历史':
            historyTab.dom.className = 'selected';
            histories.dom.style.display = '';
            break;
    }
};

export default SidebarEvent;