import ScenePanel from './ScenePanel';
import PropertyPanel from './PropertyPanel';
// import AnimationPanel from './AnimationPanel';
import ScriptPanel from './ScriptPanel';
import ProjectPanel from './ProjectPanel';
import SettingPanel from './SettingPanel';
import HistoryPanel from './HistoryPanel';
import UI from '../../ui/UI';

/**
 * 侧边栏
 * @author mrdoob / http://mrdoob.com/
 */
function Sidebar(app) {
    this.app = app;
    var editor = this.app.editor;

    var container = new UI.Div({
        parent: this.app.container,
        id: 'sidebar'
    });

    //

    var sceneTab = new UI.Text({
        text: '场景',
        onClick: onClick
    });

    var projectTab = new UI.Text({
        text: '工程',
        onClick: onClick
    });

    var settingsTab = new UI.Text({
        text: '设置',
        onClick: onClick
    });

    var tabs = new UI.Div({
        cls: 'tabs'
    });

    tabs.add(sceneTab);
    tabs.add(projectTab);
    tabs.add(settingsTab);

    container.add(tabs);

    container.render();

    function onClick(event) {
        select(event.target.textContent);
    }

    //

    var scene = new UI.Div();
    scene.render();
    scene.dom.appendChild(new ScenePanel(this.app).dom);

    var propertyPanel = new PropertyPanel({ app: this.app, parent: scene.dom });
    propertyPanel.render();

    scene.dom.appendChild(new ScriptPanel(this.app).dom);
    container.dom.appendChild(scene.dom);

    var project = new UI.Div();
    project.render();

    var projectPanel = new ProjectPanel({ app: this.app, parent: project.dom });
    projectPanel.render();

    container.dom.appendChild(project.dom);

    var settings = new UI.Div();
    settings.render();
    settings.dom.appendChild(new SettingPanel(this.app));

    var historyPanel = new HistoryPanel({ app: this.app, parent: settings.dom });
    historyPanel.render();

    container.dom.appendChild(settings.dom);

    //

    function select(section) {
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
    }

    select('场景');
};

export default Sidebar;