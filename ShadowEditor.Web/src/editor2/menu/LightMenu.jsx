import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 光源菜单
 * @author tengge / https://github.com/tengge1
 */
class LightMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        const { className, style } = this.props;

        return <MenuItem title={L_LIGHT}>
            <MenuItem title={L_AMBIENT_LIGHT}></MenuItem>
            <MenuItem title={L_DIRECTIONAL_LIGHT}></MenuItem>
            <MenuItem title={L_POINT_LIGHT}></MenuItem>
            <MenuItem title={L_SPOT_LIGHT}></MenuItem>
            <MenuItem title={L_HEMISPHERE_LIGHT}></MenuItem>
            <MenuItem title={L_RECT_AREA_LIGHT}></MenuItem>
        </MenuItem>;
    }
}

export default LightMenu;