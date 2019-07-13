import './css/ScriptWindow.css';
import { classNames, PropTypes, Window, Content, Form, FormControl, Label, Input, Select, Buttons, Button } from '../../../third_party';

/**
 * 脚本窗口
 * @author tengge / https://github.com/tengge1
 */
class ScriptWindow extends React.Component {
    constructor(props) {
        super(props);

        this.scriptTypes = {
            'javascript': 'JavaScript',
            'vertexShader': L_VERTEX_SHADER,
            'fragmentShader': L_FRAGMENT_SHADER,
            'json': L_SHADER_PROGRAM_INFO
        };

        this.state = {
            name: L_NO_NAME,
            type: 'javascript',
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleOK = this.handleOK.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    render() {
        const { name, type } = this.state;

        return <Window
            className={'ScriptWindow'}
            title={L_CREATE_SCRIPT}
            onClose={this.handleCancel}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{L_NAME}</Label>
                        <Input value={name} onChange={this.handleNameChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{L_TYPE}</Label>
                        <Select
                            options={this.scriptTypes}
                            value={type}
                            disabled={true}
                            onChange={this.handleTypeChange}></Select>
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleOK}>{L_OK}</Button>
                <Button onClick={this.handleCancel}>{L_CANCEL}</Button>
            </Buttons>
        </Window>;
    }

    handleNameChange(value) {
        this.setState({
            name: value,
        });
    }

    handleTypeChange(value) {
        this.setState({
            type: value,
        });
    }

    handleOK() {
        const uuid = THREE.Math.generateUUID();
        const name = this.state.name;
        const source = '';
        const title = name;

        this.handleCancel();

        app.call(`editScript`, this, uuid, name, source, title);
    }

    handleCancel() {
        app.removeElement(this);
    }
}

export default ScriptWindow;