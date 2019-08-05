import { classNames, PropTypes, Window, Content, TabLayout, Buttons, Button } from '../../../third_party';
import Ajax from '../../../utils/Ajax';

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
    }

    render() {
        const { activeTab } = this.state;

        return <Window
            title={`编辑${typeName}`}
            style={{ width: '320px', height: '300px', }}
            mask={true}
            onClose={this.handleClose}>
            <Content>
                <TabLayout>
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

    }
}

export default OptionsWindow;