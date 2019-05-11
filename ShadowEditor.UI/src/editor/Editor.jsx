import './css/Editor.css';

// layout
import HBoxLayout from '../layout/HBoxLayout.jsx';
import VBoxLayout from '../layout/VBoxLayout.jsx';

// panel
import MenuBar from './MenuBar.jsx';
import Toolbar from './Toolbar.jsx';
import Workspace from './Workspace.jsx';
import SideBar from './SideBar.jsx';

/**
 * 编辑器
 * @author tengge / https://github.com/tengge1
 */
class Editor {
    render(container) {
        const component = (
            <VBoxLayout className={'Editor'}>
                <MenuBar></MenuBar>
                <HBoxLayout className={'box'}>
                    <Toolbar></Toolbar>
                    <Workspace></Workspace>
                    <SideBar></SideBar>
                </HBoxLayout>
            </VBoxLayout>
        );

        ReactDOM.render(component, container);
    }
}

export default Editor;