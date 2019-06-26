import { PropTypes, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 组件菜单
 * @author tengge / https://github.com/tengge1
 */
class ComponentMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        return <MenuItem title={L_COMPONENT}>
            <MenuItem title={L_BACKGROUND_MUSIC}></MenuItem>
            <MenuItem title={L_PARTICLE_EMITTER}></MenuItem>
            <MenuItem title={L_SKY}></MenuItem>
            <MenuItem title={L_FIRE}></MenuItem>
            <MenuItem title={L_WATER}></MenuItem>
            <MenuItem title={L_SMOKE}></MenuItem>
            <MenuItem title={L_CLOTH}></MenuItem>
        </MenuItem>;
    }
}

export default ComponentMenu;