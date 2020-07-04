/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../../ui/index';

/**
 * Three.js信息窗口
 * @author tengge / https://github.com/tengge1
 */
class ThreeJsInformationWindow extends React.Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        return <Window
            className={'ThreeJsInformationWindow'}
            title={_t('Three.js Information')}
            style={{ width: '320px', height: '160px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Version')}</Label>
                        <Input value={THREE.REVISION}
                            disabled
                        />
                    </FormControl>
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

export default ThreeJsInformationWindow;