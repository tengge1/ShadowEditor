import './css/RendererrAttributesWindow.css';
import { classNames, PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Select, ImageUploader, Button } from '../../../third_party';

/**
 * 渲染器属性窗口
 * @author tengge / https://github.com/tengge1
 */
class RendererrAttributesWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alpha: false,
            antialias: true,
            depth: true,
            desynchronized: false,
            failIfMajorPerformanceCaveat: false,
            powerPreference: 'default',
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
            stencil: true,
        };

        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const state = this.state;

        return <Window
            className={'RendererrAttributesWindow'}
            title={_t('Renderer Attributes')}
            style={{ width: '400px', height: '320px', }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <Form>
                    {Object.keys(state).map(key => {
                        const value = state[key];
                        return <FormControl key={key}>
                            <Label>{_t(key)}</Label>
                            <Input name={key} value={value.toString()} disabled={true}></Input>
                        </FormControl>;
                    })}
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        const state = app.editor.renderer.getContextAttributes();

        this.setState(state);
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default RendererrAttributesWindow;