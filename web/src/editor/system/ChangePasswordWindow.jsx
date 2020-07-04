/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/ChangePasswordWindow.css';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../ui/index';

/**
 * 修改密码窗口
 * @author tengge / https://github.com/tengge1
 */
class ChangePasswordWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleOK = this.handleOK.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { oldPassword, newPassword, confirmPassword } = this.state;

        return <Window
            className={'ChangePasswordWindow'}
            title={_t('Change Password')}
            style={{ width: '400px', height: '240px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Old Password')}</Label>
                        <Input name={'oldPassword'}
                            type={'password'}
                            value={oldPassword}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('New Password')}</Label>
                        <Input name={'newPassword'}
                            type={'password'}
                            value={newPassword}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Confirm Password')}</Label>
                        <Input name={'confirmPassword'}
                            type={'password'}
                            value={confirmPassword}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleOK}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleOK() {
        const { oldPassword, newPassword, confirmPassword } = this.state;

        fetch(`/api/User/ChangePassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `OldPassword=${oldPassword}&NewPassword=${newPassword}&ConfirmPassword=${confirmPassword}`
        }).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                app.toast(_t(obj.Msg), 'success');
                this.handleClose();
            });
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default ChangePasswordWindow;