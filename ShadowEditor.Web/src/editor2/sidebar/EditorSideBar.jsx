import './css/EditorSideBar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import TabLayout from '../../layout/TabLayout.jsx';
import VBoxLayout from '../../layout/VBoxLayout.jsx';

import HierarchyPanel from './HierarchyPanel.jsx';
import HistoryPanel from './HistoryPanel.jsx';
import PropertyPanel from './PropertyPanel.jsx';
import AnimationPanel from './AnimationPanel.jsx';

/**
 * 侧边栏
 * @author tengge / https://github.com/tengge1
 */
class EditorSideBar extends React.Component {
    render() {
        return <VBoxLayout className={'EditorSideBar'}>
            <TabLayout className={'top'}>
                <HierarchyPanel title={'Hierarchy'} />
                <HistoryPanel title={'History'}></HistoryPanel>
            </TabLayout>
            <TabLayout className={'bottom'}>
                <PropertyPanel title={'Property'}></PropertyPanel>
                <AnimationPanel title={'Animation'}></AnimationPanel>
            </TabLayout>
        </VBoxLayout>;
    }
}

export default EditorSideBar;