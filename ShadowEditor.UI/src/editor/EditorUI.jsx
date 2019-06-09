import BorderLayout from '../layout/BorderLayout.jsx';

import EditorMenuBar from './menu/EditorMenuBar.jsx';
import EditorStatusBar from './status/EditorStatusBar.jsx';
import EditorToolbar from './toolbar/EditorToolbar.jsx';
import EditorSideBar from './sidebar/EditorSideBar.jsx';
import Viewport from './viewport/Viewport.jsx';
import TimelinePanel from './timeline/TimelinePanel.jsx';

/**
 * 编辑器UI
 * @author tengge / https://github.com/tengge1
 */
class EditorUI extends React.Component {
    render() {
        return <BorderLayout>
            <EditorMenuBar region={'north'}></EditorMenuBar>
            <EditorStatusBar region={'south'}></EditorStatusBar>
            <EditorToolbar region={'west'}></EditorToolbar>
            <EditorSideBar region={'east'} split={true}></EditorSideBar>
            <BorderLayout region={'center'}>
                <Viewport region={'center'}></Viewport>
                <TimelinePanel region={'south'} split={true}></TimelinePanel>
            </BorderLayout>
        </BorderLayout>;
    }
}

export default EditorUI;