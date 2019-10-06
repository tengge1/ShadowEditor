import './css/LoginWindow.css';
import { PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../third_party';
import Ajax from '../../utils/Ajax';

/**
 * 登录窗口
 * @author tengge / https://github.com/tengge1
 */
class LoginWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { username, password } = this.state;

        return <Window
            className={'Login'}
            title={_t('Login')}
            style={{ width: '320px', height: '200px' }}
            mask={false}
            onClose={this.handleClose}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Username')}</Label>
                        <Input name={'username'} value={username} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Password')}</Label>
                        <Input name={'password'} type={'password'} value={password} onChange={this.handleChange}></Input>
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
            [name]: value,
        });
    }

    handleLogin() {
        const { username, password } = this.state;

        fetch(`/api/Login/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `Username=${username}&Password=${password}`
        }).then(response => {
            response.json().then(json => {
                app.toast(_t(json.Msg));
                if (json.Code !== 200) {
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

export default LoginWindow;