import './css/EditorSideBar.css';
import { classNames, PropTypes, TabLayout, VBoxLayout } from '../../third_party';

import HierarchyPanel from './HierarchyPanel.jsx';
import HistoryPanel from './HistoryPanel.jsx';
import PropertyPanel from './PropertyPanel.jsx';
import ScriptPanel from './ScriptPanel.jsx';

/**
 * 侧边栏
 * @author tengge / https://github.com/tengge1
 */
class EditorSideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topIndex: 0,
            bottomIndex: 0,
        };

        this.handleTopTabChange = this.handleTopTabChange.bind(this);
        this.handleBottomTabChange = this.handleBottomTabChange.bind(this);
    }

    render() {
        const { topIndex, bottomIndex } = this.state;

        return <VBoxLayout className={'EditorSideBar'}>
            <TabLayout className={'top'} activeTabIndex={topIndex} onActiveTabChange={this.handleTopTabChange}>
                <HierarchyPanel title={L_HIERACHY} />
                <HistoryPanel title={L_HISTORY}></HistoryPanel>
            </TabLayout>
            <TabLayout className={'bottom'} activeTabIndex={bottomIndex} onActiveTabChange={this.handleBottomTabChange}>
                <PropertyPanel title={L_PROPERTY}></PropertyPanel>
                <ScriptPanel title={L_SCRIPT}></ScriptPanel>
            </TabLayout>
        </VBoxLayout>;
    }

    handleTopTabChange(index) {
        this.setState({
            topIndex: index,
        });
    }

    handleBottomTabChange(index) {
        this.setState({
            bottomIndex: index,
        });
    }
}

export default EditorSideBar;