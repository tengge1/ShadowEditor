import './css/LoginMenu.css';
import { classNames, MenuItemSeparator, Button, LinkButton } from '../../third_party';
import LoginWindow from '../system/LoginWindow.jsx';
import RegisterWindow from '../system/RegisterWindow.jsx';

/**
 * 登录菜单
 * @author tengge / https://github.com/tengge1
 */
class LoginMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickRegister = this.handleClickRegister.bind();
        this.handleClickLogin = this.handleClickLogin.bind(this);
    }

    render() {
        return <>
            <MenuItemSeparator className={'LoginSeparator'} direction={'horizontal'} />
            <li className={classNames('MenuItem', 'LoginMenuItem')}>
                <LinkButton className={'button'} onClick={this.handleClickRegister}>{_t(`Register`)}</LinkButton>
            </li>
            <MenuItemSeparator className={'LoginSeparator'} direction={'horizontal'} />
            <li className={classNames('MenuItem', 'LoginMenuItem')}>
                <LinkButton className={'button'} onClick={this.handleClickLogin}>{_t(`Login`)}</LinkButton>
            </li>
        </>;
    }

    handleClickRegister() {
        const win = app.createElement(RegisterWindow);
        app.addElement(win);
    }

    handleClickLogin() {
        const win = app.createElement(LoginWindow);
        app.addElement(win);
    }
}

export default LoginMenu;