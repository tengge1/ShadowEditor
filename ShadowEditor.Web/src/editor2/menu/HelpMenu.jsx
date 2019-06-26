import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 帮助菜单
 * @author tengge / https://github.com/tengge1
 */
class HelpMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        return <MenuItem title={L_HELP}>
            <MenuItem title={L_SOURCE}></MenuItem>
            <MenuItem title={L_EXAMPLES}></MenuItem>
            <MenuItem title={L_DOCUMENTS}></MenuItem>
            <MenuItem title={L_ABOUT}></MenuItem>
        </MenuItem>;
    }
}

export default HelpMenu;