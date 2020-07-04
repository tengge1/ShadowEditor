/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { MenuItem, MenuItemSeparator } from '../../ui/index';
import DepartmentManagementWindow from '../system/DepartmentManagementWindow.jsx';
import UserManageWindow from '../system/UserManageWindow.jsx';
import RoleManageWindow from '../system/RoleManageWindow.jsx';
import AuthorityManagementWindow from '../system/AuthorityManagementWindow.jsx';
import SystemSettingWindow from '../system/SystemSettingWindow.jsx';

/**
 * 系统菜单
 * @author tengge / https://github.com/tengge1
 */
class SystemMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleDepartment = this.handleDepartment.bind(this);
        this.handleUser = this.handleUser.bind(this);
        this.handleRole = this.handleRole.bind(this);
        this.handleAuthority = this.handleAuthority.bind(this);
        this.handleSystemSetting = this.handleSystemSetting.bind(this);
        this.handleResetSystem = this.handleResetSystem.bind(this);
        this.commitResetSystem = this.commitResetSystem.bind(this);
    }

    render() {
        const { initialized } = app.server;

        return <MenuItem title={_t('System')}>
            <MenuItem title={_t('Department Management')}
                show={initialized}
                onClick={this.handleDepartment}
            />
            <MenuItem title={_t('User Management')}
                show={initialized}
                onClick={this.handleUser}
            />
            <MenuItemSeparator show={initialized} />
            <MenuItem title={_t('Role Management')}
                show={initialized}
                onClick={this.handleRole}
            />
            <MenuItem title={_t('Authority Management')}
                show={initialized}
                onClick={this.handleAuthority}
            />
            <MenuItemSeparator show={initialized} />
            <MenuItem title={_t('System Setting')}
                show={initialized}
                onClick={this.handleSystemSetting}
            />
            <MenuItem title={_t('Reset System')}
                show={initialized}
                onClick={this.handleResetSystem}
            />
        </MenuItem>;
    }

    handleDepartment() {
        const win = app.createElement(DepartmentManagementWindow);
        app.addElement(win);
    }

    handleUser() {
        const win = app.createElement(UserManageWindow);
        app.addElement(win);
    }

    handleRole() {
        const win = app.createElement(RoleManageWindow);
        app.addElement(win);
    }

    handleAuthority() {
        const win = app.createElement(AuthorityManagementWindow);
        app.addElement(win);
    }

    handleSystemSetting() {
        const win = app.createElement(SystemSettingWindow);
        app.addElement(win);
    }

    handleResetSystem() {
        app.confirm({
            title: _t('Query'),
            content: _t('All roles and users will be deleted and the pre-initial state will be restored. Is it reset?'),
            onOK: this.commitResetSystem
        });
    }

    commitResetSystem() {
        fetch(`${app.options.server}/api/Initialize/Reset`, {
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
}

export default SystemMenu;