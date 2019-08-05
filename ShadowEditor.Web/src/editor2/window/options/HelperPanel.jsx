import './css/HelperPanel.css';
import { classNames, PropTypes, Window, Content, TabLayout, Buttons, Button, Form, FormControl, Label, Input, Select, CheckBox } from '../../../third_party';

/**
 * 渲染器窗口
 * @author tengge / https://github.com/tengge1
 */
class HelperPanel extends React.Component {
    constructor(props) {
        super(props);

        this.shadowMapType = {
            [-1]: L_DISABLED,
            [THREE.BasicShadowMap]: L_BASIC_SHADOW, // 0
            [THREE.PCFShadowMap]: L_PCF_SHADOW, // 1
            [THREE.PCFSoftShadowMap]: L_PCF_SOFT_SHADOW // 2
        };

        this.state = {
            shadowMapType: -1,
            gammaInput: 0,
            gammaOutput: 0,
            gammaFactor: 0,
        };

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { shadowMapType, gammaInput, gammaOutput, gammaFactor } = this.state;

        return <Form>
            <FormControl>
                <Label>{L_SHADOW}</Label>
                <Select options={this.shadowMapType} name={'shadowMapType'} value={shadowMapType} onChange={this.handleChange}></Select>
            </FormControl>
            <FormControl>
                <Label>{L_GAMMA_INPUT}</Label>
                <CheckBox name={'gammaInput'} value={gammaInput} onChange={this.handleChange}></CheckBox>
            </FormControl>
            <FormControl>
                <Label>{L_GAMMA_OUTPUT}</Label>
                <CheckBox name={'gammaOutput'} value={gammaOutput} onChange={this.handleChange}></CheckBox>
            </FormControl>
            <FormControl>
                <Label>{L_GAMMA_FACTOR}</Label>
                <Input type={'number'} name={'gammaFactor'} value={gammaFactor} onChange={this.handleChange}></Input>
            </FormControl>
        </Form>;
    }

    handleUpdate() {
        const renderer = app.editor.renderer;

        this.setState({
            shadowMapType: renderer.shadowMap.enabled ? renderer.shadowMap.type : -1,
            gammaInput: renderer.gammaInput,
            gammaOutput: renderer.gammaOutput,
            gammaFactor: renderer.gammaFactor,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        let renderer = app.editor.renderer;

        const { shadowMapType, gammaInput, gammaOutput, gammaFactor } = Object.assign({}, this.state, {
            [name]: value,
        });

        if (shadowMapType === -1) {
            renderer.shadowMap.enabled = false;
        } else {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = shadowMapType;
        }

        renderer.gammaInput = gammaInput;
        renderer.gammaOutput = gammaOutput;
        renderer.gammaFactor = gammaFactor;

        renderer.dispose();

        Object.assign(app.options, {
            shadowMapType,
            gammaInput,
            gammaOutput,
            gammaFactor
        });
    }
}

export default HelperPanel;