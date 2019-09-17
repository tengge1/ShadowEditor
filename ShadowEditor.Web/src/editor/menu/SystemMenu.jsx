import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

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
    }

    render() {
        return <MenuItem title={_t('System')}>
            <MenuItem title={_t('Department Management')} onClick={this.handleDepartment}></MenuItem>
            <MenuItem title={_t('User Management')} onClick={this.handleUser}></MenuItem>
            <MenuItem title={_t('Role Management')} onClick={this.handleRole}></MenuItem>
            <MenuItem title={_t('Authority management')} onClick={this.handleAuthority}></MenuItem>
        </MenuItem>;
    }

    handleDepartment() {

    }

    handleUser() {

    }

    handleRole() {

    }

    handleAuthority() {

    }
}

export default SystemMenu;