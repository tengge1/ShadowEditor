import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 场景菜单
 * @author tengge / https://github.com/tengge1
 */
class SceneMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        alert('Hello, world!');
    }

    render() {
        return <MenuItem title={L_SCENE}>
            <MenuItem title={L_NEW}>
                <MenuItem title={L_EMPTY_SCENE} onClick={this.handleClick}></MenuItem>
                <MenuItem title={L_GIS_SCENE}></MenuItem>
            </MenuItem>
            <MenuItem title={L_SAVE}></MenuItem>
            <MenuItem title={L_SAVE_AS}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_EXPORT_SCENE}></MenuItem>
        </MenuItem>;
    }
}

export default SceneMenu;