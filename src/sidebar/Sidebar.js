import ScenePanel from './ScenePanel';
import PropertyPanel from './PropertyPanel';
import AnimationPanel from './AnimationPanel';
import ScriptPanel from './ScriptPanel';
import ProjectPanel from './ProjectPanel';
import SettingPanel from './SettingPanel';
import HistoryPanel from './HistoryPanel';
import UI2 from '../ui2/UI';

/**
 * 侧边栏
 * @author mrdoob / http://mrdoob.com/
 */
function Sidebar(app) {
    this.app = app;

    var container = new UI2.Div({
        id: 'sidebar'
    });
    this.container = container;

    // 侧边栏
    var sceneTab = new UI2.Text({
        text: '场景',
        cls: 'selected',
        onClick: function() {

        }
    });
    var projectTab = new UI2.Text({
        text: '工程',
        onClick: function() {

        }
    });
    var settingsTab = new UI2.Text({
        text: '设置',
        onClick: function() {

        }
    });

    var tabs = new UI2.Div({
        id: 'tabs'
    });
    tabs.add(sceneTab);
    tabs.add(projectTab);
    tabs.add(settingsTab);

    container.add(tabs);

    container.render();

    // function onClick(event) {

    //     select(event.target.textContent);

    // }

    //

    // 场景
    var scene = new UI2.Span();
    
    scene.dom.appendChild(new ScenePanel(app));
    scene.dom.appendChild(new PropertyPanel(app));
    scene.dom.appendChild(new AnimationPanel(app));
    scene.dom.appendChild(new ScriptPanel(app));

    container.add(scene);

    // 工程
    var project = new UI2.Span();

    project.dom.appendChild(new ProjectPanel(app));
    
    container.add(project);

    // 设置
    var settings = new UI2.Span();
    
    settings.dom.appendChild(new SettingPanel(app));
    settings.dom.appendChild(new HistoryPanel(app));

    container.add(settings);

    //

    // function select(section) {

    //     sceneTab.setClass('');
    //     projectTab.setClass('');
    //     settingsTab.setClass('');

    //     scene.setDisplay('none');
    //     project.setDisplay('none');
    //     settings.setDisplay('none');

    //     switch (section) {
    //         case '场景':
    //             sceneTab.setClass('selected');
    //             scene.setDisplay('');
    //             break;
    //         case '工程':
    //             projectTab.setClass('selected');
    //             project.setDisplay('');
    //             break;
    //         case '设置':
    //             settingsTab.setClass('selected');
    //             settings.setDisplay('');
    //             break;
    //     }
    // }

    // select('场景');
};

export default Sidebar;