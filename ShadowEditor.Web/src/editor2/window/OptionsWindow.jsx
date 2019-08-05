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
            activeTab: 0,
        };

        this.updateUI = this.updateUI.bind(this);

        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
    }

    render() {
        const { activeTab } = this.state;

        return <Window
            className={'OptionsWindow'}
            title={`Settings`}
            style={{ width: '800px', height: '500px', }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <TabLayout className={'tab'}>
                    <RendererPanel title={'Renderer'}></RendererPanel>
                    <HelperPanel title={'Helper'}></HelperPanel>
                    <FilterPanel title={'Filter'}></FilterPanel>
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

    handleActiveTabChange() {

    }
}

OptionsWindow.propTypes = {
    activeTab: PropTypes.number,
    onActiveTabChange: PropTypes.func,
};

OptionsWindow.defaultProps = {
    activeTab: 0,
    onActiveTabChange: null,
};

export default OptionsWindow;