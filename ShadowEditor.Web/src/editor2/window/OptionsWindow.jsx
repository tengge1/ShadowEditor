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

        this.state = {
            activeTabIndex: 0,
        };

        this.updateUI = this.updateUI.bind(this);

        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
    }

    render() {
        const { activeTabIndex } = this.state;

        return <Window
            className={'OptionsWindow'}
            title={L_SETTINGS}
            style={{ width: '300px', height: '400px', }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <TabLayout className={'tab'} activeTabIndex={activeTabIndex} onActiveTabChange={this.handleActiveTabChange}>
                    <RendererPanel title={L_RENDERER}></RendererPanel>
                    <HelperPanel title={L_HELPERS}></HelperPanel>
                    <FilterPanel title={L_FILTER}></FilterPanel>
                </TabLayout>
            </Content>
            <Buttons>
                <Button onClick={this.handleSave}>{L_OK}</Button>
                <Button onClick={this.handleClose}>{L_CANCEL}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        this.updateUI();
    }

    updateUI() {

    }

    handleSave() {

    }

    handleClose() {
        app.removeElement(this);
    }

    handleActiveTabChange(index) {
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