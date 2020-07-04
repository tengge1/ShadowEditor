/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/RendererAttributesWindow.css';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../../ui/index';

/**
 * 渲染器属性窗口
 * @author tengge / https://github.com/tengge1
 */
class RendererAttributesWindow extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const attributes = app.editor.renderer.getContextAttributes();

        return <Window
            className={'RendererAttributesWindow'}
            title={_t('Renderer Attributes')}
            style={{ width: '400px', height: '320px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    {Object.keys(attributes).map(key => {
                        const value = attributes[key];
                        return <FormControl key={key}>
                            <Label>{_t(key)}</Label>
                            <Input name={key}
                                value={value.toString()}
                                disabled
                            />
                        </FormControl>;
                    })}
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleClose}>{_t('Close')}</Button>
            </Buttons>
        </Window>;
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default RendererAttributesWindow;