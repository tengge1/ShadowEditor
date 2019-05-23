import BorderLayout from '../layout/BorderLayout.jsx';
import VBoxLayout from '../layout/VBoxLayout.jsx';

import EMenuBar from './EMenuBar.jsx';
import EToolbar from './EToolbar.jsx';
import EWorkspace from './EWorkspace.jsx';
import ESideBar from './ESideBar.jsx';
import EStatusBar from './EStatusBar.jsx';

/**
 * 编辑器
 * @author tengge / https://github.com/tengge1
 */
class Editor extends React.Component {
    render() {
        return <BorderLayout>
            <EMenuBar region={'north'}></EMenuBar>
            <EToolbar region={'west'}></EToolbar>
            <VBoxLayout region={'center'}>
                <EWorkspace></EWorkspace>
                <EStatusBar></EStatusBar>
            </VBoxLayout>
            <ESideBar region={'east'} split={true}></ESideBar>
        </BorderLayout>;
    }
}

export default Editor;