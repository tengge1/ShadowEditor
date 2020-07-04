/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/OptionsWindow.css';
import { PropTypes } from '../../../third_party';
import { Window, Content, TabLayout, Buttons, Button } from '../../../ui/index';
import DisplayPanel from './options/DisplayPanel.jsx';
import RendererPanel from './options/RendererPanel.jsx';
import HelperPanel from './options/HelperPanel.jsx';
import FilterPanel from './options/FilterPanel.jsx';
import WeatherPanel from './options/WeatherPanel.jsx';

/**
 * 选项窗口
 * @author tengge / https://github.com/tengge1
 */
class OptionsWindow extends React.Component {
    constructor(props) {
        super(props);

        this.displayRef = React.createRef();
        this.rendererRef = React.createRef();
        this.helperRef = React.createRef();
        this.filterRef = React.createRef();
        this.weatherRef = React.createRef();

        this.state = {
            activeTabIndex: props.activeTabIndex
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
    }

    render() {
        const { activeTabIndex } = this.state;

        return <Window
            className={'OptionsWindow'}
            title={_t('Settings')}
            style={{ width: '300px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <TabLayout className={'tab'}
                    activeTabIndex={activeTabIndex}
                    onActiveTabChange={this.handleActiveTabChange}
                >
                    <DisplayPanel title={_t('Display')}
                        ref={this.displayRef}
                    />
                    <RendererPanel title={_t('Renderer')}
                        ref={this.rendererRef}
                    />
                    <HelperPanel title={_t('Helpers')}
                        ref={this.helperRef}
                    />
                    <FilterPanel title={_t('Filter')}
                        ref={this.filterRef}
                    />
                    <WeatherPanel title={_t('Weather')}
                        ref={this.weatherRef}
                    />
                </TabLayout>
            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        const { activeTabIndex } = this.state;
        this.handleActiveTabChange(activeTabIndex);
    }

    handleClose() {
        app.removeElement(this);
    }

    handleActiveTabChange(index) {
        const displayTab = this.displayRef.current;
        const rendererTab = this.rendererRef.current;
        const helperTab = this.helperRef.current;
        const filterTab = this.filterRef.current;
        const weatherTab = this.weatherRef.current;

        switch (index) {
            case 0:
                displayTab.handleUpdate();
                break;
            case 1:
                rendererTab.handleUpdate();
                break;
            case 2:
                helperTab.handleUpdate();
                break;
            case 3:
                filterTab.handleUpdate();
                break;
            case 4:
                weatherTab.handleUpdate();
                break;
        }

        this.setState({
            activeTabIndex: index
        });
    }
}

OptionsWindow.propTypes = {
    activeTabIndex: PropTypes.number,
    onActiveTabChange: PropTypes.func
};

OptionsWindow.defaultProps = {
    activeTabIndex: 0,
    onActiveTabChange: null
};

export default OptionsWindow;