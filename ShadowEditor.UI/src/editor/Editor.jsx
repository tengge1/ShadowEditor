import './css/Editor.css';

// layout
import BorderLayout from '../layout/BorderLayout.jsx';
import HBoxLayout from '../layout/HBoxLayout.jsx';
import VBoxLayout from '../layout/VBoxLayout.jsx';

// panel
import EMenuBar from './EMenuBar.jsx';
import EToolbar from './EToolbar.jsx';
import EWorkspace from './EWorkspace.jsx';
import ESideBar from './ESideBar.jsx';
import EStatusBar from './EStatusBar.jsx';

/**
 * 编辑器
 * @author tengge / https://github.com/tengge1
 */
class Editor {
    render(container) {
        const component = (
            <BorderLayout className={'Editor'}>
                <EMenuBar region={'north'}></EMenuBar>
                <EToolbar region={'west'}></EToolbar>
                <VBoxLayout className={'center'} region={'center'}>
                    <EWorkspace className={'workspace'}></EWorkspace>
                    <EStatusBar></EStatusBar>
                </VBoxLayout>
                <ESideBar region={'east'} split={true}></ESideBar>
            </BorderLayout>
        );

        ReactDOM.render(component, container);
    }
}

export default Editor;