import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';
import UserManageWindow from './window/UserManageWindow.jsx';
import RoleManageWindow from './window/RoleManageWindow.jsx';
import AuthorityManagementWindow from './window/AuthorityManagementWindow.jsx';

/**
 * 系统菜单
 * @author tengge / https://github.com/tengge1
 */
class SystemMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleUser = this.handleUser.bind(this);
        this.handleRole = this.handleRole.bind(this);
        this.handleAuthority = this.handleAuthority.bind(this);
    }

    render() {
        return <MenuItem title={_t('System')}>
            <MenuItem title={_t('User Management')} onClick={this.handleUser}></MenuItem>
            <MenuItem title={_t('Role Management')} onClick={this.handleRole}></MenuItem>
            <MenuItem title={_t('Authority Management')} onClick={this.handleAuthority}></MenuItem>
        </MenuItem>;
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
}

export default SystemMenu;