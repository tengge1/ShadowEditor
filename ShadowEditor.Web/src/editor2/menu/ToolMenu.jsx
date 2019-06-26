import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 工具菜单
 * @author tengge / https://github.com/tengge1
 */
class ToolMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        return <MenuItem title={L_TOOL}>
            <MenuItem title={L_ARRANGE_MAP}></MenuItem>
            <MenuItem title={L_ARRANGE_MESH}></MenuItem>
            <MenuItem title={L_ARRANGE_THUMBNAIL}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_EXPORT_EDITOR}></MenuItem>
        </MenuItem>;
    }
}

export default ToolMenu;