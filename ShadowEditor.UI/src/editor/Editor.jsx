import './css/Editor.css';

// layout
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
            <VBoxLayout className={'Editor'}>
                <EMenuBar></EMenuBar>
                <HBoxLayout className={'box'}>
                    <EToolbar></EToolbar>
                    <VBoxLayout className={'center'}>
                        <EWorkspace className={'workspace'}></EWorkspace>
                        <EStatusBar></EStatusBar>
                    </VBoxLayout>
                    <ESideBar></ESideBar>
                </HBoxLayout>
            </VBoxLayout>
        );

        ReactDOM.render(component, container);
    }
}

export default Editor;