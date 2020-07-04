/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/TypefaceConverterWindow.css';
import { Window, Content, Buttons, Button, Label, Input, CheckBox, Form, FormControl, LinkButton } from '../../../ui/index';
import TypefaceUtils from '../../../utils/TypefaceUtils';
import DownloadUtils from '../../../utils/DownloadUtils';

/**
 * 字体转换器窗口
 * @author tengge / https://github.com/tengge1
 */
class TypefaceConverterWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            reverseDirection: false,
            characterSet: '',
            font: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleConvertFontType = this.handleConvertFontType.bind(this);
        this.handleOK = this.handleOK.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { file, reverseDirection, characterSet } = this.state;

        return <Window
            className={'TypefaceConverterWindow'}
            title={_t('Typeface Converter')}
            style={{ width: '400px', height: '320px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Font File') + ' (.ttf)'}</Label>
                        <Input className={'font'}
                            name={'file'}
                            type={'file'}
                            value={file}
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

    handleChange(value, name, event) {
        if (name === 'file') {
            this.setState({
                [name]: value,
                font: event.target.files[0]
            });
        } else {
            this.setState({
                [name]: value
            });
        }
    }

    handleConvertFontType() {
        window.open('https://transfonter.org/ttc-unpack', '_blank');
    }

    handleOK() {
        const { font, reverseDirection, characterSet } = this.state;

        if (!font) {
            app.toast(_t('Please select an file.'));
            return;
        }

        app.mask(_t('Waiting...'));

        const reader = new FileReader();

        reader.addEventListener('load', event => {
            TypefaceUtils.convertTtfToJson(event.target.result, reverseDirection, characterSet.trim()).then(obj => {
                app.unmask();
                this.handleClose();
                DownloadUtils.download([obj.result], { 'type': 'application/octet-stream' }, `${obj.font.familyName}_${obj.font.styleName}.json`);
                app.toast(_t('Convert successfully!'), 'success');
            });
        }, false);

        reader.readAsArrayBuffer(font);
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default TypefaceConverterWindow;