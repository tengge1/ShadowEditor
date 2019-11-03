import './css/LoginMenu.css';
import { classNames, MenuItemSeparator, Button, LinkButton } from '../../third_party';
import LoginWindow from '../system/LoginWindow.jsx';
import RegisterWindow from '../system/RegisterWindow.jsx';
import ChangePasswordWindow from '../system/ChangePasswordWindow.jsx';

/**
 * 登录菜单
 * @author tengge / https://github.com/tengge1
 */
class LoginMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickRegister = this.handleClickRegister.bind();
        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleClickLogout = this.handleClickLogout.bind(this);
        this.commitLogout = this.commitLogout.bind(this);
    }

    render() {
        if (app.config.isLogin) { // 登录
            return <>
                <MenuItemSeparator className={'LoginSeparator'}
                    direction={'horizontal'}
                />
                <li className={classNames('MenuItem', 'LoginMenuItem')}>
                    <span className={'welcome'}>{_t(`Welcome, {{Name}}`, { Name: app.config.name === 'Administrator' ? _t(app.config.name) : app.config.name })}</span>
                </li>
                <MenuItemSeparator className={'LoginSeparator'}
                    direction={'horizontal'}
                />
                <li className={classNames('MenuItem', 'LoginMenuItem')}>
                    <LinkButton className={'button'}
                        onClick={this.handleChangePassword}
                    >{_t(`Change Password`)}</LinkButton>
                </li>
                <MenuItemSeparator className={'LoginSeparator'}
                    direction={'horizontal'}
                />
                <li className={classNames('MenuItem', 'LoginMenuItem')}>
                    <LinkButton className={'button'}
                        onClick={this.handleClickLogout}
                    >{_t(`Logout`)}</LinkButton>
                </li>
            </>;
        } else { // 未登录
            return <>
                <MenuItemSeparator className={'LoginSeparator'}
                    direction={'horizontal'}
                />
                <li className={classNames('MenuItem', 'LoginMenuItem')}>
                    <LinkButton className={'button'}
                        onClick={this.handleClickRegister}
                    >{_t(`Register`)}</LinkButton>
                </li>
                <MenuItemSeparator className={'LoginSeparator'}
                    direction={'horizontal'}
                />
                <li className={classNames('MenuItem', 'LoginMenuItem')}>
                    <LinkButton className={'button'}
                        onClick={this.handleClickLogin}
                    >{_t(`Login`)}</LinkButton>
                </li>
            </>;
        }
    }

    handleClickRegister() {
        const win = app.createElement(RegisterWindow);
        app.addElement(win);
    }

    handleClickLogin() {
        const win = app.createElement(LoginWindow);
        app.addElement(win);
    }

    handleChangePassword() {
        const win = app.createElement(ChangePasswordWindow);
        app.addElement(win);
    }

    handleClickLogout() {
        app.confirm({
            title: _t('Query'),
            content: _t('Are you sure to log out?'),
            onOK: this.commitLogout
        });
    }

    commitLogout() {
        fetch(`/api/Login/Logout`, {
            method: 'POST'
        }).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg));
                    return;
                }
                app.config.isLogin = false;
                app.config.username = '';
                app.config.name = '';
                app.call('logout', this);
                window.location.reload();
                app.toast(_t(obj.Msg));
            });
        });
    }
}

export default LoginMenu;