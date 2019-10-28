import './css/ResetPasswordWindow.css';
import { PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Button, Select } from '../../../third_party';

/**
 * 重置密码窗口
 * @author tengge / https://github.com/tengge1
 */
class ResetPasswordWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            newPassword: '',
            confirmPassword: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { newPassword, confirmPassword } = this.state;

        return <Window
            className={_t('ResetPasswordWindows')}
            title={_t('Reset Password')}
            style={{ width: '320px', height: '200px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
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
        const { id, newPassword, confirmPassword } = this.state;

        if (!newPassword || newPassword.trim() === '') {
            app.toast(_t('New password is not allowed to be empty.'));
            return;
        }

        if (!confirmPassword || confirmPassword.trim() === '') {
            app.toast(_t('Confirm password is not allowed to be empty.'));
            return;
        }

        if (newPassword !== confirmPassword) {
            app.toast(_t('New password and confirm password is not the same.'));
            return;
        }

        fetch(`${app.options.server}/api/User/ResetPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `ID=${id}&NewPassword=${newPassword}&ConfirmPassword=${confirmPassword}`
        }).then(response => {
            response.json().then(json => {
                if (json.Code !== 200) {
                    app.toast(_t(json.Msg));
                    return;
                }
                this.handleClose();
            });
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

ResetPasswordWindow.propTypes = {
    id: PropTypes.string
};

ResetPasswordWindow.defaultProps = {
    id: ''
};

export default ResetPasswordWindow;