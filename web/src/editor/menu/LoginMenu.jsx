/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/LoginMenu.css';
import { classNames } from '../../third_party';
import { MenuItemSeparator, LinkButton } from '../../ui/index';
import LoginWindow from '../system/LoginWindow.jsx';
import RegisterWindow from '../system/RegisterWindow.jsx';
import ChangePasswordWindow from '../system/ChangePasswordWindow.jsx';
// import CookieUtils from '../../utils/CookieUtils';

/**
 * 登录菜单
 * @author tengge / https://github.com/tengge1
 */
class LoginMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleInitialize = this.handleInitialize.bind(this);
        this.commitInitialize = this.commitInitialize.bind(this);
        this.handleClickRegister = this.handleClickRegister.bind();
        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleClickLogout = this.handleClickLogout.bind(this);
        this.commitLogout = this.commitLogout.bind(this);
    }

    render() {
        if (!app.server.initialized) { // 系统未初始化
            return <>
                <MenuItemSeparator className={'LoginSeparator'}
                    direction={'horizontal'}
                />
                <li className={classNames('MenuItem', 'LoginMenuItem')}>
                    <LinkButton className={'button'}
                        onClick={this.handleInitialize}
                    >{_t(`Initialize`)}</LinkButton>
                </li>
            </>;
        } else if (app.server.isLogin) { // 已经登录
            return <>
                <MenuItemSeparator className={'LoginSeparator'}
                    direction={'horizontal'}
                />
                <li className={classNames('MenuItem', 'LoginMenuItem')}>
                    <span className={'welcome'}>{_t(`Welcome, {{Name}}`, { Name: app.server.name === 'Administrator' ? _t(app.server.name) : app.server.name })}</span>
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
        } else { // 尚未登录
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

    handleInitialize() {
        app.confirm({
            title: _t('Query'),
            content: _t('Are you sure to initialize the roles and users?'),
            onOK: this.commitInitialize
        });
    }

    commitInitialize() {
        fetch(`${app.options.server}/api/Initialize/Initialize`, {
            method: 'POST'
        }).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                app.confirm({
                    title: _t('Message'),
                    content: _t(obj.Msg) + ' ' + _t('Press OK To refresh.'),
                    onOK: () => {
                        window.location.reload();
                    }
                });
            });
        });
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
        // 服务端需要设置SameSite=Lax，否则无法清除客户端Cookie。
        app.server.logout().then(success => {
            if (!success) {
                return;
            }
            // CookieUtils.clearAll();
            window.location.reload();
            app.toast(_t(obj.Msg));
        });
    }
}

export default LoginMenu;