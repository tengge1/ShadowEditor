import './css/ScriptWindow.css';
import { classNames, PropTypes, Window, Content, Form, FormControl, Label, Input, Select, Buttons, Button } from '../../../third_party';
import FragmentShaderStarter from '../../script/code/FragmentShaderStarter';
import JavaScriptStarter from '../../script/code/JavaScriptStarter';
import JsonStarter from '../../script/code/JsonStarter';
import VertexShaderStarter from '../../script/code/VertexShaderStarter';

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
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { name, type } = this.state;

        return <Window
            className={'ScriptWindow'}
            title={L_CREATE_SCRIPT}
            onClose={this.handleClose}>
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
                <Button onClick={this.handleClose}>{L_CANCEL}</Button>
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
        const { name, type } = this.state;

        const uuid = THREE.Math.generateUUID();

        let source = '';

        switch (type) {
            case 'javascript':
                source = JavaScriptStarter();
                break;
            case 'vertexShader':
                source = VertexShaderStarter();
                break;
            case 'fragmentShader':
                source = FragmentShaderStarter();
                break;
            case 'json':
                source = JsonStarter();
                break;
            default:
                source = JavaScriptStarter();
        }

        app.editor.scripts[uuid] = {
            id: null,
            name,
            type,
            source,
            uuid,
        };

        app.call(`scriptChanged`, this);

        this.handleClose();

        this.setState({
            show: false,
            uuid: null,
            name: '',
            type: 'javascript',
            source: '',
        });

        app.call(`editScript`, this, uuid, name, type, source);
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default ScriptWindow;