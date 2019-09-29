import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';
import UserManageWindow from '../system/UserManageWindow.jsx';
import RoleManageWindow from '../system/RoleManageWindow.jsx';
import AuthorityManagementWindow from '../system/AuthorityManagementWindow.jsx';

/**
 * 系统菜单
 * @author tengge / https://github.com/tengge1
 */
class SystemMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authorityEnabled: false,
        };

        this.handleEnableAuthority = this.handleEnableAuthority.bind(this);
        this.handleUser = this.handleUser.bind(this);
        this.handleRole = this.handleRole.bind(this);
        this.handleAuthority = this.handleAuthority.bind(this);
    }

    render() {
        const { authorityEnabled } = this.state;

        return <MenuItem title={_t('System')}>
            <MenuItem title={authorityEnabled ? _t('Disable Authority') : _t('Enable Authority')} onClick={this.handleEnableAuthority}></MenuItem>
            <MenuItemSeparator></MenuItemSeparator>
            <MenuItem title={_t('User Management')} onClick={this.handleUser}></MenuItem>
            <MenuItem title={_t('Role Management')} onClick={this.handleRole}></MenuItem>
            <MenuItem title={_t('Authority Management')} onClick={this.handleAuthority}></MenuItem>
        </MenuItem>;
    }

    handleEnableAuthority() {
        const { authorityEnabled } = this.state;

        this.setState({
            authorityEnabled: !authorityEnabled,
        });
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