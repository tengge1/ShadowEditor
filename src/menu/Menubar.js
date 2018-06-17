import FileMenu from './FileMenu';
import EditMenu from './EditMenu';
import AddMenu from './AddMenu';
import AssetMenu from './AssetMenu';
import PlayMenu from './PlayMenu';
import ExampleMenu from './ExampleMenu';
import HelpMenu from './HelpMenu';
import StatusMenu from './StatusMenu';
import ViewMenu from './ViewMenu';
import UI from '../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function Menubar(app) {
    this.app = app;
    var editor = this.app.editor;

    var container = new UI.Panel();
    container.setId('menubar');

    container.add(new FileMenu(editor));
    container.add(new EditMenu(editor));
    container.add(new AddMenu(editor));
    container.add(new AssetMenu(editor));
    container.add(new PlayMenu(editor));
    container.add(new ViewMenu(editor));
    container.add(new ExampleMenu(editor));
    container.add(new HelpMenu(editor));

    container.add(new StatusMenu(editor));

    return container;

};

export default Menubar;