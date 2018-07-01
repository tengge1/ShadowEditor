import ScenePanel from './ScenePanel';
import PropertyPanel from './PropertyPanel';
// import AnimationPanel from './AnimationPanel';
import ScriptPanel from './ScriptPanel';
import ProjectPanel from './ProjectPanel';
import SettingPanel from './SettingPanel';
import HistoryPanel from './HistoryPanel';
import UI from '../ui/UI';

/**
 * 侧边栏
 * @author mrdoob / http://mrdoob.com/
 */
function Sidebar(app) {
    this.app = app;
    var editor = this.app.editor;

    var container = new UI.Panel();
    container.setId('sidebar');

    //

    var sceneTab = new UI.Text('场景').onClick(onClick);
    var projectTab = new UI.Text('工程').onClick(onClick);
    var settingsTab = new UI.Text('设置').onClick(onClick);

    var tabs = new UI.Div();
    tabs.setId('tabs');
    tabs.add(sceneTab, projectTab, settingsTab);
    container.add(tabs);

    function onClick(event) {

        select(event.target.textContent);

    }

    //

    var scene = new UI.Span().add(
        new ScenePanel(this.app),
        new PropertyPanel(this.app),
        // new AnimationPanel(this.app),
        new ScriptPanel(this.app)
    );
    container.add(scene);

    var project = new UI.Span().add(
        new ProjectPanel(this.app)
    );
    container.add(project);

    var settings = new UI.Span();
    settings.dom.appendChild(new SettingPanel(this.app));
    settings.dom.appendChild(new HistoryPanel(this.app));
    container.add(settings);

    //

    function select(section) {

        sceneTab.setClass('');
        projectTab.setClass('');
        settingsTab.setClass('');

        scene.setDisplay('none');
        project.setDisplay('none');
        settings.setDisplay('none');

        switch (section) {
            case '场景':
                sceneTab.setClass('selected');
                scene.setDisplay('');
                break;
            case '工程':
                projectTab.setClass('selected');
                project.setDisplay('');
                break;
            case '设置':
                settingsTab.setClass('selected');
                settings.setDisplay('');
                break;
        }

    }

    select('场景');

    return container;

};

export default Sidebar;