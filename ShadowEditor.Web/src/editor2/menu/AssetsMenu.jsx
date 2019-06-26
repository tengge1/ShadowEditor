import { PropTypes, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 资源菜单
 * @author tengge / https://github.com/tengge1
 */
class AssetsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        return <MenuItem title={L_ASSETS}>
            <MenuItem title={L_EXPORT_GEOMETRY}></MenuItem>
            <MenuItem title={L_EXPORT_OBJECT}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_EXPORT_GLTF}></MenuItem>
            <MenuItem title={L_EXPORT_OBJ}></MenuItem>
            <MenuItem title={L_EXPORT_PLY}></MenuItem>
            <MenuItem title={L_EXPORT_STL_BINARY}></MenuItem>
            <MenuItem title={L_EXPORT_STL}></MenuItem>
        </MenuItem>;
    }
}

export default AssetsMenu;