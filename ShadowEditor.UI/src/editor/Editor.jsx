import './css/Editor.css';

// layout
import HBoxLayout from '../layout/HBoxLayout.jsx';
import VBoxLayout from '../layout/VBoxLayout.jsx';

// panel
import EMenuBar from './EMenuBar.jsx';
import EToolbar from './EToolbar.jsx';
import Workspace from './Workspace.jsx';
import SideBar from './SideBar.jsx';
import StatusBar from './StatusBar.jsx';

/**
 * 编辑器
 * @author tengge / https://github.com/tengge1
 */
class Editor {
    render(container) {
        const component = (
            <VBoxLayout className={'Editor'}>
                <EMenuBar></EMenuBar>
                <HBoxLayout className={'box'}>
                    <EToolbar></EToolbar>
                    <VBoxLayout className={'center'}>
                        <Workspace className={'workspace'}></Workspace>
                        <StatusBar />
                    </VBoxLayout>
                    <SideBar></SideBar>
                </HBoxLayout>
            </VBoxLayout>
        );

        ReactDOM.render(component, container);
    }
}

export default Editor;