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
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { username, password } = this.state;

        return <Window
            className={'RegisterWindow'}
            title={_t('Register')}
            style={{ width: '400px', height: '240px' }}
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
                        <Input name={'password'} value={password} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Confirm Password')}</Label>
                        <Input name={'password'} value={password} onChange={this.handleChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Name')}</Label>
                        <Input name={'password'} onChange={this.handleChange}></Input>
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

export default RegisterWindow;