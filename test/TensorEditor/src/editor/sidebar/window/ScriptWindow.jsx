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
            'vertexShader': _t('Vertex Shader'),
            'fragmentShader': _t('Frag Shader'),
            'json': _t('Shader Program Info')
        };

        this.state = {
            name: _t('No Name'),
            type: 'javascript',
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleOK = this.handleOK.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSaveScript = this.handleSaveScript.bind(this);
    }

    render() {
        const { name, type } = this.state;

        return <Window
            className={'ScriptWindow'}
            title={_t('Create Script')}
            onClose={this.handleClose}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Name')}</Label>
                        <Input value={name} onChange={this.handleNameChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Type')}</Label>
                        <Select
                            options={this.scriptTypes}
                            value={type}
                            disabled={true}
                            onChange={this.handleTypeChange}></Select>
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleOK}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
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

        app.call(`editScript`, this, uuid, name, type, source, this.handleSaveScript);
    }

    handleSaveScript(uuid, name, type, source) {
        app.editor.scripts[uuid] = {
            id: null,
            uuid,
            name,
            type,
            source,
        };

        app.call(`scriptChanged`, this);
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default ScriptWindow;