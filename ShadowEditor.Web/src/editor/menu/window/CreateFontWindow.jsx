import './css/CreateFontWindow.css';
import { Window, Content, Buttons, Button, Label, Input, CheckBox, Form, FormControl, LinkButton } from '../../../third_party';

/**
 * 创建字体窗口
 * @author tengge / https://github.com/tengge1
 */
class CreateFontWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            font: null,
            reverseDirection: false,
            characterSet: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleConvertFontType = this.handleConvertFontType.bind(this);
        this.handleOK = this.handleOK.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { font, reverseDirection, characterSet } = this.state;

        return <Window
            className={'CreateFontWindow'}
            title={_t('Create Font')}
            style={{ width: '400px', height: '320px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Font File') + ' (.ttf)'}</Label>
                        <Input className={'font'}
                            name={'font'}
                            type={'file'}
                            value={font}
                            accept={'.ttf'}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Reverse direction')}</Label>
                        <CheckBox name={'reverseDirection'}
                            checked={reverseDirection}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Character set')}</Label>
                        <Input name={'characterSet'}
                            value={characterSet}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('.ttc to .ttf')}</Label>
                        <LinkButton onClick={this.handleConvertFontType}>{'https://transfonter.org/ttc-unpack'}</LinkButton>
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleOK}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        app.require('opentype');
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleConvertFontType() {
        window.open('https://transfonter.org/ttc-unpack', '_blank');
    }

    handleOK() {

    }

    handleClose() {
        app.removeElement(this);
    }
}

export default CreateFontWindow;