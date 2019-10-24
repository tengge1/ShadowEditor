import './css/RegisterWindow.css';
import { PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../third_party';
import Ajax from '../../utils/Ajax';

/**
 * 注册窗口
 * @author tengge / https://github.com/tengge1
 */
class RegisterWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            name: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { username, password, confirmPassword, name } = this.state;

        return <Window
            className={'RegisterWindow'}
            title={_t('Register')}
            style={{ width: '400px', height: '240px' }}
            mask={false}
            onClose={this.handleClose}
        >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Username')}</Label>
                        <Input name={'username'} value={username} onChange={this.handleChange} />
                        <input type={'text'} className={'fake'} />
                        <input type={'password'} className={'fake'} />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Password')}</Label>
                        <Input name={'password'} type={'password'} value={password} onChange={this.handleChange} />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Confirm Password')}</Label>
                        <Input name={'confirmPassword'} type={'password'} value={confirmPassword} onChange={this.handleChange} />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('NickName')}</Label>
                        <Input name={'name'} value={name} onChange={this.handleChange} />
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleLogin}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleLogin() {
        const { username, password, confirmPassword, name } = this.state;

        fetch(`/api/Register/Register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `Username=${username}&Password=${password}&ConfirmPassword=${confirmPassword}&name=${name}`
        }).then(response => {
            response.json().then(json => {
                if (json.Code !== 200) {
                    app.toast(_t(json.Msg));
                    return;
                }
                app.toast(_t(json.Msg));
                this.handleClose();
            });
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default RegisterWindow;