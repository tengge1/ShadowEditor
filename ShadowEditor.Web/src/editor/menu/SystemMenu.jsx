import { MenuItem, MenuItemSeparator } from '../../third_party';
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

        this.handleInitialize = this.handleInitialize.bind(this);
        this.commitInitialize = this.commitInitialize.bind(this);
        this.handleDepartment = this.handleDepartment.bind(this);
        this.handleUser = this.handleUser.bind(this);
        this.handleRole = this.handleRole.bind(this);
        this.handleAuthority = this.handleAuthority.bind(this);
        this.handleSystemSetting = this.handleSystemSetting.bind(this);
        this.handleResetSystem = this.handleResetSystem.bind(this);
        this.commitResetSystem = this.commitResetSystem.bind(this);
    }

    render() {
        const { initialized } = app.config;

        return <MenuItem title={_t('System')}>
            <MenuItem title={_t('Initialize')}
                show={!initialized}
                onClick={this.handleInitialize}
            />
            <MenuItemSeparator show={initialized} />
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
                    app.toast(_t(obj.Msg));
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
                    app.toast(_t(obj.Msg));
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