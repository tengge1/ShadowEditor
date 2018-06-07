/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function (editor) {

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
		new Sidebar.Scene(editor),
		new Sidebar.Properties(editor),
		new Sidebar.Animation(editor),
		new Sidebar.Script(editor)
	);
    container.add(scene);

    var project = new UI.Span().add(
		new Sidebar.Project(editor)
	);
    container.add(project);

    var settings = new UI.Span().add(
		new Sidebar.Settings(editor),
		new Sidebar.History(editor)
	);
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
