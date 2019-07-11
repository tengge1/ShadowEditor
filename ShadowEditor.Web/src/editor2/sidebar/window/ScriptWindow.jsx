import './css/ScriptWindow.css';
import { classNames, PropTypes, Window, Content, Form, FormControl, Label, Input, Select, Buttons, Button } from '../../../third_party';

/**
 * 脚本窗口
 * @author tengge / https://github.com/tengge1
 */
class ScriptWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const options = {
            'javascript': 'JavaScript',
            'vertexShader': L_VERTEX_SHADER,
            'fragmentShader': L_FRAGMENT_SHADER,
            'json': L_SHADER_PROGRAM_INFO
        };

        return <Window
            className={'ScriptWindow'}
            title={L_CREATE_SCRIPT}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{L_NAME}</Label>
                        <Input value={L_NO_NAME}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{L_TYPE}</Label>
                        <Select options={options} value={'javascript'}></Select>
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button>{L_OK}</Button>
                <Button>{L_CANCEL}</Button>
            </Buttons>
        </Window>;
    }
}

export default ScriptWindow;