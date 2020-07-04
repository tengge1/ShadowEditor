/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/EditorSideBar.css';
import { TabLayout, VBoxLayout } from '../../ui/index';

import HierarchyPanel from './HierarchyPanel.jsx';
import HistoryPanel from './HistoryPanel.jsx';
import PropertyPanel from './PropertyPanel.jsx';
import ScriptPanel from './ScriptPanel.jsx';
import AnimationPropertyPanel from './AnimationPropertyPanel.jsx';

/**
 * 侧边栏
 * @author tengge / https://github.com/tengge1
 */
class EditorSideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topIndex: 0,
            bottomIndex: 0
        };

        this.handleTopTabChange = this.handleTopTabChange.bind(this);
        this.handleBottomTabChange = this.handleBottomTabChange.bind(this);

        this.handleAnimationSelected = this.handleAnimationSelected.bind(this);
    }

    render() {
        const { topIndex, bottomIndex } = this.state;

        return <VBoxLayout className={'EditorSideBar'}>
            <TabLayout className={'top'}
                activeTabIndex={topIndex}
                onActiveTabChange={this.handleTopTabChange}
            >
                <HierarchyPanel title={_t('Hierachy')} />
                <HistoryPanel title={_t('History')} />
            </TabLayout>
            <TabLayout className={'bottom'}
                activeTabIndex={bottomIndex}
                onActiveTabChange={this.handleBottomTabChange}
            >
                <PropertyPanel title={_t('Property')} />
                <ScriptPanel title={_t('Script')} />
                <AnimationPropertyPanel title={_t('Animation')} />
            </TabLayout>
        </VBoxLayout>;
    }

    componentDidMount() {
        app.on(`animationSelected.EditorSideBar`, this.handleAnimationSelected);
    }

    handleTopTabChange(index) {
        this.setState({
            topIndex: index
        });
    }

    handleBottomTabChange(index) {
        this.setState({
            bottomIndex: index
        });
    }

    handleAnimationSelected() {
        this.setState({
            bottomIndex: 2
        });
    }
}

export default EditorSideBar;