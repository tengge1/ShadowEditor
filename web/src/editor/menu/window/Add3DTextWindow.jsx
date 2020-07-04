/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Add3DTextWindow.css';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Button, CheckBox, Select } from '../../../ui/index';
import ThreeDText from '../../../object/text/ThreeDText';
import AddObjectCommand from '../../../command/AddObjectCommand';
import TypefaceUtils from '../../../utils/TypefaceUtils';

/**
 * 添加3D文字窗口
 * @author tengge / https://github.com/tengge1
 */
class Add3DTextWindow extends React.Component {
    constructor(props) {
        super(props);

        this.fonts = [];

        this.state = {
            text: _t('Some Words'),
            fonts: {}, // 所有字体
            font: '', // 字体
            size: 4, // 尺寸
            color: '#ffffff', // 颜色
            height: 2, // 厚度
            bevelEnabled: true, // 倒角
            bevelSize: 0.1, // 倒角尺寸
            bevelThickness: 0.1 // 倒角厚度
        };

        this.handleChange = this.handleChange.bind(this);

        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { text, fonts, font, size, color, height, bevelEnabled, bevelSize, bevelThickness } = this.state;

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
                        <Select name={'font'}
                            value={font}
                            options={fonts}
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
                        <Label>{_t('Color')}</Label>
                        <Input name={'color'}
                            type={'color'}
                            value={color}
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

    componentDidMount() {
        this.updateFonts();
    }

    updateFonts() {
        fetch(`${app.options.server}/api/Typeface/List`).then(response => {
            response.json().then(json => {
                if (json.Code !== 200) {
                    app.toast(_t(json.Msg), 'warn');
                    return;
                }

                this.fonts = json.Data;

                if (this.fonts.length === 0) {
                    app.toast(_t('Pleast upload typeface first.'), 'warn');
                    return;
                }

                let fonts = {};

                this.fonts.forEach(n => {
                    fonts[n.ID] = n.Name;
                });

                this.setState({
                    fonts,
                    font: this.fonts[0].ID
                });
            });
        });
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleSave() {
        const { text, font, size, color, height, bevelEnabled, bevelSize, bevelThickness } = this.state;

        if (font === '') {
            app.toast(_t('Pleast upload typeface first.'), 'warn');
            return;
        }

        app.mask();

        const fontData = this.fonts.filter(n => n.ID === font)[0];

        fetch(`${app.options.server}${fontData.Url}`).then(response => {
            response.arrayBuffer().then(buffer => {
                TypefaceUtils.convertTtfToJson(buffer, false, text).then(obj => {
                    app.editor.execute(new AddObjectCommand(new ThreeDText(text, {
                        font: obj.result,
                        size,
                        color,
                        height,
                        bevelEnabled,
                        bevelSize,
                        bevelThickness
                    })));
                    app.unmask();
                    this.handleClose();
                });
            });
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default Add3DTextWindow;