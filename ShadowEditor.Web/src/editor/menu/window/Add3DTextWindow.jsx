import './css/Add3DTextWindow.css';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Button, CheckBox, Select } from '../../../third_party';
import ThreeDText from '../../../object/text/ThreeDText';
import AddObjectCommand from '../../../command/AddObjectCommand';

/**
 * 添加3D文字窗口
 * @author tengge / https://github.com/tengge1
 */
class Add3DTextWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: _t('Sone Words'),
            font: null, // 字体
            size: 20, // 尺寸
            height: 24, // 厚度
            bevelEnabled: true, // 倒角
            bevelSize: 2, // 倒角尺寸
            bevelThickness: 2 // 倒角厚度
        };

        this.handleChange = this.handleChange.bind(this);

        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { text, font, size, height, bevelEnabled, bevelSize, bevelThickness } = this.state;

        return <Window
            className={'Add3DTextWindow'}
            title={_t('Add 3D Text')}
            style={{ width: '400px', height: '320px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Text')}</Label>
                        <Input name={'text'}
                            value={text}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Font')}</Label>
                        <Input name={'font'}
                            value={font}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Size')}</Label>
                        <Input name={'size'}
                            type={'number'}
                            value={size}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Thickness')}</Label>
                        <Input name={'height'}
                            type={'number'}
                            value={height}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Enable Bevel')}</Label>
                        <CheckBox name={'bevelEnabled'}
                            checked={bevelEnabled}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Bevel Size')}</Label>
                        <Input name={'bevelSize'}
                            type={'number'}
                            value={bevelSize}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Bevel Thickness')}</Label>
                        <Input name={'bevelThickness'}
                            type={'number'}
                            value={bevelThickness}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleSave}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleSave() {
        const { text, font, size, height, bevelEnabled, bevelSize, bevelThickness } = this.state;

        app.editor.execute(new AddObjectCommand(new ThreeDText(text, {
            font,
            size,
            height,
            bevelEnabled,
            bevelSize,
            bevelThickness
        })));
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default Add3DTextWindow;