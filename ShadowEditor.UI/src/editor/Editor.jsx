import BorderLayout from '../layout/BorderLayout.jsx';

import EMenuBar from './menu/EMenuBar.jsx';
import EStatusBar from './EStatusBar.jsx';
import EToolbar from './EToolbar.jsx';
import EWorkspace from './EWorkspace.jsx';
import ESideBar from './ESideBar.jsx';

/**
 * 编辑器
 * @author tengge / https://github.com/tengge1
 */
class Editor extends React.Component {
    render() {
        return <BorderLayout>
            <EMenuBar region={'north'}></EMenuBar>
            <EStatusBar region={'south'}></EStatusBar>
            <EToolbar region={'west'}></EToolbar>
            <ESideBar region={'east'} split={true}></ESideBar>
            <EWorkspace region={'center'}></EWorkspace>
        </BorderLayout>;
    }
}

export default Editor;