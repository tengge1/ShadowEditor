import './css/LoginWindow.css';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Button } from '../../third_party';

/**
 * 登录窗口
 * @author tengge / https://github.com/tengge1
 */
class LoginWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
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
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Username')}</Label>
                        <Input name={'username'}
                            value={username}
                            onChange={this.handleChange}
                        />
                        <input type={'password'}
                            className={'fake'}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Password')}</Label>
                        <Input name={'password'}
                            type={'password'}
                            value={password}
                            onChange={this.handleChange}
                        />
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
        const { username, password } = this.state;

        app.server.login(username, password).then(succes => {
            if (!succes) {
                return;
            }
            this.handleClose();
            window.location.reload();
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

export default LoginWindow;