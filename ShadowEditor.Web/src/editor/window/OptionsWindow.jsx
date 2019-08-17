import './css/OptionsWindow.css';
import { classNames, PropTypes, Window, Content, TabLayout, Buttons, Button } from '../../third_party';
import RendererPanel from './options/RendererPanel.jsx';
import HelperPanel from './options/HelperPanel.jsx';
import FilterPanel from './options/FilterPanel.jsx';
import Ajax from '../../utils/Ajax';

/**
 * 选项窗口
 * @author tengge / https://github.com/tengge1
 */
class OptionsWindow extends React.Component {
    constructor(props) {
        super(props);

        this.rendererRef = React.createRef();
        this.helperRef = React.createRef();
        this.filterRef = React.createRef();

        this.state = {
            activeTabIndex: props.activeTabIndex,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
    }

    render() {
        const { activeTabIndex } = this.state;

        return <Window
            className={'OptionsWindow'}
            title={_t('Settings')}
            style={{ width: '300px', height: '400px', }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <TabLayout className={'tab'} activeTabIndex={activeTabIndex} onActiveTabChange={this.handleActiveTabChange}>
                    <RendererPanel title={_t('Renderer')} ref={this.rendererRef}></RendererPanel>
                    <HelperPanel title={_t('Helpers')} ref={this.helperRef}></HelperPanel>
                    <FilterPanel title={_t('Filter')} ref={this.filterRef}></FilterPanel>
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
        const rendererTab = this.rendererRef.current;
        const helperTab = this.helperRef.current;
        const filterTab = this.filterRef.current;

        switch (index) {
            case 0:
                rendererTab.handleUpdate();
                break;
            case 1:
                helperTab.handleUpdate();
                break;
            case 2:
                filterTab.handleUpdate();
                break;
        }

        this.setState({
            activeTabIndex: index,
        });
    }
}

OptionsWindow.propTypes = {
    activeTabIndex: PropTypes.number,
    onActiveTabChange: PropTypes.func,
};

OptionsWindow.defaultProps = {
    activeTabIndex: 0,
    onActiveTabChange: null,
};

export default OptionsWindow;