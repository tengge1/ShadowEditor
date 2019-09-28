import { classNames, PropTypes, MenuBar, MenuItem } from '../../third_party';
import LoginWindow from '../system/LoginWindow.jsx';

/**
 * 状态菜单
 * @author tengge / https://github.com/tengge1
 */
class LoginMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return <MenuItem title={_t(`Login`)} onClick={this.handleClick}></MenuItem>;
    }

    handleClick() {
        const win = app.createElement(LoginWindow);
        app.addElement(win);
    }
}

export default LoginMenu;